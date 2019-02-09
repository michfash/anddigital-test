# Anddigital-test
Hacker news client. Fetches the HN data from the official API (https://github.com/HackerNews/API).
## Functionalities
- Load all top stories.
- Load individual story details.
- View story comments.
- Automated tests.
## How to run the App
To avoid CORS issues, it is recommended that application is installed on a web server.
- Git clone this repository to the server. i.e. `git clone https://github.com/michfash/anddigital-test.git`
- Visit app in a browser using the app url. E.g. http://anddigital-test.local
- The index page lists 10 top HN stories, click 'load more' at the bottom of the page to load more stories asynchronously and click 'view comments' to view story comments.
- Contact Michael, micahel@apexcreation.co.uk, if you encounter any issues.
## Automated Tests
Jest (and Babel) is used to run automated tests for the Api and Date services. Run `npm install` command to install packages and `npm test` or `npm run test` command in CLI to run the tests suites.