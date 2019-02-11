/**
 * Two Factor Authentication (2FA) Flow
 * =====================
 * Flow for pin request after login
 *
 * @author:     Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 */
const Manager_state = require("../common/state").Manager_state;
class Twofa extends Manager_state {
    constructor (bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.LOG_NAME = "twofa";
        this.Log = require("../logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
        this.LOG = require("../logger/types");
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
    }

    /**
     * Login PIN: request pin
     * =====================
     * Press submit button
     *
     */
    async requestpin () {
        this.log.warning("please insert pin in loginpin.txt, you have 50-60 seconds for that.. (tic... tac... tic... tac... tic...)");
        try {
            let button = await this.bot.$("form button");
            await button.click();
        } catch (err) {
            this.log.error(`requestpin: ${err}`);
        }
    }

    /**
     * Login PIN: Choice Email
     * =====================
     * Press on email choice
     *
     */
    async choice_email () {
        this.log.info("try switch to phone email");

        try {
            let radio = await this.bot.$("section form label[for=\"choice_1\"]");
            await radio.click();
        } catch (err) {
            this.log.error(`choice_email: ${err}`);
        }
    }

    /**
     * Login PIN: Choice SMS
     * =====================
     * Press on email sms
     *
     */
    async choice_sms () {
        this.log.info("try switch to phone sms (if possible)");

        try {
            let radio = await this.bot.$("section form label[for=\"choice_0\"]");
            await radio.click();
        } catch (err) {
            this.log.error(`choice_sms: ${err}`);
        }
    }

    /**
     * Login PIN: Switch for SMS or Email pin
     * =====================
     * Set default pin receiver method
     *
     */
    async sendpin () {
        if (this.config.instagram_pin === "sms") {
            await this.choice_sms();
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.requestpin();

        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

    /**
     * Login PIN: Read pint
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     */
    async readpin (input) {
        this.log.info("readpin");

        const fs = require("fs");
        let data = fs.readFileSync(this.config.pin_path, "utf8");
        let pin = data.toString();

        await this.bot.waitForSelector(`input[name="${input}"]`);
        await this.bot.type(`input[name="${input}"]`, pin, {delay: 100});
        await this.utils.screenshot(this.LOG_NAME, "readpin");
    }

    /**
     * Login PIN: Final submit
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     */
    async submitform () {
        this.log.info("submit");
        try {
            await this.bot.waitForSelector("form button");
            let button = await this.bot.$("form button");
            await button.click();
        } catch (err) {
            if (this.utils.is_debug()) {
                this.log.error(err);
            }
        }
    }

    /**
     * Login PIN: check errors
     * =====================
     * Check if submit not have errors
     *
     */
    async submitverify (selector) {
        let attr = "";

        try {
            attr = await this.bot.$(`input[name="${selector}"]`);
            if (attr === null) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.STOP_BOT);
            }
        } catch (err) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        }

        await this.utils.sleep(this.utils.random_interval(1, 3));

        if (this.is_stop_bot()) {
            this.log.error("twofa: OMG! You are slow... Restart bot and retry...");
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            await this.utils.screenshot(this.LOG_NAME, "submitverify_error");
        } else if (this.is_ok()) {
            this.log.info("pin is ok");
            await this.utils.screenshot(this.LOG_NAME, "submitverify_ok");
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        if (this.is_ok()) {
            try {
                attr = await this.bot.$("input[name=\"username\"]");
                if (attr === null) {
                    this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
                } else {
                    this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.STOP_BOT);
                }
            } catch (err) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.STOP_BOT);
            }

            if (this.is_stop_bot()) {
                this.log.error("instagram error... auto logout... restart bot...");
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
                await this.utils.screenshot(this.LOG_NAME, "submitverify_error2");
            } else if (this.is_ok()) {
                this.log.info("instagram no have a crash");
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
                await this.utils.screenshot(this.LOG_NAME, "submitverify_ok2");
            }
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

    /**
     * 2FA Location Flow (check if work)
     * =====================
     *
     */
    async start_twofa_location_check () {
        this.log.info("instagram request pin (bad location)?");

        try {
            let attr = await this.bot.$("#choice_1");

            if (attr === null) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK_NEXT_VERIFY);
            }
        } catch (err) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
        }

        if (this.is_ok_nextverify()) {
            this.log.info("yes, instagram require security pin... You can not pass!!! (cit.)");
            await this.utils.screenshot(this.LOG_NAME, "check_pin_request");
        } else {
            this.log.info("no, try second verify");
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));

        this.log.info(`status location: ${this.get_status()}`);
    }

    /**
     * 2FA Flow (check if work)
     * =====================
     *
     */
    async start_twofa_check () {
        this.log.info("instagram request pin (2fa enabled)?");

        try {
            let attr = await this.bot.$("input[name=\"verificationCode\"]");

            if (attr === null) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK_NEXT_VERIFY);
            }
        } catch (err) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
        }

        if (this.is_ok_nextverify()) {
            this.log.info("yes, instagram require security pin... You can not pass!1!111! (cit.)");
            await this.utils.screenshot(this.LOG_NAME, "check_pin_request");

        } else {
            this.log.info("no, bot is at work (started)... Wait...");
            this.log.info("starting current mode");
            await this.utils.screenshot(this.LOG_NAME, "check_nopin");
        }

        await this.utils.sleep(this.utils.random_interval(3, 6));
        this.log.info(`status: ${this.get_status()}`);
    }

    /**
     * 2FA (Bad location) Flow
     * =====================
     *
     */
    async start_twofa_location () {
        this.log.info("twofa (location)", "loading...");

        // After October 2018 don't work switch sms/email
        // await this.sendpin();
        let button = await this.bot.$("form button");
        await button.click();

        this.log.warning("please insert pin in loginpin.txt or 2FA input box and wait, you have 50-60 seconds for that.. (tic... tac... tic... tac... tic...)");

        await this.utils.sleep(this.utils.random_interval(60, 80));

        await this.readpin("security_code");

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.submitform();

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.submitverify("security_code");

        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

    /**
     * 2FA (Enabled) Flow
     * =====================
     *
     */
    async start () {
        this.log.info("twofa (enabled)", "loading...");

        this.log.warning("please insert pin in loginpin.txt or 2FA input box and wait, you have 50-60 seconds for that.. (tic... tac... tic... tac... tic...)");

        await this.utils.sleep(this.utils.random_interval(60, 80));

        await this.readpin("verificationCode");

        await this.submitform();

        await this.utils.sleep(this.utils.random_interval(3, 6));

        await this.submitverify("verificationCode");

        await this.utils.sleep(this.utils.random_interval(3, 6));
    }

}

module.exports = (bot, config, utils) => {
    return new Twofa(bot, config, utils);
};