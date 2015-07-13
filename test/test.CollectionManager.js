var assert = require( 'assert' ),
	qpq = require( '../dist/QuidProQuote.dist.js' ),
	cases = {};

describe( 'CollectionManager', function () {
	var id1, id2,
		manager = new qpq.CollectionManager();

	it( 'Start with only default collection', function () {
		assert.equal( manager.getItemCount(), 1 );
	} );
	it( 'Add collection', function () {
		manager.addCollection( 'test' );
		assert.equal( manager.getItemCount(), 2 );
		manager.addCollection( 'test2' );
		assert.equal( manager.getItemCount(), 3 );
	} );
	it( 'Add quote to collection', function () {
		manager.addToCollection( 'Quote #1', 'test' );
		assert.deepEqual( manager.getRawQuotes( 'test' ), [ 'Quote #1' ] );

		manager.addToCollection( 'Quote #2' );
		assert.deepEqual( manager.getRawQuotes( 'default' ), [ 'Quote #2' ] );
		assert.deepEqual( manager.getRawQuotes( 'test' ), [ 'Quote #1' ] );

		manager.addToCollection( 'Quote #3', 'test' );
		assert.deepEqual( manager.getRawQuotes( 'test' ), [ 'Quote #1', 'Quote #3' ] );

		manager.addToCollection( 'Quote #4', 'test2' );
		assert.deepEqual( manager.getRawQuotes( 'test2' ), [ 'Quote #4' ] );
		manager.addToCollection( 'Quote #5', 'test2' );
		assert.deepEqual( manager.getRawQuotes( 'test2' ), [ 'Quote #4', 'Quote #5' ] );
	} );
	it( 'Remove collection', function () {
		manager.removeCollection( 'test' );
		assert.equal( !!manager.getCollection( 'test' ), false );
		// Make sure quotes are not in default
		assert.equal( manager.getCollection( 'default' ).getItemCount(), 1 )
	} );
	it( 'Remove collection preserve quotes', function () {
		manager.removeCollection( 'test2', true );
		assert.equal( !!manager.getCollection( 'test2' ), false );
		// Make sure quotes are not in default
		assert.deepEqual( manager.getCollection( 'default' ).getRawQuotes(), [ 'Quote #2', 'Quote #4', 'Quote #5' ] );
	} );
} );
