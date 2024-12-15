class ColorMap {
    constructor() {
        this.colorMap = {
            'W': '4682B4',
            'S': 'F4A460',
            'M': '008000',
            'F': '006400'
        }
    }

    getColorFor(cell) {
        return '0x' + this.colorMap[cell];
    }
}