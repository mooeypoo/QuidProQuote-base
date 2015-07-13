/**
 * Collection object
 *
 * @class
 *
 * @constructor
 * @param {Object} config Configuration options
 */
qpq.struct.Collection = function qpqCollection( config ) {
	config = config || {};

	// Parent constructor
	qpq.struct.Collection.parent.call( this, config );

	// Mixin constructor
	qpq.mixin.List.call( this, config );
	// Mixin constructor
	qpq.mixin.RatedItem.call( this, config );

	this.aggregate( this, {
		rating: [ 'emit', 'quoteRating' ]
	} );
};

/* Initialization */

OO.inheritClass( qpq.struct.Collection, qpq.struct.Item );
OO.mixinClass( qpq.struct.Collection, qpq.mixin.List );
OO.mixinClass( qpq.struct.Collection, qpq.mixin.RatedItem );

/* Events */

/**
 * Quote rating has changed.
 *
 * @event quoteRating
 * @param {qpq.struct.Quote} quote Quote item
 * @param {number} rating New rating
 */

/* Methods */

/**
 * @inheritdoc
 */
qpq.struct.Collection.prototype.getHashObject = function () {
	return qpq.utils.MergeObjects(
		{},
		// Parent
		Quote.parent.prototype.getHashObject.call( this ),
		// Mixins
		qpq.mixin.RatedItem.prototype.getHashObject.call( this ),
		qpq.mixin.List.prototype.getHashObject.call( this )
	);
};

/**
 * Add quote to the collection
 *
 * @param {string} text Quote text
 */
qpq.struct.Collection.prototype.addQuote = function ( text ) {
	var quote = new qpq.struct.Quote( {
			id: qpq.QuoteCounter++,
			content: text
		} );

	this.addItems( [ quote ] );
	return quote.getId();
};

/**
 * Remove quote by its id
 *
 * @param {[type]} quoteId Quote id
 */
qpq.struct.Collection.prototype.removeQuote = function ( quoteId ) {
	var quote = this.getItemById( quoteId );

	if ( quote ) {
		this.removeItems( [ quote ] );
	}
};

/**
 * Get a specific quote by its Id
 *
 * @param {string|number} quoteId Quote Id
 * @return {qpq.struct.Quote} Requested quote object
 */
qpq.struct.Collection.prototype.getQuote = function ( quoteId ) {
	return this.getItemById( quoteId );
};

/**
 * Get a random quote from this collection
 *
 * @return {qpq.struct.Quote} Random quote
 */
qpq.struct.Collection.prototype.getRandomQuote = function () {
	var rand = qpq.utils.getRandom( 0, this.getItemCount() - 1 ),
		items = this.getItems();
	return items[rand];
};

/**
 * Get an array of all quotes text
 * @return {string[]} Quotes text
 */
qpq.struct.Collection.prototype.getRawQuotes = function () {
	var i, len,
		result = [],
		items = this.getItems();

	for( i = 0, len = items.length; i < len; i++ ) {
		result.push( items[i].getContent() );
	}

	return result;
};

/**
 * Get a specific quote text by its Id
 *
 * @param {string|number} quoteId Quote Id
 * @return {string} Requested quote text
 */
qpq.struct.Collection.prototype.getQuoteText = function ( quoteId ) {
	var quote = this.getItemById( quoteId );

	return quote && quote.getContent();
};

/**
 * Use setContent() for the name property
 *
 * @param {string} name Collection name
 */
qpq.struct.Collection.prototype.setName = function ( name ) {
	this.setContent( name );
};

/**
 * Get the collection name
 *
 * @return {string} Collection name
 */
qpq.struct.Collection.prototype.getName = function () {
	return this.getContent();
};

/**
 * An alias for getItems
 *
 * @return {qpq.struct.Quote[]} An array of Quote objects in
 *  this collection
 */
qpq.struct.Collection.prototype.getQuotes = function () {
	return this.getItems();
};
