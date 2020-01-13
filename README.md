# Pebblegotchi

Pebblegotchi is a [Pebble](https://rebble.io/) watchface able to display a [pwnagotchi's](https://pwnagotchi.ai/) advertisement data.

It acts as a remote pwnagotchi display, and refreshes data every minute.

## Features

- Displays time and date if no unit is around
- Displays monitored channel, APs information, uptime, hostname, status, captured handshakes, the SSID of the most recently acquired handshake, and the unit's temperature
- Refreshes every minute on a dark background to reduce battery consumption

## Requirements

- A working pwnagotchi unit (duh)
- The [state-api pwnagotchi plugin](https://github.com/dipsylala/pwnagotchi-state-api) (thanks dipsylala!) up and running
- The bt-tether pwnagotchi plugin up and running
- A smartphone with bluetooth tethering enabled (required for IP communication with the unit)
- A Pebble watch (only the Pebble Time is supported for now)
- The Pebble SDK to build the application

## Setup

1. Install and configure your pwnagotchi. This is outside of the scope of this documentation, however the [pwnagotchi website](https://pwnagotchi.ai/installation/) is a good place to get started.
2. Configure the bt-tether pwnagotchi plugin with your smarthpone. Only Android has been tested for now. The [pwnagotchi community website](https://community.pwnagotchi.ai/t/mini-guide-bluetooth-tether-on-android/248) holds a whole lot of helpful information.
3. Download, install and configure the [state-api plugin](https://github.com/dipsylala/pwnagotchi-state-api). The README is pretty self explanatory (download, copy state-api.py in plugins folder, copy goes_in_ui_web in the right folder, and modify your config.yml).
4. Verify that everything works fine on your phone: (re)boot the pwnagotchi in AUTO mode, wait for it to connect, and visit http://BLUETOOTH_URL:8080/plugins/state-api/json (usually 192.168.44.44, depending on what you set up in the bt-tether configuration).
5. Verify that the [src/pkjs/index.js](src/pkjs/index.js) holds the correct values to connect to your pwnagotchi (the url, username and password variables).
6. Build and install the application (see next section).

## Building and installing

You'll need the [Pebble SDK](https://developer.rebble.io/developer.pebble.com/sdk/download/index.html) installed in order to build the app. Installing the SDK is outside of the scope of this documentation, but one might want to check out [this reddit thread](https://www.reddit.com/r/pebble/comments/9i9aqy/developing_for_pebble_without_cloudpebble_windows/) to get started.

Once the SDK is installed:

```
$ pebble build
$ pebble install --phone=IP_OF_PHONE
```

The pebble install will only work if:

- Your phone is on the same network as where you're building the application
- You activated the developer server in the Pebble App (Settings->Developer mode->Developer connections)

One could alternatively manually install the produced app in build/pebblegotchi.pbw by pushing it on the phone.

## Known issues

- Only basalt is supported (Pebble Time)
- Pwnagotchi's faces are not rendered properly because Pebble's unicode support is quite poor. This will be improved in the future either by redeveloping the app in C (allowing to use custom fonts), of by rendering SVG's of the faces
- Pwnagotchi status is not properly rendered when len(status) > 16
- There's a delay of 15 seconds before anything is displayed on the watch when first launching the app
- Friends are not displayed (for now)

PR's and issues are obviously welcome in the [usual github locations](https://github.com/sp1d3rb0y/pebblegotchi/issues).
