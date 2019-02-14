/**
 * MODE: likemode_classic
 * =====================
 * Select random hashtag from config list and like 1 random photo (of last 20) | 400-600 like/day.
 *
 * @author:     Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 */
const Manager_state = require("../common/state").Manager_state;
class Likemode_classic extends Manager_state {
    constructor (bot, config, utils, db) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.db = db["logs"];
        this.cache_hash_tags = [];
        this.photo_liked = [];
        this.photo_current = "";
        this.LOG_NAME = "like_classic";
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.Log = require("../logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    /**
     * Database init
     * =====================
     * Save users nickname and other information
     *
     */
    async init_db () {
        let self = this;

        await this.db.serialize(async function () {
            self.db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, mode TEXT, username TEXT, photo_url TEXT, hashtag TEXT, type_action TEXT, inserted_at DATETIME DEFAULT CURRENT_TIMESTAMP)", function (err) {
                if (err) {
                    self.log.error(`init_db: ${err}`);
                }
            });

            self.db.run("ALTER TABLE users ADD COLUMN hashtag TEXT", function (err) {
                if (err) {
                    self.log.info(`init_db users ADD COLUMN hashtag: ${err}`);
                }
            });

            self.db.run("ALTER TABLE users ADD COLUMN inserted_at DATETIME DEFAULT NULL", function (err) {
                if (err) {
                    self.log.info(`init_db users ADD COLUMN inserted_at: ${err}`);
                }
            });
        });

    }

    /**
     * Get photo url from cache
     * =====================
     * @return {string} url
     *
     */
    get_photo_url () {
        let photo_url = "";
        do {
            photo_url = this.cache_hash_tags.pop();
        } while (typeof photo_url === "undefined" && this.cache_hash_tags.length > 0);
        return photo_url;
    }

    /**
     * likemode_classic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async like_open_hashtagpage () {
        this.hashtag_tag = this.utils.get_random_hash_tag();
        this.log.info(`current hashtag ${this.hashtag_tag}`);
        try {
            await this.bot.goto(`https://www.instagram.com/explore/tags/${this.hashtag_tag}/`);
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.utils.screenshot(this.LOG_NAME, "last_hashtag");
    }

    /**
     * likemode_classic: Open Photo
     * =====================
     * Open url of photo and cache urls from hashtag page in array
     *
     */
    async like_get_urlpic () {
        this.log.info("like_get_urlpic");

        let photo_url = "";

        if (this.cache_hash_tags.length <= 0) {
            try {
                this.cache_hash_tags = await this.bot.$$eval("article a", hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                if (this.cache_hash_tags.length <= 0) {
                    this.log.warning("check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");
                }

                await this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.is_debug()) {
                    this.log.debug(`array photos ${this.cache_hash_tags}`);
                }

                photo_url = this.get_photo_url();

                this.log.info(`current photo url ${photo_url}`);
                if (typeof photo_url === "undefined") {
                    this.log.warning("check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");
                    photo_url = this.get_photo_url();
                    if (photo_url == "" || typeof photo_url === "undefined") {
                        this.cache_hash_tags = [];
                    }
                }

                await this.utils.sleep(this.utils.random_interval(3, 6));

                if (this.cache_hash_tags.length > 0) {
                    await this.bot.goto(photo_url);
                }
            } catch (err) {
                this.cache_hash_tags = [];
                this.log.error(`like_get_urlpic error ${err}`);
                await this.utils.screenshot(this.LOG_NAME, "like_get_urlpic_error");
            }
        } else {
            photo_url = this.get_photo_url();

            this.log.info(`current photo url from cache ${photo_url}`);
            await this.utils.sleep(this.utils.random_interval(3, 6));

            try {
                await this.bot.goto(photo_url);
            } catch (err) {
                this.log.error(`goto ${err}`);
            }
        }

        if (this.cache_hash_tags.length > 0) {
            this.photo_current = photo_url.split("?tagged")[0];
            if (typeof photo_url !== "undefined") {
                if (typeof this.photo_liked[this.photo_current] === "undefined") {
                    this.photo_liked[this.photo_current] = 1;
                } else {
                    this.photo_liked[this.photo_current]++;
                }

            }
            await this.utils.sleep(this.utils.random_interval(3, 6));
        }
    }

    /**
     * likemode_classic: Love me
     * =====================
     * Click on heart and verify if instagram not (soft) ban you
     *
     */
    async like_click_heart () {
        this.log.info("try heart like");
        let username = "";
        try {
            await this.bot.waitForSelector("article div a:nth-child(1)");
            username = await this.bot.evaluate(el => el.innerHTML, await this.bot.$("article div a:nth-child(1)"));
            this.log.info(`username ${username}`);
        } catch (err) {
            this.log.warning(`get username: ${err}`);
        }

        try {
            await this.bot.waitForSelector("article:nth-child(1) section:nth-child(1) button:nth-child(1)");
            let button = await this.bot.$("article:nth-child(1) section:nth-child(1) button:nth-child(1)");
            let button_before_click = await this.bot.evaluate(el => el.innerHTML, await this.bot.$("article:nth-child(1) section:nth-child(1) button:nth-child(1)"));
            this.log.info(`button text before click: ${button_before_click}`);

            if (this.photo_liked[this.photo_current] > 1) {
                this.log.warning("</3 Skipped, liked previously");
                this.db.run("INSERT INTO users (account, mode, username, photo_url, hashtag, type_action) VALUES (?, ?, ?, ?, ?, ?)", this.config.instagram_username, this.LOG_NAME, username, this.photo_current, this.hashtag_tag, "skipped");
            } else {
                await button.click();
                await this.utils.sleep(this.utils.random_interval(2, 3));

                await this.bot.waitForSelector("article:nth-child(1) section:nth-child(1) button:nth-child(1)");
                let button_after_click = await this.bot.evaluate(el => el.innerHTML, await this.bot.$("article:nth-child(1) section:nth-child(1) button:nth-child(1)"));
                this.log.info(`button text after click: ${button_after_click}`);

                if (button_after_click.includes("filled") || button_after_click.includes("red")) {
                    this.log.info("<3 Liked");
                    this.db.run("INSERT INTO users (account, mode, username, photo_url, hashtag, type_action) VALUES (?, ?, ?, ?, ?, ?)", this.config.instagram_username, this.LOG_NAME, username, this.photo_current, this.hashtag_tag, "liked");
                } else {
                    this.log.warning("</3");
                    this.db.run("INSERT INTO users (account, mode, username, photo_url, hashtag, type_action) VALUES (?, ?, ?, ?, ?, ?)", this.config.instagram_username, this.LOG_NAME, username, this.photo_current, this.hashtag_tag, "liked error");
                }
            }
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        } catch (err) {
            if (this.utils.is_debug()) {
                this.log.debug(err);
            }

            this.log.warning("</3");
            this.db.run("INSERT INTO users (account, mode, username, photo_url, hashtag, type_action) VALUES (?, ?, ?, ?, ?, ?)", this.config.instagram_username, this.LOG_NAME, username, this.photo_current, this.hashtag_tag, "liked error");
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.utils.screenshot(this.LOG_NAME, "last_like_after");
    }

    /**
     * LikemodeClassic Flow
     * =====================
     *
     */
    async start () {
        this.log.info("classic");

        await this.init_db();
        let t1, t2, sec, sec_min, sec_max;
        sec_min = parseInt(86400 / this.config.bot_likeday_max);
        sec_max = parseInt(86400 / this.config.bot_likeday_min);

        let today = "";
        let alive = true;
        do {

            alive = await this.utils.keep_alive();
            if (alive == false) {
                break;
            }

            today = new Date();
            t1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
            this.log.info(`time night: ${parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`)}`);

            if (this.config.bot_sleep_night === false) {
                this.config.bot_start_sleep = "00:00";
            }
            if ((parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`) >= (this.config.bot_start_sleep).replace(":", ""))) {

                this.log.info(`loading... ${new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds())}`);
                this.log.info(`cache array size ${this.cache_hash_tags.length}`);

                if (this.cache_hash_tags.length <= 0) {
                    await this.like_open_hashtagpage();
                }

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.like_get_urlpic();

                await this.utils.sleep(this.utils.random_interval(3, 6));

                if (this.cache_hash_tags.length > 0) {
                    await this.like_click_heart();
                }

                if (this.cache_hash_tags.length < 9) { // remove popular photos
                    this.cache_hash_tags = [];
                }

                alive = await this.utils.keep_alive();
                if (alive == false) {
                    break;
                }
                today = new Date();
                t2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
                sec = Math.abs((t1.getTime() - t2.getTime()) / 1000);

                if (sec < sec_min) {
                    this.log.info(`seconds of loop ${sec}... now bot sleep ${sec_min - sec}-${sec_max - sec}sec`);
                    await this.utils.sleep(this.utils.random_interval(sec_min - sec, sec_max - sec));
                    this.cache_hash_tags = [];
                }
            } else {
                this.log.info("is night, bot sleep");
                await this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }

        } while (true);
    }

}

module.exports = (bot, config, utils, db) => {
    return new Likemode_classic(bot, config, utils, db);
};