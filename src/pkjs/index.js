var url = 'http://192.168.44.44:8080/plugins/state-api/json';
var username = 'changeme';
var password = 'changeme';

// Encode/Decode base64 library from http://www.webtoolkit.info/javascript-base64.html
var base64 = {
  encode : function(input) {
  	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  	var chr1, chr2, chr3, enc1, enc2, enc3, enc4, output = '', i = 0;
  	do {
  		chr1 = input.charCodeAt(i++);
  		chr2 = input.charCodeAt(i++);
  		chr3 = input.charCodeAt(i++);
  		enc1 = chr1 >> 2;
  		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
  		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
  		enc4 = chr3 & 63;
  		if (isNaN(chr2)) { enc3 = enc4 = 64; } else if (isNaN(chr3)) { enc4 = 64; }
  		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
  		chr1 = chr2 = chr3 = enc1 = enc2 = enc3 = enc4 = '';
  	} while (i < input.length);
  	return output;
  },
  decode : function(input) {
  	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  	var chr1, chr2, chr3, enc1, enc2, enc3, enc4, output = '', i = 0;
  	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  	do {
  		enc1 = keyStr.indexOf(input.charAt(i++));
  		enc2 = keyStr.indexOf(input.charAt(i++));
  		enc3 = keyStr.indexOf(input.charAt(i++));
  		enc4 = keyStr.indexOf(input.charAt(i++));
  		chr1 = (enc1 << 2) | (enc2 >> 4);
  		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
  		chr3 = ((enc3 & 3) << 6) | enc4;
  		output = output + String.fromCharCode(chr1);
  		if (enc3 != 64) output = output + String.fromCharCode(chr2);
  		if (enc4 != 64) output = output + String.fromCharCode(chr3);
  		chr1 = chr2 = chr3 = enc1 = enc2 = enc3 = enc4 = '';
  	} while (i < input.length);
  	return output;
  }
};

function request(url, type, callback) {
  var errorCallback = function(e) { Pebble.postMessage({'error': e}); };
  var xhr = new XMLHttpRequest();

  try {
      xhr.onload = function () {
	  if (xhr.status >= 400 && xhr.status < 600) {
	      errorCallback("unit up, but API error");
	  } else {
	      callback(this.responseText);
	  }
      }
      xhr.ontimeout = function() {
	  errorCallback("no unit detected :(");
      }
      xhr.open(type, url, true);
      xhr.withCredentials = true;
      xhr.setRequestHeader('Authorization', 'Basic ' + base64.encode(username + ':' + password));
      xhr.timeout = 15000;
      xhr.send();
  }
  catch (ex) {
      console.log(ex);
  }
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
