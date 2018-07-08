class Utils {

    constructor() { }

    parseTime(x, format = "%d-%b-%y") {
        return d3.timeParse(format);
    }

}