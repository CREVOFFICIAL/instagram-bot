/**
 * Types
 * =====================
 * Type of message
 *
 * @author:     Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 * @type {{INFO: string, WARNING: string, ERROR: string, DEBUG: string}}
 * 
 */
module.exports = {
    INFO:"[INFO]",
    WARNING:"[WARNING]",
    ERROR:"[ERROR]",
    DEBUG:"[DEBUG]",
    MAP_COLORS:{
        "[INFO]":"green",
        "[WARNING]":"yellow",
        "[ERROR]":"red",
        "[DEBUG]":"blue"
    }
};