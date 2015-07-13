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
