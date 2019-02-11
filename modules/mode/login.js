/**
 * Login Flow
 * =====================
 * Open browser, set user/pass and try login
 *
 * @author:     Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 */
const Manager_state = require("../common/state").Manager_state;
class Login extends Manager_state {
    constructor (bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.LOG_NAME = "login";
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.Log = require("../logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    /**
     * Open login page
     * =====================
     * Browser start
     *
     */
    async open_loginpage () {
        this.log.info("open_loginpage");

        await this.bot.goto("https://www.instagram.com/accounts/login/");
    }

    /**
     * Compile input
     * =====================
     * Set username
     *
     */
    async set_username () {
        this.log.info("set_username");
        await this.bot.waitForSelector("input[name=\"username\"]");
        await this.bot.type("input[name=\"username\"]", this.config.instagram_username, {delay: 100});
    }

    /**
     * Compile input
     * =====================
     * Set password
     *
     */
    async set_password () {
        this.log.info("set_password");
        await this.bot.waitForSelector("input[name=\"password\"]");
        await this.bot.type("input[name=\"password\"]", this.config.instagram_password, {delay: 100});
    }

    /**
     * Login
     * =====================
     * Press submit button
     *
     */
    async submitform () {
        this.log.info("submit");
        try {
            await this.bot.waitForSelector("form > div:nth-child(3) > button");
            let button = await this.bot.$("form > div:nth-child(3) > button");
            await button.click();
        } catch (err) {
            await this.bot.waitForSelector("form button");
            let button = await this.bot.$("form button");
            await button.click();
        }

        await this.utils.screenshot(this.LOG_NAME, "submit");
    }

    /**
     * Login check errors
     * =====================
     * Bad password or similar
     *
     */
    async submitverify () {
        this.log.info("checkerrors");

        let text = "";

        try {
            text = await this.bot.$("#slfErrorAlert");
            if (text !== null) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            }
        } catch (err) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        }

        if (this.is_error()) {
            let html_response = await this.bot.evaluate(body => body.innerHTML, text);
            await text.dispose();

            this.log.error(`Error: ${html_response} (restart bot and retry...)`);
            await this.utils.screenshot(this.LOG_NAME, "checkerrors_error");
        } else {
            this.log.info("password is correct");
            await this.utils.screenshot(this.LOG_NAME, "checkerrors");
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

    /**
     * Login Flow
     * =====================
     *
     */
    async start () {
        this.log.info("loading...");

        await this.open_loginpage();

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.set_username();

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.set_password();

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.submitform();

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.submitverify();
        this.log.info(`login_status is ${this.get_status()}`);

        await this.utils.sleep(this.utils.random_interval(3, 6));
    }
}

module.exports = (bot, config, utils) => {
    return new Login(bot, config, utils);
};