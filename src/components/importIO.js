import importio from 'import-io';


export class ImportIO {
  constructor() {
    var that = this;
    this.client = new importio("b81b82d5-5dc6-4c91-9791-3c4279727744", "Mx8H87eDK6/vgG9rYEiMzbvpptrEYW0Ujvq/IJGHv3/vc5mE1TrPSJNPgM2OjJuM86EJRUiQcLT8Dclai1u0Rw==", "import.io");
  }

  connect() {
    var self = this;

    return new Promise(function (resolve, reject) {
      self.client.connect(connected => {
        if (!connected) {
          reject("Unable to connect");
          return;
        }

        resolve(connected);
      });
    });
  }

  query(queryObject) {
    var self = this;

    return this.connect().then(function () {
      return new Promise(function (resolve, reject) {
        // Define here a variable that we can put all our results in to when they come back from
        // the server, so we can use the data later on in the script
        var data = [];

        var callback = function(finished, message) {
          // Disconnect messages happen if we disconnect the client library while a query is in progress
          if (message.type == "DISCONNECT") {
            reject("The query was cancelled as the client was disconnected");
          }
          // Check the message we receive actually has some data in it
          if (message.type == "MESSAGE") {
            if (message.data.hasOwnProperty("errorType")) {
              // In this case, we received a message, but it was an error from the external service
              reject("Got an error!", message.data);
            } else {

              data = data.concat(message.data.results);
            }
          }
          if (finished) {
            // When the query is finished, show all the data that we received
            resolve(data);
          }
        };

        // Issue a query to a single data source with a set of inputs
        // You can modify the inputs and connectorGuids so as to query your own sources

        self.client.query(queryObject, callback);
      });
    });
  }
}
