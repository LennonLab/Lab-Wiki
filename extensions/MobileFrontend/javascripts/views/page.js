( function( M,  $ ) {

	var
		View = M.require( 'view' ),
		Section, Page;

	Section = View.extend( {
		defaults: {
			hasReferences: false, // flag for references
			heading: '',
			content: '',
			index: -1, // index of this section in the given page
			id: null
		},
		initialize: function( options ) {
			this.heading = options.heading;
			this.index = options.index;
			this.content = options.content;
			this.hasReferences = options.hasReferences;
			this.id = options.id;
		}
	} );

	Page = View.extend( {
		defaults: {
			title: '',
			lead: '',
			sections: []
		},
		preRender: function( options ) {
			var s, i, level, text,
				$tmpContainer = $( '<div>' ),
				html,
				sectionNum = 0,
				lastId = 0,
				secs = options.sections,
				sectionData = {};

			this._anchorSection = {};
			this.title = options.title;
			for ( i = 0; i < secs.length; i++ ) {
				s = secs[ i ];
				level = s.level;
				text = s.text || '';

				if ( i === 0 ) { // do lead
					this.lead = text;
				}

				if ( level === '2' ) {
					sectionNum += 1;
					lastId = s.id;
					this._anchorSection[ 'section_' + sectionNum ] = lastId;
					sectionData[ sectionNum ] = { content: text,
						id: lastId, heading: s.line };
				} else if ( level ) {
					$tmpContainer.html( text );
					$tmpContainer.prepend(
						$( '<h' + level + '>' ).attr( 'id', s.anchor ).html( s.line )
					);
					html = $tmpContainer.html();
					// deal with pages which have an h1 at the top
					if ( !sectionData[ sectionNum ] ) {
						this.lead += html;
					} else {
						sectionData[ sectionNum ].content += html;
					}
				}
				if ( s.hasOwnProperty( 'references' ) ) {
					sectionData[ sectionNum ].hasReferences = true;
				}
				this._anchorSection[ s.anchor ] = lastId;
			}
			this.sections = [];
			this._sectionLookup = {};
			for ( s in sectionData ) {
				if ( sectionData.hasOwnProperty( s ) ) {
					this.appendSection( sectionData[ s ] );
				}
			}
			this._lastSectionId = lastId;
			options = $.extend( options, {
				sections: this.sections,
				lead: this.lead
			} );
		},
		appendSection: function( data ) {
			var section;
			if ( !data.id ) {
				data.id = ++this._lastSectionId;
			}
			data.index = this.sections.length + 1;
			section = new Section( data );
			if ( data.hasReferences ) {
				this._referenceLookup = section;
			}
			this.sections.push( section );
			this._sectionLookup[ section.id ] = section; // allow easy lookup of section
			return section;
		},
		/**
		 * Given an anchor that belongs to a heading
		 * find the Section it belongs to
		 *
		 * @param {string} an anchor associated with a section heading
		 * @return {Section} Section object that it belongs to
		 */
		getSectionFromAnchor: function( anchor ) {
			var parentId = this._anchorSection[ anchor ];
			if ( parentId ) {
				return this.getSubSection( parentId );
			}
		},
		getReferenceSection: function() {
			return this._referenceLookup;
		},
		getSubSection: function( id ) {
			return this._sectionLookup[ id ];
		},
		getSubSections: function() {
			return this.sections;
		}
	} );

	M.define( 'page', Page );

}( mw.mobileFrontend, jQuery ) );
