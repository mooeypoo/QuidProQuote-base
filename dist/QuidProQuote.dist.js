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

module.exports = qpq;

/**
 * List mixin
 * Adapted from oojs-ui's OO.ui.GroupElement
 *
 * @mixin
 * @abstract
 * @constructor
 * @param {Object} config Configuration options
 */
qpq.mixin.List = function qpqMixinList( config ) {
	// Configuration initialization
	config = config || {};

	this.items = [];

	// Store references to items by their ids
	this.itemsById = {};

	this.aggregateItemEvents = {};
};

/* Events */

/**
 * @event add Items have been added
 * @param {qpq.struct.Item[]} items Added items
 * @param {number} index Index items were added at
 */

/**
 * @event remove Items have been removed
 * @param {qpq.struct.Item[]} items Removed items
 */

/* Methods */

/**
 * Get all items
 *
 * @return {qpq.struct.Item[]} Items in the list
 */
qpq.mixin.List.prototype.getItems = function () {
	return this.items.slice( 0 );
};

/**
 * Get an item by its id
 * @param {string} id Item id
 * @return {qpq.struct.Item} Item
 */
qpq.mixin.List.prototype.getItemById = function ( id ) {
	return this.itemsById[ id ];
};

/**
 * Get the index of a specific item
 *
 * @param {qpq.struct.Item} item Requested item
 * @return {number} Index of the item
 */
qpq.mixin.List.prototype.getItemIndex = function ( item ) {
	return this.items.indexOf( item );
};

/**
 * Get number of items
 *
 * @return {number} Number of items in the list
 */
qpq.mixin.List.prototype.getItemCount = function () {
	return this.items.length;
};

/**
 * Check if a list contains no items.
 *
 * @return {boolean} Group is empty
 */
qpq.mixin.List.prototype.isEmpty = function () {
	return !this.items.length;
};

/**
 * Aggregate the events emitted by the group.
 * Taken from oojs-ui's OO.ui.GroupElement#aggregate
 *
 * When events are aggregated, the group will listen to all contained items for the event,
 * and then emit the event under a new name. The new event will contain an additional leading
 * parameter containing the item that emitted the original event. Other arguments emitted from
 * the original event are passed through.
 *
 * @param {Object.<string,string|null>} events An object keyed by the name of the event that should be
 *  aggregated  (e.g., ‘click’) and the value of the new name to use (e.g., ‘groupClick’).
 *  A `null` value will remove aggregated events.

 * @throws {Error} An error is thrown if aggregation already exists.
 */
qpq.mixin.List.prototype.aggregate = function ( events ) {
	var i, len, item, add, remove, itemEvent, groupEvent;

	for ( itemEvent in events ) {
		groupEvent = events[ itemEvent ];

		// Remove existing aggregated event
		if ( Object.prototype.hasOwnProperty.call( this.aggregateItemEvents, itemEvent ) ) {
			// Don't allow duplicate aggregations
			if ( groupEvent ) {
				throw new Error( 'Duplicate item event aggregation for ' + itemEvent );
			}
			// Remove event aggregation from existing items
			for ( i = 0, len = this.items.length; i < len; i++ ) {
				item = this.items[ i ];
				if ( item.connect && item.disconnect ) {
					remove = {};
					remove[ itemEvent ] = [ 'emit', this.aggregateItemEvents[ itemEvent ], item ];
					item.disconnect( this, remove );
				}
			}
			// Prevent future items from aggregating event
			delete this.aggregateItemEvents[ itemEvent ];
		}

		// Add new aggregate event
		if ( groupEvent ) {
			// Make future items aggregate event
			this.aggregateItemEvents[ itemEvent ] = groupEvent;
			// Add event aggregation to existing items
			for ( i = 0, len = this.items.length; i < len; i++ ) {
				item = this.items[ i ];
				if ( item.connect && item.disconnect ) {
					add = {};
					add[ itemEvent ] = [ 'emit', groupEvent, item ];
					item.connect( this, add );
				}
			}
		}
	}
};

