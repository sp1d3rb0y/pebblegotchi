var url = 'http://192.168.44.44:8666/api/v1/mesh/data'

function request(url, type, callback) {
  var errorCallback = function(e) { Pebble.postMessage({'error': e}); };
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
      if (xhr.status >= 400 && xhr.status < 600) {
	  errorCallback("unit up, but API error");
      } else {
	  callback(this.responseText);
      }
  }
  xhr.open(type, url);
  xhr.timeout = 10000;
  xhr.ontimeout = errorCallback("no unit detected :(");
  xhr.send();
}

// https://developer.pebble.com/docs/pebblekit-js/Pebble/#on
Pebble.on('message', function(event) {
  var message = event.data;

  if (message.fetch) {
      request(url, 'GET', function(respText) {
	  var meshdata = JSON.parse(respText);
	  Pebble.postMessage({
	      'meshdata': meshdata
	  });
      });
  }
});
