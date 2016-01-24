var randomizer = require('randomizer');
var bit = require('bitmask');
bit.define('ISRECRUSIVELOOP_THROW', 1);
bit.define('ISRECRUSIVELOOP_MULTIPLE', 2);
var clearOff = function(object, sessionid) {
    if (object[sessionid]) delete object[sessionid];
    for (var prop in object) {
        if (object.hasOwnProperty(prop) && "object" === typeof object[prop]) {
            if (object[prop][sessionid])
            clearOff(object[prop], sessionid);
        }
    }
}
var isRecrusiveLoop = function(object, option, xpath, sessionid) {

    if (!xpath) {
        xpath = [];
        if (!sessionid)
        sessionid = randomizer('__recrussiveloopid__', 16);
    }

    if ("undefined"===typeof object[sessionid]) {
        var unique = randomizer('unqiue', 4)+(new Date()).getTime();
        object[sessionid] = unique;
    }


    xpath.push(object[sessionid]);

	var badways = [],
    multiple = option===true || bit(option).test(ISRECRUSIVELOOP_MULTIPLE);
	for (var prop in object) {
		if (object.hasOwnProperty(prop)&&"object"===typeof object[prop]) {
			if (object[prop][sessionid]) {
                if (!!~xpath.indexOf(object[prop][sessionid])) {
                    if (multiple) badways.push([prop]);
                    else return [prop];
                }
			} else {
                var r = isRecrusiveLoop(object[prop], multiple, xpath.slice(), sessionid);
                if (r) {
                    if (multiple) {
                        for (var ri = 0;ri<r.length;++ri) {
                            badways.push(([prop]).concat(r[ri]))
                        }
                	} else if (bit(option).test(ISRECRUSIVELOOP_THROW)) {
                        throw 'Endless loop at ['+(([prop]).concat(r).join("]["))+']';
                	} else {
                        // Is root. Clear all
                        if (xpath.length===1) clearOff(object, sessionid);
                		return ([prop]).concat(r);
                	}
                }
			}
		}
	}

    // Is root. Clear all
    if (xpath.length===1) clearOff(object, sessionid);

	return badways.length>0 ? badways : false;
}

module.exports = isRecrusiveLoop;