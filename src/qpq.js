var OO = require( 'oojs' ),
	qpq = {
		utils: {},
		mixin: {},
		struct: {},
	};

/**
 * Global quote counter for quotes ids
 *
 * @property {number}
 */
qpq.QuoteCounter = 0;

/**
 * Merge two or more objects.
 *
 * The first parameter will be the base object; in order
 * to duplicate an object, use an empty one in place of
 * the first parameter.
 */
qpq.utils.MergeObjects = function () {
	var i, len, baseObj, attr, obj,
		args = Array.prototype.slice.call( arguments );

	baseObj = args.shift();
	if ( baseObj !== Object( baseObj ) ) {
		if ( args.length && args[0] === Object( args[0] ) ) {
			baseObj = {};
		}
	}

	for ( i = 0, len = args.length; i  < len; i++ ) {
		obj = args[i];
		for ( attr in obj ) {
			if ( obj[attr] === Object( obj[attr] ) ) {
				// This is a nested object, recurse
				baseObj[attr] = qpq.utils.MergeObjects( baseObj[attr], obj[attr] );
			} else {
				baseObj[attr] = obj[attr];
			}
		}
	}
	return baseObj;
};

/**
 * Check if an object is empty.
 *
 * @param {Object} obj Object to test
 * @return {boolean} Object is empty
 */
qpq.utils.isEmptyObject = function ( obj ) {
	var attr;

	for ( attr in obj ) {
		return false;
	}
	return true;
};

/**
 * Get a random number within some range (inclusive)
 * @param {number} min Minimum range
 * @param {number} max Maximum range
 * @return {number} Random number
 */
qpq.utils.getRandom = function ( min, max ) {
	min = min || 0;
	max = max || 1;

	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
};
