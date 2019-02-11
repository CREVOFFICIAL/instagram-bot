# Known Bugs:
1. `[ERROR] login: The username you entered doesn't belong to an account. Please check your username and try again. (restart bot and retry...)`
* Why happen? Instagram desktop is in overcapacity. Happen at 12-14 and 19-21 all days. 
* Solution: Login in other time or Logout from your instagram app, and login again. Reboot bot and retry... Try and retry, and retry, and retry... Or stop bot and wait 2-3h...

2. `Error: Protocol error (Page.captureScreenshot): Target closed.`
* Why happen? macOS don't support correctly screenshot from puppeteer
* Solution: set `screenshot` on `false` in `config.js`

3. `This code is no longer valid. Please request a new one. (400) (/accounts/login/ajax/two_factor/)` 
* Why happen? Instagram bug at login
* Solution: disable at moment 2FA or try old version of chrome (edit `config.js` set `executable_path`)