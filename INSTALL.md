# Setup - Docker Raspbian 9 (Recommended)
#### 1. Install docker 
1. `curl -sSL https://get.docker.com | sh`
2. `sudo usermod -aG docker pi`

#### 2. Run docker
Edit `/path/to/config.js` with your config for push to docker. Bot start automatically.
```sh
docker run --restart=always --name=instagram-bot -d -v /path/to/config.js:/app/configs/config.js socialmanagertools/instagram-bot.js:armv8
```

**AVAILABLE TAGS:** `amd64` (64bit), `i386` (32bit),`armv7` (Raspberry PI 2), `armv8` (Raspberry PI 3)

**WARNING:** with docker is mandatory edit `config.js` and set `chrome_headless` on `true` and set `executable_path` to `/usr/bin/chromium-browser`. Without this fix docker don't work.

# Setup - Raspbian 9
#### 1. Install chromium v65
- `apt-get install chromium-browser`

#### 2. Install Node v8
1. `curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh `
2. `sudo bash nodesource_setup.sh`
3. `rm nodesource_setup.sh`
4. `sudo apt-get install nodejs`

#### 3. Update chromium v65 to v69
```
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/15466406/+files/chromium-codecs-ffmpeg-extra_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/15466406/+files/chromium-codecs-ffmpeg_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/15466406/+files/chromium-browser_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb

sudo dpkg -i chromium-codecs-ffmpeg-extra_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
sudo dpkg -i chromium-codecs-ffmpeg_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
sudo dpkg -i chromium-browser_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
sudo apt-get install -f
```

#### 4. Run
1. Run `npm install instagrambotlib`
2. Get [config.js](https://raw.githubusercontent.com/social-manager-tools/instagram-bot-lib/master/config.js.tpl) file for step 3, fill it properly and remove `.tpl` suffix.
3. On your code require library and run bot, example:
```
    const config = require ("./config");
    const Bot = require("instagrambotlib");
    let bot = new Bot(config);
    bot.start();
```
4. If work add star :star: at this project :heart:
5. If you want help me: **[donate on paypal](http://paypal.ptkdev.io)** or become a **[backer on patreon](http://patreon.ptkdev.io)**.

#### 5. Use raspbian chromium, not the node_modules version
- Edit `config.js` and set `executable_path` to `/usr/bin/chromium-browser` in puppeteer section.

#### 6. You don't have monitor?
- Edit `config.js` and set `chrome_headless` to `true`, is mandatory.

# Setup - Raspbian 8
#### 1. Install chromium v60
- `apt-get install chromium-browser`

#### 2. Install Node v8
1. `curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh `
2. `sudo bash nodesource_setup.sh`
3. `rm nodesource_setup.sh`
4. `sudo apt-get install nodejs`

#### 3. Update chromium v60 to v69
```
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/15466406/+files/chromium-codecs-ffmpeg-extra_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/15466406/+files/chromium-codecs-ffmpeg_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/15466406/+files/chromium-browser_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb

sudo dpkg -i chromium-codecs-ffmpeg-extra_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
sudo dpkg -i chromium-codecs-ffmpeg_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
sudo dpkg -i chromium-browser_69.0.3497.100-0ubuntu0.16.04.1_armhf.deb
sudo apt-get install -f
```

#### 4. If you have problem with libc dependieces you need update raspbian to testing:
- Edit `sudo vi /etc/apt/source.list` and switch `stretch` to `testing`
- Run `sudo apt-get update && sudo apt-get dist-upgrade`

#### 5. Run
1. Run `npm install instagrambotlib`
2. Get [config.js](https://raw.githubusercontent.com/social-manager-tools/instagram-bot-lib/master/config.js.tpl) file for step 3, fill it properly and remove `.tpl` suffix.
3. On your code require library and run bot, example:
```
    const config = require ("./config");
    const Bot = require("instagrambotlib");
    let bot = new Bot(config);
    bot.start();
```
4. If work add star :star: at this project :heart:
5. If you want help me: **[donate on paypal](http://paypal.ptkdev.io)** or become a **[backer on patreon](http://patreon.ptkdev.io)**.

#### 6. Use raspbian chromium, not the node_modules version
- Edit `config.js` and set `executable_path` to `/usr/bin/chromium-browser` in puppeteer section:

#### 7. You don't have monitor?
- Edit `config.js` and set `chrome_headless` to `true`, is mandatory.

# Setup - Debian Server
#### 1. Install bot dependencies:
1. `sudo apt-get install build-essential xvfb libssl-dev curl wget git chromium xauth`

#### 2. Install Node on Debian
1. `curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh `
2. `sudo bash nodesource_setup.sh`
3. `rm nodesource_setup.sh`
4. `sudo apt-get install nodejs`

#### 3. Run
1. Download [stable bot version](https://github.com/social-manager-tools/instagram-bot.js/releases) and extract it.
2. Run `npm install` in `instagram-bot.js` folder.
3. Get [config.js](https://raw.githubusercontent.com/social-manager-tools/instagram-bot-lib/master/config.js.tpl), rename `config.js.tpl` to `config.js`, fill it properly.
4. Start the bot via `node bot.js`
5. If work add star :star: at this project :heart:
6. If you want help me: <b><a href="http://paypal.ptkdev.io">donate on paypal</a></b> or become a <b><a href="http://patreon.ptkdev.io">backer on patreon</a></b>.

#### 4. You don't have monitor?
- Edit `config.js` and set `chrome_headless` to `true`, is mandatory.

# Pin
If you received sms or email pin edit `loginpin.txt` and insert it on first line. Wait 50-60 seconds...

# Check if work:
See logs with pm2: `cat ./logs/debug.log` or png images in ./logs/screenshot
