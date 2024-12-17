class ColorMap {
    constructor() {
        this.colorMap = {
            'W': '4682B4',
            'S': 'F4A460',
            'M': '008000',
            'F': '006400'
        }
    }
    
    darken() {
        for (var key in this.colorMap) {
            var color = this.colorMap[key];
            var r = parseInt("0x" + color.substr(0, 2));
            var g = parseInt("0x" + color.substr(2, 2));
            var b = parseInt("0x" + color.substr(4, 2));
            var f = 0.9;
            r = Math.floor(r * f);
            g = Math.floor(g * f);
            b = Math.floor(b * f);
            var newColor = this.decToHex(r) + this.decToHex(g) + this.decToHex(b);
            this.colorMap[key] = newColor;
        }        
    }

    decToHex(dec) {
        let hex = dec.toString(16).toUpperCase();
        if (hex.length < 2) {
          hex = "0" + hex;
        }
        return hex;
    }
      

    getColorFor(cell) {
        return '0x' + this.colorMap[cell];
    }
}