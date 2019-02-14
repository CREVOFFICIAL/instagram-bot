/**
 * Console
 * =====================
 * Log in channel is console
 *
 * @author:     Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 * 
 */
class Console{
    constructor () {
        this.MAP_COLORS = require("./../types").MAP_COLORS;
    }
    
    /**
     * Run is log in output console
     * @param type
     * @param func
     * @param message
     */
    log (type, func, message){
        let color = this.MAP_COLORS[type];
        console.log(`${type} ${func}: ${message}`[color]);
    }
}

module.exports = () => {
    return new Console(); 
};
