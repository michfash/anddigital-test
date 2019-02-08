// import API module
import Api from './providers/api.js';
import DateService from './providers/date.js';

/*Load top stories - calls function when page loaded*/
loadTopStories();

/*Load more stories when 'load-more-stories' is clicked*/
const loadMoreStories = document.getElementById('load-more-stories');
loadMoreStories.onclick = () => {
  loadTopStories();
}

const dateService = new DateService();//initialise date object

/*
* Load stories details function
*
* @function loadTopStories
* @return {mixed}
*/
function loadTopStories() {

  //initialise connection to Hacker News API - get top stories
  const apiServiceStories = new Api('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json');

  //loop through top stories and build DOM elements when readyState attribute changes
  apiServiceStories.connection.onreadystatechange = () => {
    if (apiServiceStories.connection.readyState === 4 && apiServiceStories.connection.status === 200) {
      let topStoriesIds = JSON.parse(apiServiceStories.connection.response);

      //load top stories id and get story details
      let storiesLimit = 10;//stories limit
      loadStoriesDetails(topStoriesIds, storiesLimit);//call loadStoriesDetails function
    }
  };

  apiServiceStories.sendRequest();//send the api request
}

/*
* Load stories details function
*
* @function loadStoriesDetails
* @param topStoriesIds {array}
* @param storiesLimit {number}
* @return {mixed}
*/
function loadStoriesDetails(topStoriesIds, storiesLimit) {
  if (typeof topStoriesIds === 'undefined') throw new Error('Stories Ids must be provided');

  let storiesLength = topStoriesIds.length;
  
  for (let i = 0; i < storiesLimit; i++) {

    //initialise connection to Hacker News API - get individual story by id
    const apiServiceStory = new Api('GET', `https://hacker-news.firebaseio.com/v0/item/${topStoriesIds[i]}.json`);

    apiServiceStory.connection.onreadystatechange = () => {
      if (apiServiceStory.connection.readyState === 4 && apiServiceStory.connection.status === 200) {
        let story = JSON.parse(apiServiceStory.connection.response);
        buildDOMElements(story);//build DOM elements for story
      }
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
  if (typeof story === 'undefined') throw new Error('Story must be provided');//throw an error if story is undefined

  //get/create DOM elements and data placeholders
  const loadingStories = document.getElementById("loading-top-stories");
  const storiesContainer = document.getElementById("stories-container");
  const storiesList = document.getElementById("stories-list");

  const storyDetails = document.createElement('li');
  const storyTitle = document.createElement('p');
  const storyUrl = document.createElement('a');
  const storyMetaContainer = document.createElement('div');
  const storyScore = document.createElement('span');
  const storyAuthor = document.createElement('span');
  const storyCreated = document.createElement('span');
  const storyComments = document.createElement('span');
  const viewComments = document.createElement('span');

  //prepare story data and populate corresponding placeholders
  let storyThread = `https://news.ycombinator.com/item?id=${story.id}`;
  let storyAuthorLink = `https://news.ycombinator.com/user?id=${story.by}`;
  let storyTimeMillisec = story.time * 1000;//time in milliseconds

  storyUrl.textContent = story.title;
  storyUrl.href = story.url != undefined ? story.url : storyThread;
  storyUrl.target = '_blank';
  storyScore.innerHTML = `${story.score} points `;
  storyAuthor.innerHTML = ` by <a href="${storyAuthorLink}" target="_blank"><b>${story.by}</b></a> `;
  storyCreated.textContent = `on ${dateService.formatDate(storyTimeMillisec)}`;
  storyComments.innerHTML = ` . ${story.descendants} comments`;
  viewComments.innerHTML = `<a href="#"> . view comments</a>`;

  storyDetails.appendChild(storyUrl);
  storyMetaContainer.appendChild(storyScore);
  storyMetaContainer.appendChild(storyAuthor);
  storyMetaContainer.appendChild(storyCreated);
  storyMetaContainer.appendChild(storyComments);
  storyMetaContainer.appendChild(viewComments);
  storyDetails.appendChild(storyMetaContainer);

  //add id/class to DOM elements
  storyDetails.classList.add('story-details');
  storyTitle.classList.add('story-title');
  storyScore.classList.add('story-score');
  storyMetaContainer.classList.add('meta-container');
  storyAuthor.classList.add('story-author');
  storyCreated.classList.add('story-created');
  storyComments.classList.add('story-comments');
  viewComments.classList.add('view-comments');

  storyDetails.id = `story-${story.id}`;
  storyDetails.dataset.index = story.index;
  viewComments.dataset.storyId = story.id;
  viewComments.dataset.kids = story.kids;
  viewComments.dataset.storyTitle = story.title;

  viewComments.addEventListener("click", fnViewComments);//add click event listener

  //append story details to stories container
  storiesList.appendChild(storyDetails);
  
  //hide loading.. element
  loadingStories.classList.add("hide");
  loadingStories.classList.remove("show");

  //show stories element
  storiesContainer.classList.add("show");
  storiesContainer.classList.remove("hide");
}


/*
* Load story comments when 'view comments' is clicked
*
* @function fnViewComments
* @return {mixed}
*/
function fnViewComments() {
  //get comments ids
  let commentsIds = this.getAttribute('data-kids');
  let storyId = this.getAttribute('data-story-id');
  let storyTitle = this.getAttribute('data-story-title');

  //do not create modal if already created, load from DOM
  let modalExist = document.getElementById(`comment-modal-${storyId}`);

  if (modalExist == null) {
    // console.log('Modal doesn't exist');
  } else {
    //modal already exists, display it and exit
    modalExist.style.display = 'block';
    return;
  }

  //create modal placeholders
  const commentModal = document.createElement('div');
  const modalTitle = document.createElement('h2');
  const modalContent = document.createElement('div');
  const closeModal = document.createElement('span');

  //add id/class to DOM elements
  commentModal.classList.add('comment-modal');
  modalContent.classList.add('modal-content');
  closeModal.classList.add('close-modal');

  commentModal.id = `comment-modal-${storyId}`;
  closeModal.id = `close-modal-${storyId}`;

  //add content to DOM element
  closeModal.textContent = 'X';
  modalTitle.textContent = storyTitle;

  //append comment modal to view comment
  modalContent.appendChild(closeModal);
  modalContent.appendChild(modalTitle);
  commentModal.appendChild(modalContent);
  this.parentNode.appendChild(commentModal);

  //open the modal
  commentModal.style.display = "block";

  //close modal when user clicks (x)
  let closeBtn = document.getElementById(`close-modal-${storyId}`);

  closeBtn.onclick = () => {
    commentModal.style.display = "none";
  }

  //loop through comment ids and get comment details
  let commentsIdsArray = commentsIds.split(',');

  for (let i = 0; i < commentsIdsArray.length; i++) {

    //initialise connection to Hacker News API - get individual comment by id
    const apiServiceComment = new Api('GET', `https://hacker-news.firebaseio.com/v0/item/${commentsIdsArray[i]}.json`);

    apiServiceComment.connection.onreadystatechange = () => {
      if (apiServiceComment.connection.readyState === 4 && apiServiceComment.connection.status === 200) {
        let comment = JSON.parse(apiServiceComment.connection.response);

        //create comment DOM elements
        const commentContainer = document.createElement('div');
        const commentMeta = document.createElement('div');
        const commentContent = document.createElement('p');
        // const commentReplies = document.createElement('div');

        //add id/class to DOM elements
        commentContainer.classList.add('comment-container');
        commentMeta.classList.add('comment-meta');
        // commentReplies.classList.add('comment-replies');

        //append comment to modal
        commentContainer.appendChild(commentMeta);
        commentContainer.appendChild(commentContent);
        // commentContainer.appendChild(commentReplies);
        modalContent.appendChild(commentContainer);

        //add content to DOM element
        let commentTimeMillisec = comment.time * 1000;//timestamp in milliseconds
        commentMeta.textContent = `By ${comment.by} on ${dateService.formatDate(commentTimeMillisec)}`;
        commentContent.innerHTML = comment.text;
        // let commentsRepliesArray = comment.kids.split(',');
        // commentReplies.textContent = `${commentsRepliesArray.length} replies`;
        // commentReplies.textContent = `${comment.kids.length} replies`;
      }
    };
    apiServiceComment.sendRequest();//send the api request
  }
}