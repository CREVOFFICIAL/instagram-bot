/**
 * MODE: likemode_superlike
 * =====================
 * Select random hashtag from config list and like 3 random photo of same user | 750-900 like/day.
 *
 * @author:     Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * 
 */
const Manager_state = require("../common/state").Manager_state;
class Likemode_superlike extends Manager_state {
    constructor (bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.cache_hash_tags = [];
        this.cache_hash_tags_user = [];
        this.photo_liked = [];
        this.photo_current = "";
        this.LOG_NAME = "like_superlike";
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.Log = require("../logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    /**
     * Get photo url from cache
     * @return {string} url
     */
    get_photo_url (type) {
        let photo_url = "";
        do {
            if (type === "hashtag") {
                photo_url = this.cache_hash_tags.pop();
            } else {
                photo_url = this.cache_hash_tags_user[Math.floor(Math.random() * this.cache_hash_tags_user.length)];
            }
        }
        while ((typeof photo_url === "undefined") && (this.cache_hash_tags.length > 0 || this.cache_hash_tags_user > 0));
        return photo_url;
    }

    /**
     * likemode_superlike: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async like_open_hashtagpage () {
        let hashtag_tag = this.utils.get_random_hash_tag();
        this.log.info(`current hashtag ${hashtag_tag}`);
        try {
            await this.bot.goto(`https://www.instagram.com/explore/tags/${hashtag_tag}/`);
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.utils.screenshot(this.LOG_NAME, "last_hashtag");
    }

    /**
     * likemode_superlike: Open Photo
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

                await this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.is_debug()) {
                    this.log.debug(`array photos ${this.cache_hash_tags}`);
                }

                photo_url = this.get_photo_url("hashtag");

                this.log.info(`current photo url ${photo_url}`);
                if (typeof photo_url === "undefined") {
                    this.log.warning("check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");
                    this.cache_hash_tags = [];
                    this.cache_hash_tags_user = [];
                }

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.bot.goto(photo_url);
            } catch (err) {
                this.cache_hash_tags = [];
                this.cache_hash_tags_user = [];
                this.log.error(`like_get_urlpic error ${err}`);
                await this.utils.screenshot(this.LOG_NAME, "like_get_urlpic_error");
            }
        } else {
            photo_url = this.get_photo_url("hashtag");

            this.log.info(`current photo url from cache ${photo_url}`);
            await this.utils.sleep(this.utils.random_interval(3, 6));

            try {
                await this.bot.goto(photo_url);
            } catch (err) {
                this.log.error(`goto ${err}`);
                this.cache_hash_tags = [];
                this.cache_hash_tags_user = [];
            }
        }
        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

    /**
     * likemode_superlike: open user page
     * =====================
     * Open user page for 3 likes
     *
     */
    async like_open_userpage () {
        this.log.info("try open userpage");

        try {
            await this.bot.waitForSelector("article:nth-child(1) header:nth-child(1) div:nth-child(2) a:nth-child(1)");
            let button = await this.bot.$("article:nth-child(1) header:nth-child(1) div:nth-child(2) a:nth-child(1)");
            await button.click();
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        } catch (err) {
            if (this.utils.is_debug()) {
                this.log.debug(err);
            }

            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.utils.screenshot(this.LOG_NAME, "userpage");
    }

    /**
     * likemode_superlike: Open Photo
     * =====================
     * Open url of photo and cache urls from hashtag page in array
     *
     */
    async like_get_urlpic_user () {
        this.log.info("like_get_urlpic_fromuser");

        let photo_url = "";

        if (this.cache_hash_tags_user.length <= 0) {
            try {
                this.cache_hash_tags_user = await this.bot.$$eval("article a", hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                await this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.is_debug()) {
                    this.log.debug(`array photos from user ${this.cache_hash_tags_user}`);
                }

                photo_url = this.get_photo_url("user");

                this.log.info(`current photo url user ${photo_url}`);
                if (typeof photo_url === "undefined") {
                    this.log.warning("check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");
                }

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.bot.goto(photo_url);
            } catch (err) {
                this.cache_hash_tags = [];
                this.cache_hash_tags_user = [];
                this.log.error(`like_get_urlpic_user error ${err}`);
                await this.utils.screenshot(this.LOG_NAME, "like_get_urlpic_error");
            }
        } else {
            photo_url = this.get_photo_url("user");

            this.log.info(`current photo url user from cache ${photo_url}`);
            await this.utils.sleep(this.utils.random_interval(3, 6));

            try {
                await this.bot.goto(photo_url);
            } catch (err) {
                this.log.error(`goto ${err}`);
                this.cache_hash_tags = [];
                this.cache_hash_tags_user = [];
            }
        }

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

    /**
     * likemode_superlike: Love me
     * =====================
     * Click on heart and verify if instagram not (soft) ban you
     *
     */
    async like_click_heart () {
        this.log.info("try heart like");

        try {
            await this.bot.waitForSelector("article:nth-child(1) section:nth-child(1) button:nth-child(1)");
            let button = await this.bot.$("article:nth-child(1) section:nth-child(1) button:nth-child(1)");
            if (this.photo_liked[this.photo_current] > 1) {
                this.log.warning("</3 liked previously");
            } else {
                await button.click();
                this.log.info("<3");
            }
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        } catch (err) {
            if (this.utils.is_debug()) {
                this.log.debug(err);
            }

            this.log.warning("</3");
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
        this.log.info("superlike");

        let today = "";
        let alive = true;
        do {
            alive = await this.utils.keep_alive();
            if (alive == false) {
                break;
            }

            today = new Date();
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

                for (let i = 0; i < this.config.bot_superlike_n; i++) {
                    this.log.info(`try like photo ${i + 1}/${this.config.bot_superlike_n}`);

                    await this.like_open_userpage();

                    while (this.get_status() === 0) {
                        this.log.info("photo not found, retry next...");
                        await this.like_get_urlpic();
                        await this.like_open_userpage();
                    }

                    await this.utils.sleep(this.utils.random_interval(3, 6));

                    await this.like_get_urlpic_user();

                    await this.utils.sleep(this.utils.random_interval(3, 6));

                    await this.like_click_heart();

                    alive = await this.utils.keep_alive();
                    if (alive == false) {
                        break;
                    }
                }
                this.cache_hash_tags_user = [];

                if (this.cache_hash_tags.length < 9 || this.is_ready()) { // remove popular photos
                    this.cache_hash_tags = [];
                }

                alive = await this.utils.keep_alive();
                if (alive == false) {
                    break;
                }

                if (this.cache_hash_tags.length <= 0 && this.is_not_ready()) {
                    this.log.info(`finish fast like, bot sleep ${this.config.bot_fastlike_min}-${this.config.bot_fastlike_max} minutes`);
                    this.cache_hash_tags = [];
                    await this.utils.sleep(this.utils.random_interval(60 * this.config.bot_fastlike_min, 60 * this.config.bot_fastlike_max));
                }

            } else {
                this.log.info("is night, bot sleep");
                await this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }
        } while (true);
    }

}

module.exports = (bot, config, utils) => {
    return new Likemode_superlike(bot, config, utils);
};