/**
 * types
 * =====================
 * Type statuses
 *
 * @author:     Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 * @type {{OK: number, ERROR: number, READY: number, START: null}}
 * 
 */
const STATE = {
    OK: 1,
    ERROR: 0,
    READY: 3,
    STOP_BOT: -1,
    OK_NEXT_VERIFY: 2,
    START: null
};

const EVENTS = {
    CHANGE_STATUS: "change_status"
};

/**
 * Manager of states
 * =====================
 * Handler of emit
 *
 * @author:     Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 * 
 */
const event_emitter = require("events").EventEmitter;
class Manager_state extends event_emitter {
    constructor (params) {
        super(params);
        this._status = STATE.START;
        this.register_handler();
    }

    /**
     * register handle events in EE
     */
    register_handler () {
        this.on(EVENTS.CHANGE_STATUS, (status) => {
            this._status = status;
        });
    }

    /**
     * Get current status
     * @return STATE
     */
    get_status () {
        return this._status;
    }

    /**
     * Check is ready status
     * @return {boolean}
     */
    is_ready () {
        return this._status === STATE.READY;
    }

    /**
     * Check is not ready status
     * @return {boolean}
     */
    is_not_ready () {
        return this._status !== STATE.READY;
    }

    /**
     * Check is 'ok' status
     * @return {boolean}
     */
    is_ok () {
        return this._status === STATE.OK;
    }
    
    /**
     * Check is 'error' status
     * @return {boolean}
     */
    is_error () {
        return this._status === STATE.ERROR;
    }

    /**
     * Check is 'stop bot' status
     * @return {boolean}
     */
    is_stop_bot () {
        return this._status === STATE.STOP_BOT;
    }

    /**
     * Check is 'ok next verify' status
     * @return {boolean}
     */
    is_ok_nextverify () {
        return this._status === STATE.OK_NEXT_VERIFY;
    }

    /**
     * Check is 'start' status
     * @return {boolean}
     */
    is_start () {
        return this._status === STATE.START;
    }
}

module.exports = {
    STATE: STATE,
    EVENTS: EVENTS,
    Manager_state: Manager_state
};