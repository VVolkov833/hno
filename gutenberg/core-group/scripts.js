(() => {
    console.log( 'works' );
});
/*
(function($) {
	function init() {
		if ( $( '.vv-limit-height' ).length === 0 )
			return;

		$( '.vv-limit-height' )
			.addClass( 'vv-lh-active' )
			.addClass( 'vv-lh-equipped' )
			.append( '<div class="vv-lh-button"></div>' );
		$( '.vv-lh-button' ).click( function() {
			var self = $( this );
			self.parent().removeClass( 'vv-lh-active' );
			setTimeout( function() {
				$( '.vv-limit-height' ).not( '.vv-lh-active' ).removeClass( 'vv-lh-equipped' );
			}, 800 );
		});
	}
	$( document ).ready( init );
})(jQuery);
//*/