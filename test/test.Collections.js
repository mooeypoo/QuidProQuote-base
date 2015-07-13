var assert = require( 'assert' ),
	qpq = require( '../dist/QuidProQuote.dist.js' ),
	cases = {};

describe( 'Collection', function () {
	var id1, id2,
		testCollection = new qpq.struct.Collection( {
			id: 'test'
		} );

	it( 'Add quotes', function () {
		id1 = testCollection.addQuote( 'Quote #1' );
		assert.equal( testCollection.getItemCount(), 1 );
		assert.deepEqual( testCollection.getQuote( id1 ).getContent(), 'Quote #1' );

		id2 = testCollection.addQuote( 'Quote #2' );
		assert.equal( testCollection.getItemCount(), 2 );
		assert.deepEqual( testCollection.getQuote( id2 ).getContent(), 'Quote #2' );
	} );

	it( 'Get quote by id', function () {
		var quote = testCollection.getQuote( id1 );
		assert.equal( quote && quote.getContent(), 'Quote #1' );
	} );

	it( 'Get raw quotes', function () {
		assert.deepEqual( testCollection.getRawQuotes(), [ 'Quote #1', 'Quote #2' ] );
	} );

} );
