# v0.9.10 (04 November, 2018)
* Developers: [Guidelines](https://github.com/social-manager-tools/instagram-bot-lib/blob/nightly/DEV_GUIDELINES.md) for contributing at project.
* Test: add mocha and chai
* Fix: fdfmode_classic loop bug
* Upgrade: puppeteer v1.7.0


# v0.9.9 (16 October, 2018)
* Fix: fdfmode_classic #42 (again again...)
* Fix: 2FA (Location)
* Fix: Close button (ui)
* Fix: lose connection bot stop, now retry work.


# v0.9.8 (14 October, 2018)
* Fix: fdfmode_classic #42 (again)
* Fix: 2FA doesn't work #48 (after 3 months... thanks instagram!)
* Update: default value of `chrome_headless` is `true`
* Update: all library of package.json


# v0.9.7 (08 October, 2018)
* Fix: fdfmode_classic #42


# v0.9.6 (05 October, 2018)
* Fix: login random don't work


# v0.9.5 (02 October, 2018)
* Fix: likemode_classic new instagram selectors
* Fix: likemode_realistic new instagram selectors
* Fix: likemode_superlike new instagram selectors
* Fix: likemode_competitor_users new instagram selectors
* Fix: comment_mode new instagram selectors
* Fix: fdfmode_classic new instagram selectors
* API: Fix stop() again, now really work.


# v0.9.4 (26 September, 2018)
* Fix: API::stop() now work correctly
* Fix: Follow/Defollow Mode Realistic random userpage is 404
* Fix: docker container (by [Julian Xhokaxhiu](https://github.com/julianxhokaxhiu)) #95
* Upgrade: puppeteer v1.6.2


# v0.9.3 (22 September, 2018)
* Fix: Follow/Defollow Mode Realistic stop working if photo or account are removed
* Fix: Like Mode Realistic correct like/don't like message
* Performance: all actions are now fastest than 1-2 seconds


# v0.9.2 (15 September, 2018)
* Downgrade: puppeteer v1.4.0 (#27)


# v0.9.1 (15 September, 2018)
* Fix: Node is either not visible or not an HTMLElement (#82 #86 #84)
* Fix: Random crash of Follow/Defollow Mode Realistic
* Refactor: 2FA flow
* Update: New user-agent
* Upgrade: puppeteer v1.8.0


# v0.9.0b (09 September, 2018)
* Fix: bad creation of folders `databases` and `logs` (#79)


# v0.9.0 (08 September, 2018)
* Feature: Follow/Defollow Mode (#77)
* Feature: Support sqllite connector (#70)
* Fix: Like Realistic random freeze
* Fix: Comment Mode don't work
* Fix: Like Competitor Mode (#76)
* API: stop() | stop the bot from your application
* Update: bot_fastlike_min and max from config.js now all mode use bot_likeday_min and max
* Update: bot_sleep_night disabled at default
* Upgrade: puppeteer v1.7.0


# v0.8.2 (26 July, 2018)
* Fix: default path of logs in `config.js.tpl`


# v0.8.1 (25 July, 2018)
* Fix: Unliking already liked pictures (all mode) [Bug: #59]
* Fix: Commenting already commented pictures
* Update: `likemode_realistic` now is default mode in `config.js.tpl`
* Update: `900` now is default value of max like/day in `config.js.tpl`


# v0.8.0 (17 July, 2018)
* Fix: path of logs and screenshot


# v0.7.5c and v0.7.5d (11 July, 2018)
* Fix: likemode_superlike timeout error


# v0.7.5b (09 July, 2018)
* Feature: path log/pin and uifix() for social-manager-tools app


# v0.7.5 (03 July, 2018)
* Update: Porting of instagram-bot.js v0.7.5


# v0.7.4c (29 June, 2018)
* Fix: Porting of instagram-bot.js v0.7.4


# v0.7.4b (28 June, 2018)
* Update: Porting of instagram-bot.js v0.7.4


# v0.6.1 (20 February, 2018)
* Update: Porting of instagram-bot.js v0.6.1
