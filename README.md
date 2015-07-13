# QuidProQuote Base

Basic quote and rating system.

Quotes can be added into collections and then fetched randomly or by id. The quotes and collections can be rated.


## Exmaple Usage
The basic system was meant to be lightweight and used in both nodejs and web environments.

### NodeJS example
```javascript
var qpq = include( 'quidproquote-base' );

qpq.addCollection( 'test' );

// Add quotes to test collection
id1 = qpq.addQuote( 'Quote #1', 'test' );
id2 = qpq.addQuote( 'Quote #2', 'test' );
id3 = qpq.addQuote( 'Quote #3', 'test' );

// Add quote to default collection
id4 = qpq.addQuote( 'Quote #4' );

// Fetch specific quote from test collection
quote = qpq.getQuote( 'test', id1 );
// Get the text of the quote
quote.getContent();
// Rate the quote
quote.rate( 10 );
quote.rate( -1 );
```
## Credit
* Authored by [Moriel Schottlender (mooeypoo)](https://github.com/mooeypoo/)
* Depends on [oojs](https://www.mediawiki.org/wiki/OOjs)

## Bugs and feedback
Please report bugs and suggesions in the github repository's issues page.
