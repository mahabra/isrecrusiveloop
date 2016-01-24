(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["isrecrusiveloop"] = factory();
	else
		root["isrecrusiveloop"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var randomizer = __webpack_require__(1);
	var bit = __webpack_require__(2);
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(prefix, l) {return (prefix||'')+Array(l+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, l) };


/***/ },
/* 2 */
/***/ function(module, exports) {

	var bit = function(bitmask, _) {
		if (this === (function () { return this; })()) {
			if ("function"===typeof bitmask) {
				if ("object"!==typeof bitmask.__bit__) {
					Object.defineProperty(bitmask, '__bit__', {
						enumerable: false,
						writable: false,
						editable: false,
						value: new bit(0, bitmask)
					});

					Object.defineProperty(bitmask, 'bit', {
						enumerable: true,
						configurable: false,
						get: function() {
							return this.__bit__;
						}
					});
				}
				return bitmask.__bit__;
			} else if (arguments.length>1) {
				return new bit(Array.prototype.splice.apply(arguments), false);
			} else {
				return new bit(bitmask instanceof Array ? bit.join(bitmask) : bitmask, _);
			}
		} else {
			this.value = bitmask;
			this._ = _||this;
		}
	}

	// Create new bitmask
	bit.create = function(number) {
		var bitmask = 0;
		Array.prototype.slice.apply(arguments).forEach(function(number) {
			bitmask = bitmask | (1 << number);
		});
		return bitmask;
	}

	// Define global bitmask
	bit.define = function(name, number) {
		!(function() {
			this[name] = 1 << number;
		})(name, number);
	}

	// Join masks to one
	bit.join = function() {
		var result = 0;
		Array.prototype.slice.apply(arguments).forEach(function(mask) {

			result = result | (mask instanceof Array ? bit.join.apply(bit, mask) : mask);
		});
		return result;
	}

	// Make global
	bit.globalize = function() {
		if (!('bit' in Function.prototype))
		Object.defineProperty(Function.prototype, 'bit', {
			enumerable: true,
			configurable: false,
			get: function() {
				if ("object"!==typeof this.__bit__) 
				Object.defineProperty(this, '__bit__', {
					enumerable: false,
					writable: false,
					editable: false,
					value: new bit(0, this)
				});

				return this.__bit__;
			}
		});
		return true;
	}

	var inc = function(bits) {
		if (arguments.length>1) return this.inc.call(this, Array.prototype.splice.apply(arguments));
		this.value = this.value | (bits instanceof Array ? bit.join(bits) : bits);
		return this._;
	};

	var exc = function(bits) {
		if (arguments.length>1) return this.exc.call(this, Array.prototype.splice.apply(arguments));
		this.value = this.value ^ (bits instanceof Array ? bit.join(bits) : bits);
		return this._;
	};

	/*
	Test for bitmask present in current. 
	*/
	var test = function(bits) {
		if (arguments.length===1) {
			if (bits instanceof Array) {
				return this.test.apply(this, bits);
			} else {
				return !!(this.value & bits);
			}
		} else if (arguments.length>1) {
			var result = true, self = this;
			Array.prototype.slice.apply(arguments).forEach(function(mask) {
				if (!(self.value & (mask instanceof Array ? bit.join(mask) : mask))) result = false;
			});
			return result;
		} else {
			return false;
		}
	};

	var havent = function() {
		return !this.test.apply(this, arguments);
	};

	bit.prototype = {
		construct: bit,
		// Override to new bitmask
		set: function(mask) {
			if (arguments.length>1) this.set.call(this, Array.prototype.splice.apply(arguments));
			this.value = mask instanceof Array ? bit.join(mask) : mask;
			return this._;
		},
		// Include bitmask
		inc: inc,
		add: inc,
		// Exclude bitmask
		exc: exc,
		exclude: exc,
		remove: exc,
		// Check entry
		test: test,
		have: test,
		// Check failure
		havent: havent,
		without: havent,
		// Check value exclude bits
		is: function(bits) {
			if (arguments.length>1) return this.is.call(this, Array.prototype.splice.apply(arguments));
			return this.value === (bits instanceof Array ? bit.join(bits) : bits);
		},
		// Сheck the full entry mask is false
		not: function(bits) {
			if (arguments.length>1) return this.is.call(this, Array.prototype.splice.apply(arguments));
			return this.value !== (bits instanceof Array ? bit.join(bits) : bits);
		},
		// Inverse current value
		inverse: function() {
			this.value = ~this.value;
			return this._;
		},
		reset: function() {
			this.value = 0;
			return this._;
		}
	}





	module.exports = bit;

/***/ }
/******/ ])
});
;