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
