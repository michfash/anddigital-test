/*API Class*/
export default class Api {

  //class constructor
  constructor(method, url, send_async = true) {

    //set object properties
    this.connection = {};
    this.topStoriesIds;
    //set properties using provided arguments
    if (send_async) this.send_async = send_async;//use send_async if provided
    this.method = method;
    this.url = url;

    //establish connection
    this.establishConnection(this.method, this.url, this.send_async);
  }

  /*
  * Establish connection method
  *
  * @method establishConnection
  * @param method {string}
  * @param url {string}
  * @param send_async {boolean}
  * @return {none}
  */
  establishConnection(method, url, send_async) {
    if (typeof method === 'undefined') throw new Error('Api connection error: request method must be provided');//request method must be provided
    if (typeof url === 'undefined') throw new Error('Api connection error: endpoint url must be provided');//endpoint url must be provided
    
    // Create a new XMLHttpRequest object
    this.connection = new XMLHttpRequest();

    //add event listeners to monitor the progress of the request
    this.connection.addEventListener("progress", this.updateProgress);
    this.connection.addEventListener("load", this.transferComplete);
    this.connection.addEventListener("error", this.transferFailed);
    this.connection.addEventListener("abort", this.transferCancelled);
    this.connection.addEventListener("loadend", this.loadEnd);

    // Open a new connection
    this.connection.open(method, url, send_async);

    // Send the request
    // return this.sendRequest();
  }

  /*
  * Send the request
  *
  * @method sendRequest
  * @return {mixed}
  */
  sendRequest() {
    this.connection.onload = () => {
      // Access JSON data
      this.topStoriesIds = JSON.parse(this.connection.response);
    }

    // Send the request
    this.connection.send();
    // return this.topStoriesIds;
  }

  /*
  * Get top stories IDs
  *
  * @method getStoriesIds
  * @return {mixed}
  */
  getStoriesIds() {
    return this.topStoriesIds;
  }
  
  /*
  * Monitor request progress - progress on transfers from the server to the client (downloads)
  *
  * @method updateProgress
  * @return {mixed}
  */
  updateProgress (oEvent) {
    // console.log(oEvent);
    if (oEvent.lengthComputable) {
      var percentComplete = oEvent.loaded / oEvent.total * 100;
      return `Progress: ${percentComplete}`;// transfer progress ...
    } else {
      return 'Total size unkown - Unable to compute progress information'; // Unable to compute progress information since the total size is unknown
    }
  }
  
  /*
  * Monitor request progress - transfer completed
  *
  * @method transferComplete
  * @return {mixed}
  */
  transferComplete(evt) {
    return 'The transfer is complete';
    console.log("The transfer is complete.");
  }
  
  /*
  * Monitor request progress - transfer finished
  *
  * @method loadEnd
  * @return {mixed}
  */
  loadEnd(evt) {
    return 'The transfer is finished';
    console.log("The transfer is finished.");
  }
  
  /*
  * Monitor request progress - transfer failed
  *
  * @method transferFailed
  * @return {mixed}
  */
  transferFailed(evt) {
    return `An error occured - ${evt}`;
    console.log("An error occurred while transferring the file.");
  }
  
  /*
  * Monitor request progress - transfer cancelled
  *
  * @method transferCancelled
  * @return {mixed}
  */
  transferCancelled(evt) {
    return 'The transfer has been cancelled';
    console.log("The transfer has been cancelled by the user.");
  }
}