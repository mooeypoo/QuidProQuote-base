var assert = require( 'assert' ),
	qpq = require( '../dist/QuidProQuote.dist.js' ),
	cases = {};

describe( 'Quote', function () {
	var id1, id2,
		testQuote = new qpq.struct.Quote( {
			id: 1,
			content: 'Test #1'
		} );

	it( 'Get quote id', function () {
		assert.equal( testQuote.getId(), 1 );
	} );

	it( 'Get quote text', function () {
		assert.equal( testQuote.getContent(), 'Test #1' );
	} );

	it( 'Rate quote', function () {
		testQuote.rate( 10 );
		assert.equal( testQuote.getRating(), 10 );
		testQuote.rate( 20 );
		assert.equal( testQuote.getRating(), 30 );
		testQuote.rate( -5 );
		assert.equal( testQuote.getRating(), 25 );
	} );
} );
