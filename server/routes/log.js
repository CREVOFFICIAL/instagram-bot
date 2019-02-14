/**
 * Log
 * =====================
 * Possible logger channels
 *
 * @author:     Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 * 
 */
module.exports = {
    "console": require("../modules/logger/channels/console"),
    "slack": require("../modules/logger/channels/slack"),
};