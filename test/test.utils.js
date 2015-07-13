var assert = require( 'assert' ),
	qpq = require( '../dist/QuidProQuote.dist.js' ),
	testDeepEqual = function ( details ) {
		assert.deepEqual(
			qpq.utils.MergeObjects.apply( {}, details.args ),
			details.expected
		);
	},
	testEqual = function ( details ) {
		assert.equal(
			qpq.utils.isEmptyObject.apply( {}, details.args ),
			details.expected
		);
	},
	allCases = {
		mergeObjects: [
			{
				msg: 'Merge empty object and plain object',
				args: [
					{},
					{ foo: 'bar', baz: 'moo' }
				],
				testMethod: testDeepEqual,
				expected: { foo: 'bar', baz: 'moo' }
			},
			{
				msg: 'Merge two existing objects',
				args: [
					{ a: 'b', c: 'd' },
					{ foo: 'bar', baz: 'moo' }
				],
				testMethod: testDeepEqual,
				expected: { a: 'b', c: 'd', foo: 'bar', baz: 'moo' }
			},
			{
				msg: 'Merge two objects with overriding data',
				args: [
					{ a: 'b', foo: 'd' },
					{ foo: 'bar', baz: 'moo' }
				],
				testMethod: testDeepEqual,
				expected: { a: 'b', foo: 'bar', baz: 'moo' }
			},
			{
				msg: 'Merge more than two objects with overriden data',
				args: [ { a: 'b' }, { c: 'd', e: 'f' }, { e: 'foo', g: 'h' } ],
				testMethod: testDeepEqual,
				expected: { a: 'b', c: 'd', e: 'foo', g: 'h' }
			},
			{
				msg: 'Deep merge: Object with nested objects',
				args: [
					{ a: 'b' },
					{ c: 'd', e: { f: 'g', h: 'i' } }
				],
				testMethod: testDeepEqual,
				expected: { a: 'b', c: 'd', e: { f: 'g', h: 'i' } }
			},
			{
				msg: 'Deep merge: Object with nested objects and overriden data',
				args: [
					{ a: 'b', foo: 'moo' },
					{ c: 'd', a: { f: 'g', h: 'i' }, foo: { a: 'b' } }
				],
				testMethod: testDeepEqual,
				expected: {
					a: { f: 'g', h: 'i' },
					c: 'd',
					foo: { a: 'b' }
				}
			}
		],
		isEmptyObject: [
			{
				msg: 'True: Empty object',
				args: [ {} ],
				testMethod: testEqual,
				expected: true
			},
			{
				msg: 'False: Non empty object',
				args: [ { a: 'foo' } ],
				testMethod: testEqual,
				expected: false
			}
		]
	};

describe( 'Utils', function () {
	var i, len, details;

	for ( test in allCases ) {
		( function ( key, cases ) {
			describe( key, function () {
				for ( i = 0, len = cases[key].length; i < len; i++ ) {
					details = cases[key][i];
					details.testMethod = details.testMethod || testDeepEqual;
					it( details.msg, details.testMethod.bind( this, details ) );
				}
			} )
		} )( test, allCases );
	}
} );
