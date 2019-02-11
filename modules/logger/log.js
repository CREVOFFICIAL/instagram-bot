const TYPES_LOG = require("./types");
const fs = require("fs");
const routes_log = require("./../../routes/log");

module.exports = class Log {
    constructor (func, config) {
        this.func = func;
        this.config = config;
        this.channels = [];

        this.config.log.drivers.forEach((driver) => {
            let Channel = routes_log[driver];
            if (Channel !== undefined) {
                this.set_channel(Channel(this.config));
            } else {
                console.error("channel log not found");
            }
        });
    }

    /**
     *
     * @param interface_channel
     */
    set_channel (interface_channel) {
        this.channels.push(interface_channel);
    }

    /**
     * Helper function
     *
     * @param type
     * @param message
     */
    channels_log (type, message) {
        this.channels.forEach((channel) => {
            channel.log(type, this.func, message);
        });
    }

    append_file (type, message) {
        const tz_offset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
        const local_iso_time = (new Date(Date.now() - tz_offset)).toISOString().slice(0, -5).replace("T", " ");
        const log = `${local_iso_time} [${type}] ${message}\n`;

        fs.appendFile(this.config.log_path, log, function (err) {
            if (err) {
                console.log(err);
            }
        });
        if (type === "ERROR") {
            fs.appendFile(this.config.logerr_path, log, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }

    info (message) {
        this.channels_log(TYPES_LOG.INFO, message);
        this.append_file("INFO", message);
    }

    warning (message) {
        this.channels_log(TYPES_LOG.WARNING, message);
        this.append_file("WARNING", message);
    }

    error (message) {
        this.channels_log(TYPES_LOG.ERROR, message);
        this.append_file("ERROR", message);
    }

    debug (message) {
        this.channels_log(TYPES_LOG.DEBUG, message);
        this.append_file("DEBUG", message);
    }
};