/**
 * Add items
 *
 * @param {qpq.struct.Item[]} items Items to add
 * @param {number} index Index to add items at
 * @chainable
 * @fires add
 */
qpq.mixin.List.prototype.addItems = function ( items, index ) {
	var i, len, item, event, events, currentIndex, existingItem, at;

	if ( items.length === 0 ) {
		return this;
	}

	// Support adding existing items at new locations
	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[i];
		existingItem = this.getItemById( item.getId() );

		// Check if item exists then remove it first, effectively "moving" it
		currentIndex = this.items.indexOf( existingItem );
		if ( currentIndex >= 0 ) {
			this.removeItems( [ existingItem ] );
			// Adjust index to compensate for removal
			if ( currentIndex < index ) {
				index--;
			}
		}

		// Add the item
		if ( item.connect && item.disconnect && !qpq.utils.isEmptyObject( this.aggregateItemEvents ) ) {
			events = {};
			for ( event in this.aggregateItemEvents ) {
				events[ event ] = [ 'emit', this.aggregateItemEvents[ event ], item ];
			}
			item.connect( this, events );
		}

		// Add by reference
		this.itemsById[ item.getId() ] = items[i];
	}

	if ( index === undefined || index < 0 || index >= this.items.length ) {
		at = this.items.length;
		this.items.push.apply( this.items, items );
	} else if ( index === 0 ) {
		at = 0;
		this.items.unshift.apply( this.items, items );
	} else {
		at = index;
		this.items.splice.apply( this.items, [ index, 0 ].concat( items ) );
	}
	this.emit( 'add', items, at );

	return this;
};

/**
 * Remove items
 *
 * @param {qpq.struct.Item[]} items Items to remove
 * @chainable
 * @fires remove
 */
qpq.mixin.List.prototype.removeItems = function ( items ) {
	var i, len, item, index, remove, itemEvent,
		removed = [];

	if ( items.length === 0 ) {
		return this;
	}

	// Remove specific items
	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[ i ];
		index = this.items.indexOf( item );
		if ( index !== -1 ) {
			if (
				item.connect && item.disconnect &&
				!qpq.utils.isEmptyObject( this.aggregateItemEvents )
			) {
				remove = {};
				if ( Object.prototype.hasOwnProperty.call( this.aggregateItemEvents, itemEvent ) ) {
					remove[ itemEvent ] = [ 'emit', this.aggregateItemEvents[ itemEvent ], item ];
				}
				item.disconnect( this, remove );
			}
			this.items.splice( index, 1 );
			// Remove reference by Id
			delete this.itemsById[ item.getId() ];
		}
	}
	this.emit( 'remove', removed );

	return this;
};

/**
 * Clear all items
 *
 * @fires clear
 */
qpq.mixin.List.prototype.clearItems = function () {
	var i, len, item, remove, itemEvent;

	// Remove all items
	for ( i = 0, len = this.items.length; i < len; i++ ) {
		item = this.items[ i ];
		if (
			item.connect && item.disconnect &&
			!qpq.utils.isEmptyObject( this.aggregateItemEvents )
		) {
			remove = {};
			if ( Object.prototype.hasOwnProperty.call( this.aggregateItemEvents, itemEvent ) ) {
				remove[ itemEvent ] = [ 'emit', this.aggregateItemEvents[ itemEvent ], item ];
			}
			item.disconnect( this, remove );
		}
	}

	this.items = [];
	this.itemsById = {};

	this.emit( 'clear' );

	return this;
};

/**
 * Rated item mixin
 *
 * @class
 *
 * @abstract
 * @constructor
 * @param {Object} config Configuration options
 */
qpq.mixin.RatedItem = function qpqMixinRatedItem( config ) {
	// Configuration initialization
	config = config || {};

	this.rating = config.rating || 0;
};

/* Events */

/**
 * @event rating
 * @param {number} rating Current rating
 */

/* Methods */

/**
 * Set the rating of this item
 *
 * @param {number} rating Rating value
 */
