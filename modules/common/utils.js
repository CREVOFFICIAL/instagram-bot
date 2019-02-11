/**
 * Utils
 * =====================
 * Logger and other functions...
 *
 * @author:     Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 */
require("colors");
class Utils {
    constructor (bot, browser, config) {
        this.bot = bot;
        this.browser = browser;
        this.config = config;
        this.fs = require("fs");
        this.LOG_NAME = "utils";
        this.LOG = require("../logger/types");
        this.MAP_COLORS = require("../logger/types").MAP_COLORS;
        this.Log = require("../logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    /**
     * Donate
     * =====================
     * Patreon link
     *
     */
    donate () {
        this.log.warning("Bot work? Please donate for support this project!");
        this.log.warning("Donate with patreon: http://patreon.ptkdev.io");
        this.log.warning("Donate with paypal: http://paypal.ptkdev.io");
    }

    /**
     * Compare package version
     * =====================
     * Compare current version with passed parameter
     * @param {string} version to compare with
     * @return {string} 0 if same version, 1 if older, -1 if newer
     *
     */
    compare_version (version) {
        const current_version = require("../../version").version;
        const compare_versions = require("compare-versions");
        return compare_versions(current_version, version);
    }

    /**
     * Check updates
     * =====================
     * Bot is updated? Yes/no
     *
     */
    check_updates (version) {
        let request = require("request");
        let log = this.log;
        request.get("https://api.ptkdev.io/v1/bot/instagram/version/", function (err, res, last_release) {
            if (err) {
                log.error("Is impossible contact api.ptkdev.io server, wifi is on?");
            } else {
                if (version !== last_release) {
                    log.warning(`Bot release v${last_release} available! Current version: v${version}`);
                } else {
                    log.info("Bot is updated! :D");
                }
            }
        });
    }

    /**
     * Create empty files: loginpin.txt, logs amd db
     * =====================
     * This fix errors at boot
     *
     */
    async create_write_file (name, path, content) {
        let self = this;
        return new Promise(function (resolve_write, reject_write) {
            self.fs.writeFile(path, content, function (err) {
                if (err) {
                    self.log.error(`${name} don't created: ${err}`);
                    reject_write(err);
                } else {
                    self.log.info(`${name} created`);
                }
                resolve_write(true);
            });
        });
    }

    async create_is_exist (name, path) {
        let self = this;
        return new Promise(function (resolve_exists) {
            self.fs.open(path, "wx", function (exists) {
                if (exists && exists.code === "EEXIST") {
                    self.log.info(`${name} exist`);
                    resolve_exists("exist");
                } else {
                    resolve_exists("create");
                }
            });
        });
    }

    async create_empty (name, path, content) {
        if (await this.create_is_exist(name, path) == "create") {
            await this.create_write_file(name, path, content);
        }
    }

    /**
     * Init all emptys filesthis.
     * =====================
     * This fix errors at boot
     *
     */
    async init_empty () {
        await this.create_empty("loginpin.txt", this.config.pin_path, "123456");

        await this.create_empty("logs/debug.log", this.config.log_path, "");
        await this.create_empty("logs/errors.log", this.config.logerr_path, "");

        await this.create_empty("databases/fdf.db", this.config.fdfdatabase_path, "");
        await this.create_empty("databases/logs.db", this.config.logdb_path, "");
    }

    compute_interval_between_run_in_seconds (target_count_per_day) {
        if (target_count_per_day <= 0) {
            throw new Error("target_count_per_day must be positive");
        }
        return Math.ceil((24 / target_count_per_day) * 11 *60);
    }

    /**
     * Screenshot
     * =====================
     * Save screenshot from chrome
     *
     */
    async screenshot (func, name) {
        if (this.config.log.screenshot) {
            try {
                await this.bot.screenshot({path: `${this.config.screenshot_path + this.config.instagram_username}_${func}_${name}.jpg`});
                this.log.info("Cheese! Screenshot!");
            } catch (err) {
                this.log.error(`screenshot: error ${err}`);
            }
        }
    }

    /**
     * Random
     * =====================
     * Random number between two numbers
     *
     */
    random_interval (min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
    }

    /**
     * Kill Process if browser page is closed
     * =====================
     * Exit from node
     *
     */
    async keep_alive () {
        let pages = null;

        try {
            pages = (await this.browser.pages()).map(t => t.url());
        } catch (err) {
            this.log.info("Bye bye! Shutdown... wait ~30sec for the bot stopping...");
            return false;
        }

        if (pages.length == 2) {
            return true;
        } else {
            
            this.log.info("Bye bye! Shutdown... wait ~30sec for the bot stopping...");
        }

        return false;
    }

    /**
     * Get random number between two numbers
     * @param min
     * @param max
     * @return {number}
     */
    random_number () {
        return (Math.floor(Math.random() * (20 - 10 + 1)) + 10);
    }

    /**
     * Mix array element
     * @param arr
     * @return array
     */
    mix_array (arr) {
        return arr.sort(function () {
            return 0.5 - Math.random();
        });
    }

    /**
     * Sleep
     * =====================
     * Zzz
     *
     */
    sleep (sec) {
        return new Promise(resolve => setTimeout(resolve, sec));
    }

    /**
     * Check is debug
     * @return {boolean}
     */
    is_debug () {
        return this.config.debug === true;
    }

    /**
     * Get random hash tag from config file
     * @return {string}
     */
    get_random_hash_tag () {
        return this.config.instagram_hashtag[Math.floor(Math.random() * this.config.instagram_hashtag.length)];
    }

    /**
     * Fix ui configs params
     * =====================
     * String aparms to booleans from social-manager-tools
     *
     */
    fixui (config) {
        config.bot_likeday_min = parseInt(config.bot_likeday_min);
        config.bot_likeday_max = parseInt(config.bot_likeday_max);
        config.bot_superlike_n = parseInt(config.bot_superlike_n);
        if (config.chrome_headless == "enabled") {
            config.chrome_headless = false;
        } else {
            config.chrome_headless = true;
        }

        return config;
    }

    /**
     * Default config.js
     * =====================
     * Get default value if config.js is not updated from config.js.tpl
     *
     */
    fixconfig (config) {
        if (typeof config.debug === "undefined") {
            config.debug = true;
            this.log.error("config.debug use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.login === "undefined") {
            config.login = true;
            this.log.error("config.login use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.instagram_username === "undefined") {
            config.instagram_username = "ptkdev";
            this.log.error("config.instagram_username use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.instagram_password === "undefined") {
            config.instagram_password = "password";
            this.log.error("config.instagram_password use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.instagram_hashtag === "undefined") {
            config.instagram_hashtag = ["follow"];
            this.log.error("config.instagram_hashtag use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.instagram_pin === "undefined") {
            config.instagram_pin = "sms";
            this.log.error("config.instagram_pin use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_mode === "undefined") {
            config.bot_mode = "likemode_classic";
            this.log.error("config.bot_mode use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_likeday_min === "undefined") {
            config.bot_likeday_min = 300;
            this.log.error("config.bot_likeday_min use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_likeday_max === "undefined") {
            config.bot_likeday_max = 600;
            this.log.error("config.bot_likeday_max use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_sleep_night === "undefined" || (config.bot_sleep_night !== true && config.bot_sleep_night !== false)) {
            config.bot_sleep_night = true;
            this.log.error("config.bot_sleep_night use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_start_sleep === "undefined") {
            config.bot_start_sleep = "7:00";
            this.log.error("config.bot_start_sleep use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_superlike_n === "undefined") {
            config.bot_superlike_n = 3;
            this.log.error("config.bot_superlike_n use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_followday === "undefined") {
            config.bot_followday = 300;
            this.log.error("config.bot_followday use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.bot_userwhitelist === "undefined") {
            config.bot_userwhitelist = [""];
            this.log.error("config.bot_userwhitelist use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.chrome_headless === "undefined") {
            config.chrome_headless = false;
            this.log.error("config.chrome_headless use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.chrome_options === "undefined") {
            config.chrome_options = ["--disable-gpu", "--no-sandbox", "--window-size=1920x1080"];
            this.log.error("config.chrome_options use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.executable_path === "undefined") {
            config.executable_path = "";
            this.log.error("config.executable_path use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.screenshot_path === "undefined") {
            config.screenshot_path = "./logs/screenshot/";
            this.log.error("config.screenshot_path use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.logerr_path === "undefined") {
            config.logerr_path = "./logs/errors.log";
            this.log.error("config.logerr_path use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.log_path === "undefined") {
            config.log_path = "./logs/debug.log";
            this.log.error("config.log_path use the default value, update your config.js from config.js.tpl");
        }
        if (typeof config.pin_path === "undefined") {
            config.pin_path = "./loginpin.txt";
            this.log.error("config.pin_path use the default value, update your config.js from config.js.tpl");
        }

        config.bot_fastlike_max = this.compute_interval_between_run_in_seconds(config.bot_likeday_min);
        config.bot_fastlike_min = this.compute_interval_between_run_in_seconds(config.bot_likeday_max);

        config.bot_fastlikefdf_max = this.compute_interval_between_run_in_seconds(config.bot_followday - 30);
        config.bot_fastlikefdf_min = this.compute_interval_between_run_in_seconds(config.bot_followday);

        return config;
    }
}

module.exports = (bot, browser, config) => {
    return new Utils(bot, browser, config);
};