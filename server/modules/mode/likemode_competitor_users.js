/**
 * MODE: Likemode_competitor_users
 * =====================
 * Select account, get random 20 followers, like 20 photo and sleep 15-20min.
 *
 * @author:     Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 */
const Manager_state = require("../common/state").Manager_state;
class Likemode_competitor_users extends Manager_state {
    constructor (bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.Log = require("../logger/log");
        this.LOG_NAME = "like";
        this.account = this.config.likemode_competitor_users.account;
        this.url_instagram = "https://www.instagram.com/";
        this.account_url = `${this.url_instagram}${this.account}`;
        this.cache_hash_tags = [];
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    /**
     * Open account page
     * @return {Promise<void>}
     */
    async open_account_page () {
        this.log.info(`current account ${this.account}`);

        try {
            await this.bot.goto(this.account_url);
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.utils.screenshot(this.LOG_NAME, "account_page");
    }

    /**
     * Get photo url from cache
     * @return {string} url
     */
    get_follower_url () {
        let follower_url = "";
        do {
            follower_url = this.cache_hash_tags.pop();
        } while ((typeof follower_url === "undefined" || follower_url.indexOf("www.instagram.com") === -1) && this.cache_hash_tags.length > 0);
        return follower_url;
    }

    /**
     * Scroll followers
     * @return {Promise<Promise<*>|Promise<Object>|*|XPathResult>}
     */
    async scroll_followers () {
        this.log.info("scroll action");

        return this.bot.evaluate(() => {
            return new Promise((resolve) => {
                let counter = 5;
                let timer = setInterval(() => {
                    document.querySelector("div[role=\"dialog\"] div:nth-child(2)").scrollBy(0, 5000);
                    if (counter <= 0) {
                        clearInterval(timer);
                        resolve();
                    } else {
                        counter--;
                    }
                }, 5000);
            });
        });
    }

    /**
     * Mix array url followers and get 20 url
     */
    get_random_follower_url () {
        this.cache_hash_tags = this.utils.mix_array(this.cache_hash_tags).splice(0, 20);
    }

    /**
     * Open page follower
     * @return {Promise<void>}
     */
    async open_follower_account () {
        let follower_url = "";
        if (this.cache_hash_tags.length <= 0) {
            follower_url = this.get_follower_url();

            this.log.info(`current follower url ${follower_url}`);
            if (typeof follower_url === "undefined") {
                this.log.warning("error follower url.");
            }

            await this.utils.sleep(this.utils.random_interval(3, 6));
            await this.bot.goto(follower_url);
        } else {
            follower_url = this.get_follower_url();
            this.log.info(`current url from cache ${follower_url}`);
            await this.utils.sleep(this.utils.random_interval(3, 6));

            try {
                await this.bot.goto(follower_url);
            } catch (err) {
                this.log.error(`goto ${err}`);
            }
        }
        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

    /**
     *
     * @return {Promise<void>}
     */
    async get_followers () {
        this.log.info("get followers");

        if (this.cache_hash_tags.length <= 0) {
            let selector_followers_count = "main header section ul li:nth-child(2) a";
            await this.bot.waitForSelector(selector_followers_count);
            let area_count_followers = await this.bot.$(selector_followers_count);
            await area_count_followers.click();

            // scroll
            await this.scroll_followers(this.bot);

            try {
                this.cache_hash_tags = await this.bot.$$eval("div[role=\"dialog\"] ul li a", hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                this.get_random_follower_url();

                await this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.is_debug()) {
                    this.log.debug(`array followers ${this.cache_hash_tags}`);
                }

            } catch (err) {
                this.cache_hash_tags = [];
                this.log.error(`get url followers error ${err}`);
                await this.utils.screenshot(this.LOG_NAME, "get_url_followers_error");
            }
        }
    }

    /**
     * likemode_competitor_users:
     * =====================
     * Click on heart and verify if instagram not (soft) ban you
     *
     */
    async like_click_heart () {
        this.log.info("try heart like random photo from account");

        let photos = await this.bot.$$eval("article>div div div div a", hrefs => hrefs.map((a) => {
            return a.href;
        }));
        if (photos.length === 0) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            return;
        }
        let photo_url = this.utils.mix_array(photos).splice(0, 1).shift();
        await this.bot.goto(photo_url);

        this.log.info("try heart like");

        try {
            await this.bot.waitForSelector("article:nth-child(1) section:nth-child(1) button:nth-child(1)");
            let button = await this.bot.$("article:nth-child(1) section:nth-child(1) button:nth-child(1)");
            await button.click();
            this.log.info("<3");
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
        this.log.info("competitor_users");

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
                    await this.open_account_page();
                }

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.get_followers();
                await this.open_follower_account();

                await this.utils.sleep(this.utils.random_interval(3, 6));

                await this.like_click_heart();

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
    return new Likemode_competitor_users(bot, config, utils);
};