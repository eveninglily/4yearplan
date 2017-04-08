/*jQuery(".btn.btn-lg.btn-default").click(function() {
	console.log("Future AJAX event will be here!");
	});*/
	
/*jQuery( function() {
	jQuery( "#speed" ).selectmenu();
	  } );
  */
  
    jQuery( function() {
    var availableMajors = [
      "Computer Science (CMSC)",
      "Mathematics (MATH)",
      "Internet Studies (MEME)",
    ];
    jQuery( "#tags" ).autocomplete({
      source: availableMajors
    });
  } );

   function prepareEventHandlers() {
  	for(var i = 1; i <= 8; i++){
      jQuery( ".panel"+i).hide();
    }
  };
  
  window.onload = function() {
    prepareEventHandlers();
  };

$( ".dropdown-menu" ).click(function() {
  console.log($( ".dropdown-menu" ).event());
  prepareEventHandlers();
  //What to write here???
});

//Year seperator tabs

//Autocomplete majors
  $( function() {
    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }
 
    $( "#majors" ).autocomplete({
      source: "search.php",
      minLength: 2,
      select: function( event, ui ) {
        log( "Selected: " + ui.item.value + " aka " + ui.item.id );
      }
    });
  } );