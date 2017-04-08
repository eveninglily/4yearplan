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
=======
function openSemester(evt, semName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
>>>>>>> f2ddd14958fd34c144416a2f1c361b48c7897738
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementbyID(semName).style.display = "block";
    evt.currentTarget.className += " active";
}