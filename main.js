jQuery(".btn.btn-lg.btn-default").click(function() {
	console.log("Future AJAX event will be here!");
	});
	
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

/*    function prepareEventHandlers() {
  	jQuery( "#speed" ).hide();
  };
  
  window.onload = function() {
  	console.log("Huh?");
  	prepareEventHandlers;
  };
  */