// import API module
import Api from './api.js';

//initialise connection to Hacker News API - get top stories
const apiServiceStories = new Api('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json', true);
// console.log(apiServiceStories);

//manipulate DOM elements when readyState attribute changes
apiServiceStories.connection.onreadystatechange = () => {
  if (apiServiceStories.connection.readyState === 4 && apiServiceStories.connection.status === 200) {
    let topStoriesIds = JSON.parse(apiServiceStories.connection.response);
    // console.log(topStoriesIds.length);

    //load top stories id and get story details
    let storiesLimit = 5;//stories limit - TODO - nice to have a more functionality
    loadStoriesDetails(topStoriesIds, storiesLimit);//call loadStoriesDetails function

    //hide loading.. element
    const loadingStories = document.getElementById("loading-top-stories");
    loadingStories.classList.add("hide");
    loadingStories.classList.remove("show");

    //show stories element
    const storiesContainer = document.getElementById("stories-container");
    storiesContainer.classList.add("show");
    storiesContainer.classList.remove("hide");
  }
};

apiServiceStories.sendRequest();//send the api request


/*
* Load stories function
*
* @function loadStoriesDetails
* @return {mixed}
*/
function loadStoriesDetails(topStoriesIds, storiesLimit) {
  if (typeof topStoriesIds === 'undefined') throw new Error('Stories Ids must be provided');

  let storiesLength = topStoriesIds.length;
  // console.log(storiesLimit);
  for (let i = 0; i < storiesLimit; i++) {
    // console.log(topStoriesIds[i]);

    //initialise connection to Hacker News API - get individual story by id
    const apiServiceStory = new Api('GET', `https://hacker-news.firebaseio.com/v0/item/${topStoriesIds[i]}.json`);
    // apiServiceStory.responseType = 'json';
    apiServiceStory.connection.onreadystatechange = () => {
      let story = JSON.parse(apiServiceStory.connection.response);
      buildDOMElements(story);//build DOM elements for story
    };
    apiServiceStory.sendRequest();//send the api request
  }
}

/*
* Build DOM elements for story function
*
* @function buildDOMElements
* @param story {json}
* @return {mixed}
*/
function buildDOMElements(story) {
  //TO DO comment properly
  if (typeof story === 'undefined') throw new Error('Story must be provided');

  let storyThread = `https://news.ycombinator.com/item?id=${story.id}`;
  let storyAuthorLink = `https://news.ycombinator.com/user?id=${story.by}`;

  let storyContainer = document.createElement('div');
  let storyWrapper = document.createElement('div');
  let storyCount = document.createElement('span');

  storyWrapper.appendChild(storyCount);

  let storyTitle = document.createElement('p');
  let storyUrl = document.createElement('a');

  let storyMetaContainer = document.createElement('p');
  let storyScore = document.createElement('span');
  let storyAuthor = document.createElement('span');
  let storyCreated = document.createElement('span');
  let storyComments = document.createElement('span');

  storyUrl.textContent = story.title;
  storyUrl.href = story.url != undefined ? story.url : storyThread;
  storyUrl.target = '_blank';
  storyUrl.addClass = ''
  storyScore.innerHTML = `<b>${story.score}</b> points   | `;
  storyAuthor.innerHTML = ` By <a href="${storyAuthorLink}" target="_blank" class="spa"><b>${story.by}</b></a> | `;
  storyCreated.textContent = story.time;
  storyComments.innerHTML = `<a href="${storyThread}" target="_blank" class="spa"> <b>${story.descendants}</b> comments</a>`;

  storyWrapper.appendChild(storyUrl);

  storyMetaContainer.appendChild(storyScore);
  storyMetaContainer.appendChild(storyAuthor);
  storyMetaContainer.appendChild(storyCreated);
  storyMetaContainer.appendChild(storyComments);

  storyWrapper.appendChild(storyMetaContainer);


  storyContainer.appendChild(storyWrapper);
  document.body.appendChild(storyContainer);
}