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
  clockData.time = d.toLocaleTimeString().replace(/:\d+($| )/, '$1');

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
  drawMeshData(ctx, meshdata, error);
});

function drawMeshData(ctx, meshdata, error) {
  var centerX = ctx.canvas.unobstructedWidth / 2;
  var offsetY = (ctx.canvas.clientHeight - ctx.canvas.unobstructedHeight) / 2;
  var face = "(X__X)";

  // White on black will consume less <3
  ctx.fillStyle = 'white';

  // First line: APs + Uptime if up, else time
  ctx.font = '24px bold Gothic';
  if (meshdata.length > 0) {
      ctx.textAlign = 'left';
      ctx.textAlign = 'right';
  } else {
      ctx.textAlign = 'center';
      ctx.fillText(clockData.time, centerX, offsetY);
  }

  // Second line: Name + status if up, else date
  if (meshdata.length > 0) {
      ctx.textAlign = 'left';
      ctx.textAlign = 'right';
  } else {
      ctx.textAlign = 'center';
      ctx.fillText(clockData.date, centerX, (26 - offsetY));
  }

  // Face line
  ctx.textAlign = 'center';
  ctx.font = '42px bold Bitham';
  if (meshdata.length > 0) {
      face = meshdata.face;
  }
  ctx.fillText(face, centerX, (50 - offsetY));

  // Fourth line: ssid if up, else nothing
  ctx.font = '24px bold Gothic';
  if (meshdata.length > 0) {
  }

  // Fifth line: Handshakes + total unique networks if up, else error
  if (meshdata.length > 0) {
      ctx.textAlign = 'left';
      ctx.textAlign = 'right';
  } else {
      ctx.font = '18px Gothic';
      ctx.textAlign = 'center';
      ctx.fillText(error, centerX, 146 - offsetY);
  }
}
