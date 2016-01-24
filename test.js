var tap = require('tap');
var isrecrussiveloop = require('./index.js');

var nonrecrusive = {
	a: 1,
	b: 2,
	c: 3,
	d: 4,
	e: {
		a: 1,
		b: 2,
		c: 3
	}
};

var recrusive = {
}

var middle = {
	badway: recrusive
};

var sub = {
	badway: middle,
	badway2: recrusive
};

recrusive.badway = sub;

/*
Fake recrussion
*/

var someobject = {
    a: 1,
    b: new Date()
}

var fakerecrusive = {
    fakeway1: {
        here: someobject
    },
    fakeway2: someobject
}

tap.test("good way", function(t) {
    t.plan(1);
    var tested = isrecrussiveloop(nonrecrusive);
	t.ok(!tested, "nonrecrusive must have non recrusive result (means false)");
});

tap.test("bad way", function(t) {
    t.plan(1);
    var tested = isrecrussiveloop(recrusive);
    t.ok("object"===typeof tested && tested.join("->")=="badway->badway->badway", "recrusive must have recrusive result (means array)");
});

// Test for multiple result by bitmask
tap.test("multiple", function(t) {
    t.plan(1);
    var tested = isrecrussiveloop(recrusive, ISRECRUSIVELOOP_MULTIPLE);
    t.ok("object"===typeof tested && tested[0].join("->")=="badway->badway->badway" && tested[1].join("->")=="badway->badway2", "recrusive must have multiple result (means double array)");
});

// Test for multiple result by true
tap.test("multiple", function(t) {
    t.plan(1);
    var tested = isrecrussiveloop(recrusive, true);
    t.ok("object"===typeof tested && tested[0].join("->")=="badway->badway->badway" && tested[1].join("->")=="badway->badway2", "recrusive by true must have multiple result (means double array)");
});

// Test for throw error
tap.test("multiple", function(t) {
    t.plan(1);
    try {
        var tested = isrecrussiveloop(recrusive, ISRECRUSIVELOOP_THROW);
        t.bailout('Function must throw error');
    } catch(e) {
        t.ok(true, "");
    }

});

/*
Test fake recrussive when some object without recrussion repeat twice
*/
tap.test("multiple", function(t) {
    t.plan(1);
    var tested = isrecrussiveloop(fakerecrusive);
    t.ok(!tested, "fake recursively defined as recursively")

});
