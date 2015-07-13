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
