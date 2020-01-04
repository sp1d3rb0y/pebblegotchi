/**
{
    "aps":"1 (29)",
    "channel":"*",
    "cpu":0.24692407498545926,
    "epoch":2,
    "face":"(\u2609_\u2609 )",
    "friend_face_text":"(\u2609_\u2609 )",
    "friend_name_text":"\u258c\u258c\u258c\u258c bunny 17 (52)",
    "identity":"dc8fae09de6333330de1da2077f7133e5ed66bff3ee72ad499eb911a84be3ce1",
    "memory":0.8,
    "mode":"  AI",
    "name":"chiba",
    "num_peers":1,
    "peers":
        [{
        "face":"( \u2686_\u2686)",
        "identity":"5a333337551174eb033ee5f2d2e07271c57946cfcf7655dd3019eb3e2ce10",
        "name":"bunny",
        "pwnd_run":17,
        "pwnd_tot":52
        }],
    "pwnd_run":2,
    "pwnd_tot":34,
    "status":"...",
    "temperature":43,
    "uptime":"01:55:16",
    "version":"1.2.1"
}
*/

var rocky = require('rocky');

// An object to cache our date & time values,
// to minimize computations in the draw handler.
var clockData = {
  time: '',
  date: ''
};

// Global object to store unit's mesh data and error
var meshdata;
var error;

rocky.on('message', function(event) {
    // Receive message from the mobile device
    var message = event.data;

    if (message.meshdata) {
	meshdata = message.meshdata;
	error = {};
    } else if (message.error) {
	meshdata = {};
	error = message.error;
    }

    // request a redraw
    rocky.requestDraw();
});

// Every minute
// https://developer.pebble.com/docs/rockyjs/rocky/#on
rocky.on('minutechange', function(event) {
  // Current date/time
  // https://developer.pebble.com/docs/rockyjs/Date/
  var d = event.date;

  // Get current time, based on 12h or 24h format (01:00 or 1:00 AM)
  var hours = d.toLocaleTimeString(undefined, {hour: '2-digit'});
  var minutes = d.toLocaleTimeString(undefined, {minute: '2-digit'});
  clockData.time = hours + ':' + minutes;

  // Day of month
  var day = d.toLocaleDateString(undefined, ({day: 'numeric'}));

  // Month name
  var month = d.toLocaleDateString(undefined, ({month: 'long'}));

  // Date
  clockData.date = (day + ' ' + month);

  // Ask mobile device to fetch unit's data
  rocky.postMessage({'fetch': true});

  // Force screen redraw
  rocky.requestDraw();
});

// Redraw the screen
rocky.on('draw', function(event) {
  // Drawing canvas
  var ctx = event.context;

  // Clear the canvas
  // https://developer.pebble.com/docs/rockyjs/CanvasRenderingContext2D/#Canvas
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // PwnData
  drawMeshData(ctx);
});

function drawMeshData(ctx) {
  var centerX = ctx.canvas.unobstructedWidth / 2;
  var offsetY = (ctx.canvas.clientHeight - ctx.canvas.unobstructedHeight) / 2;
  var face = "(X__X)";

  // White on black will consume less <3
  ctx.fillStyle = 'white';

  // First line: APs + Uptime if up, else time
  ctx.font = '18px Gothic';
  if (Object.keys(meshdata).length > 0) {
      ctx.textAlign = 'left';
      ctx.fillText("C:" + meshdata.channel_text + " A:" + meshdata.aps_text, 0, offsetY);
      ctx.textAlign = 'right';
      ctx.fillText(meshdata.uptime, ctx.canvas.unobstructedWidth, offsetY);
  } else {
      ctx.font = '24px bold Gothic';
      ctx.textAlign = 'center';
      ctx.fillText(clockData.time, centerX, offsetY);
  }

  // Second line: Name + status if up, else date
  if (Object.keys(meshdata).length > 0) {
      ctx.textAlign = 'left';
      ctx.fillText(meshdata.name + '> ' + meshdata.status, 0, (26 - offsetY));
  } else {
      ctx.font = '24px bold Gothic';
      ctx.textAlign = 'center';
      ctx.fillText(clockData.date, centerX, (26 - offsetY));
  }

  // Face line
  ctx.textAlign = 'center';
  ctx.font = '42px bold Bitham';
  if (Object.keys(meshdata).length > 0) {
      face = meshdata.face;
  }
  ctx.fillText(face, centerX, (50 - offsetY));

  // Fourth line: ssid if up, else nothing
  ctx.font = '24px bold Gothic';
  if (Object.keys(meshdata).length > 0) {
      ctx.textAlign = 'center';
      ctx.fillText(meshdata.pwnd_last, centerX, 110 - offsetY);
  }

  // Fifth line: Handshakes + total unique networks + temp if up, else error
  ctx.font = '18px Gothic';
  if (Object.keys(meshdata).length > 0) {
      ctx.textAlign = 'left';
      ctx.fillText("PWN:" + meshdata.pwnd_run + "(" + meshdata.pwnd_tot + ")", 0, 146 - offsetY);
      ctx.textAlign = 'right';
      ctx.fillText(meshdata.temperature + "°", ctx.canvas.unobstructedWidth, 146 - offsetY);
  } else {
      ctx.textAlign = 'center';
      ctx.fillText(error, centerX, 146 - offsetY);
  }
}
