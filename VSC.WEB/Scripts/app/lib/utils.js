// useful code from kyf app to keep. 
//Helper functions
var _oUtilities = _oUtilities || {

     fnGetMapPointFromMenuPosition: function (box,view) {
        var x = box.x, y = box.y;
        switch (box.corner) {
            case "TR":
                x += box.w;
                break;
            case "BL":
                y += box.h;
                break;
            case "BR":
                x += box.w;
                y += box.h;
                break;
        }
        var screenPoint = new esri.geometry.Point(x - view.position.x, y - view.position.y);
        return view.toMap(screenPoint);
    },
 
    fnFormatNullValue: function (value) {
        return ((value === null || value === 'undefined') ? '&nbsp' : value);
    },

fnAddCommasOrFormatNull: function (nStr) {
    var value = ((nStr === null || nStr === 'undefined') ? '&nbsp' : nStr);
    if (value != '&nbsp') {
        value += '';
        x = value.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        value = x1 + x2;
    }
    return value;
},
fnBytesToString: function (b) {
    console.log("bytes to string");
    var s = [];
    dojo.forEach(b, function (c) {
        s.push(String.fromCharCode(c));
    });
    return s.join("");
},
fnGetSeparator: function (string) {
    var separators = [",", "      ", ";", "|"];
    var maxSeparatorLength = 0;
    var maxSeparatorValue = "";
    dojo.forEach(separators, function (separator) {
        var length = string.split(separator).length;
        if (length > maxSeparatorLength) {
            maxSeparatorLength = length;
            maxSeparatorValue = separator;
        }
    });
    return maxSeparatorValue;
},
fnFormatCurrency: function (num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    //return (((sign) ? '' : '-') + '$' + num + '.' + cents);
    return (((sign) ? '' : '-') + '$' + num);
},

fnFormatZip: function (num) {
    numStr = num.toString();
    switch (numStr.length) {
        case 3:
            numStr = "00" + numStr;
            break;
        case 4:
            numStr = "0" + numStr;
            break;
    }
    return (numStr);
},

fnMaxOffset: function (view, pixelTolerance) {
    return Math.floor(view.extent.getWidth() / view.width) * pixelTolerance;
},

fnOpenResource: function (Link) {
    window.open(Link, "_blank");
}

}