qpq.mixin.RatedItem.prototype.setRating = function ( rating ) {
	if ( this.rating !== rating ) {
		this.rating = rating;
		this.emit( 'rating', this.rating );
	}
};

/**
 * Reset the current rating on this quote
 */
qpq.mixin.RatedItem.prototype.resetRating = function () {
	this.setRating( 0 );
};

/**
 * Get the rating of this item
 *
 * @return {number} Rating value
 */
qpq.mixin.RatedItem.prototype.getRating = function () {
	return this.rating;
};

/**
 * Change the current rating value
 *
 * @param {number} rating Rating value
 */
qpq.mixin.RatedItem.prototype.rate = function ( rating ) {
	rating += this.rating;
	this.setRating( rating );
};

/**
 * Item base class
 *
 * @class
 * @abstract
 *
 * @constructor
 * @param {Object} config Configuration object
 * @cfg {string|number} [id] Item id
 * @cfg {string} content Item content
 */
qpq.struct.Item = function qpqItem ( config ) {
	// Mixin constructor
	OO.EventEmitter.call( this );

	this.id = config.id !== undefined ? config.id : null;
	this.content = config.content || '';

	this.comparableHash = {};
};

/* Inheritance */

OO.mixinClass( qpq.struct.Item, OO.EventEmitter );

/**
 * Get a hash object representing the current state
 * of the item
 *
 * @return {Object} Hash object
 */
qpq.struct.Item.prototype.getHashObject = function () {
	return {
		id: this.getId(),
		content: this.getContent()
	};
};

/**
 * Get item id
 *
 * @return {string} Item Id
 */
qpq.struct.Item.prototype.getId = function () {
	return this.id;
};

/**
 * Set item id
 *
 * @param {string} id Item Id
 */
qpq.struct.Item.prototype.setId = function ( id ) {
	this.id = id;
};

/**
 * Get item content
 *
 * @return {string} Item content
 */
qpq.struct.Item.prototype.getContent = function () {
	return this.content;
};

/**
 * Get item content
 *
 * @return {string} content Item content
 */
qpq.struct.Item.prototype.setContent = function ( content ) {
	if ( content !== undefined && this.content !== content ) {
		this.content = content;
		this.emit( 'changeContent', this.content );
	}
};

/*
/**
 * Get the comparable hash
 *
 * @return {Object} Hash
 */
qpq.struct.Item.prototype.getComparableHash = function () {
	return this.comparableHash;
};

/**
 * Store a new comparable hash. This is similar to setting comparable
 * breakpoints to the state of the object. The comparable hash will be
 * compared to the current state of the object to determine whether
 * the object has changes pending.
 *
 * @param {Object} [hash] New hash. If none given, the current hash will
 * be stored
 */
qpq.struct.Item.prototype.storeComparableHash = function ( hash ) {
	this.comparableHash = hash || qpq.utils.MergeObjects( {}, this.getHashObject() );
};

/**
 * Check whether the topic changed since we last saved a comparable hash
 *
 * @return {boolean} Item has changed
 */
qpq.struct.Item.prototype.hasBeenChanged = function () {
	return !OO.compare( this.comparableHash, this.getHashObject() );
};

/**
 * Quote object
 *
 * @class
 *
 * @constructor
 * @param {Object} config Configuration options
 */
qpq.struct.Quote = function qpqQuote( config ) {
	config = config || {};

	// Parent constructor
	qpq.struct.Quote.parent.call( this, config );

	// Mixin constructor
	qpq.mixin.RatedItem.call( this, config );
};

/* Initialization */

OO.inheritClass( qpq.struct.Quote, qpq.struct.Item );
OO.mixinClass( qpq.struct.Quote, qpq.mixin.RatedItem );

/**
 * @inheritdoc
 */
qpq.struct.Quote.prototype.getHashObject = function () {
	return qpq.utils.MergeObjects(
		{},
		// Parent
		Quote.parent.prototype.getHashObject.call( this ),
		// Mixins
		qpq.mixin.RatedItem.prototype.getHashObject.call( this )
	);
};

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
