( function( M, $ ) {

var toggle = ( function() {

	function wm_toggle_section( section_id ) {
		$( '#section_' + section_id + ',#content_' + section_id ).toggleClass( 'openSection' );
	}

	function wm_reveal_for_hash( hash ) {
		var $target = $( hash ),
			$p = $target.closest( '.content_block, .section_heading' ).eq( 0 );

		if ( $p.length > 0 && !$p.hasClass( 'openSection' ) ) {
			wm_toggle_section( $p.attr( 'id' ).split( '_' )[1] );
		}
	}

	function init() {
		function openSectionHandler() {
			var sectionName = this.id ? this.id.split( '_' )[1] : -1;
			if ( sectionName !== -1 ) {
				wm_toggle_section( sectionName );
			}
		}

		$( 'html' ).addClass( 'togglingEnabled' );
		$( '.section_heading' ).on( 'mousedown', openSectionHandler );
		$( '.section_anchors' ).remove();

		function checkHash() {
			var hash = window.location.hash;
			if ( hash.indexOf( '#' ) === 0 ) {
				wm_reveal_for_hash( hash );
			}
		}
		checkHash();
		$( '#content_wrapper a' ).on( 'click', checkHash );
	}

	return {
		wm_reveal_for_hash: wm_reveal_for_hash,
		wm_toggle_section: wm_toggle_section,
		init: init
	};

}());

M.define( 'toggle', toggle );

}( mw.mobileFrontend, jQuery ) );
