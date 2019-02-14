/**
 * InstagramBot.js
 * =====================
 * Instagram Bot made with love and nodejs
 *
 * @author:     Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    Code and contributions have 'GNU General Public License v3'
 *              This program is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              (at your option) any later version.
 *              This program is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *              You should have received a copy of the GNU General Public License
 *              along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link        Homepage:     https://instagram.bot.ptkdev.io
 *              GitHub Repo:  https://github.com/social-manager-tools/instagram-bot.js
 */
module.exports = function (config) {
    this.config = config;
    this.browser = null;

    /**
     * API: stop()
     * =====================
     * if you want stop bot
     *
     */
    this.stop = async function () {
        await this.browser.newPage();
        await this.browser.close();
    };

    /**
     * API: start()
     * =====================
     * if you want start bot, remeber set config.js
     *
     */
    this.start = async function () {
        var bot = null;
        const fs = require("fs");
        let config = this.config;
        let sqlite3 = require("sqlite3").verbose();
        let db = [];
        const puppeteer = require("puppeteer");
        const version = require("./version");
        const LOG = require("./modules/logger/types");

        /**
         * Init
         * =====================
         * Set config options, check updates and integrity of bot
         *
         */
        let check = require("./modules/common/utils")(bot, null, config);
        if (config.ui !== true) {
            if (!fs.existsSync("./databases")) {
                fs.mkdirSync("./databases");
            }

            if (!fs.existsSync("./logs")) {
                fs.mkdirSync("./logs");
            }
        }
        db["logs"] = new sqlite3.Database(config.logdb_path);
        db["fdf"] = new sqlite3.Database(config.fdfdatabase_path);
        if (config.ui !== true) {
            await check.init_empty();
        } else if (config.ui === true) {
            config = check.fixui(config);
        }
        config = check.fixconfig(config);
        check.donate();
        check.check_updates(version.version);
        if (config.executable_path === "" || config.executable_path === false) {
            this.browser = await puppeteer.launch({
                headless: config.chrome_headless,
                args: config.chrome_options,
                defaultViewport: {"width": 1024, "height": 768}
            });
        } else {
            this.browser = await puppeteer.launch({
                headless: config.chrome_headless,
                args: config.chrome_options,
                executablePath: config.executable_path,
                defaultViewport: {"width": 1024, "height": 768}
            });
        }
        bot = await this.browser.newPage();
        bot.setViewport({"width": 1024, "height": 768});
        let user_agent = await this.browser.userAgent();
        bot.setUserAgent(user_agent.replace("Headless", ""));

        /**
         * Import libs
         * =====================
         * Modules of bot from folder ./modules
         *
         */
        let routes = require("./routes/strategies");
        let utils = require("./modules/common/utils")(bot, this.browser, config);
        let Log = require("./modules/logger/log");
        let log = new Log("switch_mode", config);
        let login = require("./modules/mode/login.js")(bot, config, utils);
        let twofa = require("./modules/mode/2fa.js")(bot, config, utils);

        /**
         * Switch Mode
         * =====================
         * Switch social algorithms, change algorithm from config.js
         *
         */
        async function switch_mode () {
            let strategy = routes[config.bot_mode];
            if (strategy !== undefined) {
                await strategy(bot, config, utils, db).start();
            } else {
                log(LOG.ERROR, "switch_mode", `mode ${strategy} not exist!`);
            }
        }

        /**
         * Start Bot (flow) 
         * =====================
         * Login --> 2FA (bad location) --> 2FA (sms pin) --> social algorithm from config.js
         *
         */
        await login.start();

        if (login.is_ok()) {
            await twofa.start_twofa_location_check();
        }
        if (twofa.is_ok_nextverify()) {
            await twofa.start_twofa_location();
        }

        if (twofa.is_ok()) {
            await twofa.start_twofa_check();
        }
        if (twofa.is_ok_nextverify()) {
            await twofa.start();
        }

        if (twofa.is_ok()) {
            await switch_mode();
        }

    };

};