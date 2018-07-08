class LineChart {

    constructor(width, height) {

        this._margin = {left:30, right:30, top: 10, bottom: 20}
        this._width = width - this._margin.left - this._margin.right;
        this._height = height - this._margin.bottom - this._margin.top;

        const dataset = [
            {date:"1-May-12", "sessions": 25},
            {date:"2-May-12", "sessions": 31},
            {date:"3-May-12", "sessions": 100},
            {date:"4-May-12", "sessions": 55}
        ];
    
        this._data = dataset;
        //this._svg = this.createSvg;
    }

    set data(dataset) {
        this._data = dataset;
    }

    get data() {
        return this._data;
    }

    set margin(m) {
        this._margin = m;
    }

    get margin() {
        return this._margin;
    }

    set width(width) {
        this._width = width;
    }

    get width() {
        return this._width;
    }

    set height(height) {
        this._height = height;
    }

    get height() {
        return this._height;
    }

    set xScale(fn) {
        this._xScale = fn;
    }

    get xScale() {
        return this._xScale;
    }

    set yScale(fn) {
        this._yScale = fn;
    }

    get yScale() {
        return this._yScale;
    }

}