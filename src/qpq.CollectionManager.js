/**
 * Collection manager object
 *
 * @class
 *
 * @constructor
 * @param {Object} config Configuration options
 */
qpq.CollectionManager = function qpqCollectionManager( config ) {
	config = config || {};

	// Mixin constructor
	OO.EventEmitter.call( this );

	// Mixin constructor
	qpq.mixin.List.call( this, config );

	// Start with initial 'default' collection
	this.defaultCollection = new qpq.struct.Collection( {
		id: 'default'
	} );
	this.addItems( [ this.defaultCollection ] );

	// Aggregate events
	this.aggregate( {
		add: 'addQuote',
		remove: 'removeQuote',
		clear: 'clearQuotes',
		quoteRating: 'quoteItemRating'
	} );
};

/* Initialization */

OO.mixinClass( qpq.CollectionManager, OO.EventEmitter );
OO.mixinClass( qpq.CollectionManager, qpq.mixin.List );

/* Events */

/**
 * Add quote to a specific collection. If no collection name
 * is supplied, add to the default collection.
 *
 * @param {string} quote Quote text
 * @param {string} [collectionName] Collection name
 */
qpq.CollectionManager.prototype.addToCollection = function ( quote, collectionName ) {
	var collection;
	collectionName = collectionName || 'default';

	collection = this.getCollection( collectionName );

	if ( collection ) {
		return collection.addQuote( quote );
	}
	return null;
};

/**
 * Get specific quote from the collection
 *
 * @param {string} collectionName Collection name
 * @param {string} quoteId Quote id
 * @return {qpq.struct.Quote|null} Requested quote
 */
qpq.CollectionManager.prototype.getQuote = function ( collectionName, quoteId ) {
	var collection = this.getCollection( collectionName );

	return ( collection && collection.getQuote( quoteId ) ) || null;
};

/**
 * Get an array of quotes text from a collection. If no collection name
 * is supplied, give back the list from default collection.
 *
 * @param {string} [collectionName] Collection name
 * @return {string[]} An array of quotes text
 */
qpq.CollectionManager.prototype.getRawQuotes = function ( collectionName ) {
	var collection;
	collectionName = collectionName || 'default';

	collection = this.getItemById( collectionName );

	return ( collection && collection.getRawQuotes() ) || [];
};

/**
 * Add a new collection
 *
 * @param {string} collectionName Collection id
 */
qpq.CollectionManager.prototype.addCollection = function ( collectionName ) {
	var item = this.getCollection( collectionName );

	if ( !item ) {
		this.addItems( [
			new qpq.struct.Collection( {
				id: collectionName
			} )
		] );
		return true;
	}
	return false;
};

/**
 * Remove a collection.
 * By default, the quotes will be lost, unless specifically specified
 * to move them to the default collection.
 *
 * @param {string} collectionName Collection id
 * @param {boolean} [moveQuotesToDefault] Move quotes to default collection
 * @return {boolean} Removal successful
 */
qpq.CollectionManager.prototype.removeCollection = function ( collectionName, moveQuotesToDefault ) {
	var collection = this.getCollection( collectionName );
	if ( !collection ) {
		return false;
	}

	if ( moveQuotesToDefault ) {
		this.defaultCollection.addItems( collection.getItems() );
	}
	return !!this.removeItems( [ collection ] );
};

/**
 * Get collection by its id
 *
 * @param {string} collectionName Collection id
 * @return {qpq.struct.Collection} Collection
 */
qpq.CollectionManager.prototype.getCollection = function ( collectionId ) {
	return this.getItemById( collectionId );
};

/**
 * Get random quote form a collection. If no collection given, use default
 * collection.
 *
 * @param {string} collectionName Collection name
 * @return {qpq.struct.Quote|null} Random quote; null if no quotes found
 *  or if collection doesn't exist.
 */
qpq.CollectionManager.prototype.getRandomQuote = function ( collectionName ) {
	collectionName = collectionName || 'default';

	collection = this.getCollection( collectionName );

	return ( collection && collection.getRandomQuote() ) || null;
};
