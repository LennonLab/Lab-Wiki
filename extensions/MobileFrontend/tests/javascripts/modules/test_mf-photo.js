( function ( $, M ) {

var photo = M.require( 'photo' ),
	_wgMFLeadPhotoUploadCssSelector,
	articles = [
		// blank #content_0
		[ $( '<div><div id="content_0"></div></div>' ), true ],
		// infobox in #content_1
		[ $( '<div><div id="content_0"></div><div id="content_1"><table class="infobox"></div>' ), true ],
		// infobox in #content_0
		[ $( '<div><div id="content_0"><table class="infobox"></div></div>' ), false ],
		// navbox in #content_1
		[ $( '<div><div id="content_0"></div><div id="content_1"><table class="navbox"></div></div>' ), true ],
		// navbox in #content_0
		[ $( '<div><div id="content_0"><table class="navbox"></div></div>' ), false ],
		// thumbnail in #content_0
		[ $( '<div><div id="content_0"><div class="thumb"><img></div></div></div>' ), false ],
		// no #content_0 and no thumbnail, infobox or navbox
		[ $( '<div><p></p><div>' ), true ],
		// no #content_0 and a thumbnail
		[ $( '<div><div class="thumb"><img></div><div>' ), false ],
		// no #content_0 and an infobox
		[ $( '<div><table class="infobox"><div>' ), false ],
		// no #content_0 and a navbox
		[ $( '<div><table class="navbox"><div>' ), false ],
		// no #content_0, image not in .thumb (happens on main pages)
		[ $( '<div><img><div>' ), false ]
	];

QUnit.module( 'MobileFrontend photo', {
	setup: function() {
		_wgMFLeadPhotoUploadCssSelector = mw.config.get( 'wgMFLeadPhotoUploadCssSelector' );
		mw.config.set( 'wgMFLeadPhotoUploadCssSelector', 'img, .navbox, .infobox' );
		this.clock = sinon.useFakeTimers();
	},
	tearDown: function () {
		mw.config.set( 'wgMFLeadPhotoUploadCssSelector', _wgMFLeadPhotoUploadCssSelector );
		this.clock.restore();
	}
} );

QUnit.test( '#needsPhoto', function() {
	QUnit.expect( articles.length );
	var i;
	for ( i = 0; i < articles.length; i++ ) {
		strictEqual( photo._needsPhoto( articles[ i ][ 0 ] ), articles[ i ][ 1 ], 'article ' + i );
	}
} );

QUnit.test( 'PhotoUploadProgress', 3, function() {
	var progressPopup = new photo._PhotoUploadProgress();
	ok(
		progressPopup.$( '.wait' ).text().match( /wait/ ),
		'set initial wait message'
	);
	this.clock.tick( 11000 );
	ok(
		progressPopup.$( '.wait' ).text().match( /still/ ),
		'set secondary wait message'
	);
	this.clock.tick( 11000 );
	ok(
		progressPopup.$( '.wait' ).text().match( /wait/ ),
		'set initial wait message again'
	);
} );

QUnit.test( 'generateFileName', 1, function() {
	var date = new Date( 2010, 9, 15, 12, 9 ),
		name = photo.generateFileName( 'Jon eating bacon next to an armadillo', '.jpg', date );
	strictEqual( name, 'Jon eating bacon next to an armadillo 2010-10-15 12-09.jpg',
		'Check file name is description with appended date' );
} );

QUnit.test( 'generateFileName test padding', 1, function() {
	var date = new Date( 2013, 2, 1, 12, 51 ), // note 0 = january
		name = photo.generateFileName( 'Tomasz eating bacon next to a dinosaur', '.jpg', date );
	strictEqual( name, 'Tomasz eating bacon next to a dinosaur 2013-03-01 12-51.jpg',
		'Check file name is description with appended date and numbers were padded' );
} );

QUnit.test( 'generateFileName long line', 2, function() {
	var i,
		longDescription = '',
		date = new Date( 2013, 2, 1, 12, 51 ), name;

	for ( i = 0; i < 240; i++ ) {
		longDescription += 'a';
	}
	name = photo.generateFileName( longDescription, '.jpg', date );
	strictEqual( name.length, 240, 'Check file name was shortened to the minimum length' );
	strictEqual( name.substr( 233, 7 ), '-51.jpg', 'ends with date' );
} );

QUnit.test( 'generateFileName with new lines', 1, function() {
	var
		description = 'One\nTwo\nThree',
		date = new Date( 2013, 2, 1, 12, 51 ), name;

	name = photo.generateFileName( description, '.jpg', date );
	strictEqual( name, 'One-Two-Three 2013-03-01 12-51.jpg', 'New lines converted' );
} );

QUnit.test( 'trimUtf8String', 4, function() {
	strictEqual( photo.trimUtf8String( 'Just a string', 20 ), 'Just a string', 'ascii string fits' );
	strictEqual( photo.trimUtf8String( 'Just a string', 10 ), 'Just a str', 'ascii string truncated' );
	strictEqual( photo.trimUtf8String( 'Júst á stríng', 10 ), 'Júst á s', 'latin1 string truncated' );
	strictEqual( photo.trimUtf8String( 'こんにちは', 10 ), 'こんに', 'CJK string truncated' );
} );

QUnit.module( 'MobileFrontend photo', {
	setup: function() {
		var resp = {"upload":{"result":"Warning","warnings":{"badfilename":"::.JPG"},"filekey":"1s.1.jpg","sessionkey":"z1.jpg"}},
			resp2 = {"warnings":{"main":{"*":"Unrecognized parameters: 'useformat', 'r'"}},"upload":{"result":"Success","filename":"Tulip_test_2013-05-13_09-45.jpg","imageinfo":{"timestamp":"2013-05-13T16:45:53Z","user":"Jdlrobson","userid":825,"size":182912,"width":960,"height":578,"parsedcomment":"Added photo for use on page","comment":"Added photo for use on page","url":"http://upload.beta.wmflabs.org/wikipedia/en/b/b3/Tulip_test_2013-05-13_09-45.jpg","descriptionurl":"http://en.wikipedia.beta.wmflabs.org/wiki/File:Tulip_test_2013-05-13_09-45.jpg","sha1":"7e56537b1929d7d4d211bded2d46ba01ddbbe30f","metadata":[{"name":"JPEGFileComment","value":[{"name":0,"value":"*"}]},{"name":"MEDIAWIKI_EXIF_VERSION","value":2}],"mime":"image/jpeg","mediatype":"BITMAP","bitdepth":8}}},
			EventEmitter = M.require( 'eventemitter' );

		this.api = new photo.PhotoApi();
		this.api2 = new photo.PhotoApi();
		function getTokenStub() {
			return $.Deferred().resolve( 'foo' );
		}
		sinon.stub( this.api, 'getToken', getTokenStub );
		sinon.stub( this.api, 'post', function() {
			var req = $.Deferred().resolve( resp );
			$.extend( req, EventEmitter.prototype );
			return req;
		} );
		sinon.stub( this.api2, 'getToken', getTokenStub );
		sinon.stub( this.api2, 'post', function() {
			var req = $.Deferred().resolve( resp2 );
			$.extend( req, EventEmitter.prototype );
			return req;
		} );
	},
	tearDown: function () {
		this.api = false;
		this.api2 = false;
	}
} );

QUnit.test( 'upload with missing filename', 1, function() {
	var badResponse;
	this.api.save( {
		insertInPage: true,
		file: {
			name: '::'
		},
		description: 'yo:: yo ::'
	} ).fail( function() {
		badResponse = true;
	} );
	strictEqual( badResponse, true, 'The request caused a bad file name error' );
} );

QUnit.test( 'successful upload', 1, function() {
	var goodResponse;
	this.api2.save( {
		insertInPage: true,
		file: {
			name: 'z.jpg'
		},
		description: 'hello world'
	} ).done( function() {
		goodResponse = true;
	} );
	strictEqual( goodResponse, true, 'The request succeeded and ran done callback' );
} );

}( jQuery, mw.mobileFrontend) );
