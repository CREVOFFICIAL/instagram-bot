/**
 * MODE: Commentmode_classic
 * =====================
 *
 * @author:     Ilua Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 */
const Manager_state = require("../common/state").Manager_state;
class Commentmode_classic extends Manager_state {
    constructor (bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.LOG_NAME = "comment";
        this.photo_commented = [];
        this.photo_current = "";
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.Log = require("../logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
        this.cache_hash_tags = [];
        this.source = this.config.comment_mode.comments.source;
    }

    get_random_comment () {
        // if array is empty
        if (this.source.length === 0) {
            return "";
        }
        return this.source[Math.floor(Math.random() * this.source.length)];
    }

    /**
     * Get random comment from config file
     * @return string
     */
    get_comment () {
        this.log.info(`type source comments is ${this.config.comment_mode.comments.type}`);
        switch (this.config.comment_mode.comments.type) {
            case "array":
                return this.get_random_comment();
            default:
                this.log.error("source comments not found");
                return "";
        }
    }

    /**
     * Get photo url from cache
     * @return {string} url
     */
    get_photo_url () {
        let photo_url = "";
        do {
            photo_url = this.cache_hash_tags.pop();
        } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && this.cache_hash_tags.length > 0);
        return photo_url;
    }

    /**
     * Commentmode_classic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async open_page () {
        let hashtag = this.utils.get_random_hash_tag();
        this.log.info(`current hashtag ${hashtag}`);

        try {
            await this.bot.goto(`https://www.instagram.com/explore/tags/${hashtag}/`);
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.utils.screenshot(this.LOG_NAME, "last_hashtag");
    }

    /**
     * Commentmode_classic: Open Photo
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
                photo_url = this.get_photo_url();

                this.log.info(`current photo url ${photo_url}`);
                if (typeof photo_url === "undefined") {
                    this.log.warning("check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");
                }

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.bot.goto(photo_url);
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

        this.photo_current = photo_url.split("?tagged")[0];
        if (typeof photo_url !== "undefined") {
            if (typeof this.photo_commented[this.photo_current] === "undefined") {
                this.photo_commented[this.photo_current] = 1;
            } else {
                this.photo_commented[this.photo_current]++;
            }

        }
        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

    /**
     * Check exist element under photo
     * @return {Promise<void>}
     */
    async check_leave_comment () {
        let nick_under_photo = `article div div a[title="${this.config.instagram_username}"]`;
        if (this.is_ok()) {
            try {
                let nick = await this.bot.$(nick_under_photo);

                if (nick !== null) {
                    this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
                } else {
                    this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
                }

                if (this.is_error()) {
                    this.log.warning("Failed...");
                    this.log.warning("error bot :( not comment under photo, now bot sleep 5-10min");
                    this.log.warning("You are in possible soft ban... If this message appear all time stop bot for 1h...");
                    await this.utils.sleep(this.utils.random_interval(60 * 50, 60 * 60));
                } else if (this.is_ok()) {
                    this.log.info("OK");
                }
            } catch (err) {
                if (this.utils.is_debug()) {
                    this.log.debug(err);
                }
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            }
        } else {
            this.log.warning("Failed...");
            this.log.warning("You like this previously, change hashtag ig have few photos");
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.READY);
        }
    }

    /**
     * Commentmode_classic: Love me
     * =====================
     * leave a comment under the photo
     *
     */
    async comment () {
        this.log.info("try leave comment");
        let comment_area_elem = "article:nth-child(1) section:nth-child(5) form textarea";

        try {
            let textarea = await this.bot.$(comment_area_elem);
            if (textarea !== null) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            }

            if (this.is_ok()) {
                await this.bot.waitForSelector(comment_area_elem);
                let button = await this.bot.$(comment_area_elem);
                if (this.photo_commented[this.photo_current] > 1) {
                    this.log.warning("</3 commented previously");
                } else {
                    await button.click();
                    await this.bot.type(comment_area_elem, this.get_comment(), {delay: 100});
                    await button.press("Enter");
                }
            } else {
                this.log.info("bot is unable to comment on this photo");
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            }
        } catch (err) {
            if (this.utils.is_debug()) {
                this.log.debug(err);
            }
            this.log.info("bot is unable to comment on this photo");
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        this.bot.reload();

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.utils.screenshot(this.LOG_NAME, "last_comment");

        await this.utils.sleep(this.utils.random_interval(3, 6));
        await this.check_leave_comment();

        await this.utils.sleep(this.utils.random_interval(2, 5));
        await this.utils.screenshot(this.LOG_NAME, "last_comment_after");
    }

    /**
     * CommentModeClassic Flow
     * =====================
     *
     */
    async start () {
        this.log.info("classic");

        let alive = true;
        do {
            alive = await this.utils.keep_alive();
            if (alive == false) {
                break;
            }

            let today = new Date();
            this.log.info(`time night: ${parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`)}`);

            if (this.config.bot_sleep_night === false) {
                this.config.bot_start_sleep = "00:00";
            }
            if ((parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`) >= (this.config.bot_start_sleep).replace(":", ""))) {
                this.log.info(`loading... ${new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds())}`);
                this.log.info(`cache array size ${this.cache_hash_tags.length}`);

                if (this.cache_hash_tags.length <= 0) {
                    await this.open_page();
                }

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.like_get_urlpic();

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.comment();

                if (this.cache_hash_tags.length < 9 || this.is_ready()) { // remove popular photos
                    this.cache_hash_tags = [];
                }

                alive = await this.utils.keep_alive();
                if (alive == false) {
                    break;
                }

                if (this.cache_hash_tags.length <= 0 && this.is_not_ready()) {
                    this.log.info(`finish fast comment, bot sleep ${this.config.bot_fastlike_min} - ${this.config.bot_fastlike_max} minutes`);
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

module.exports = (bot, config, utils, db) => {
    return new Commentmode_classic(bot, config, utils, db);
};