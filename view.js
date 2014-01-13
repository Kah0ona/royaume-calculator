//view.js
//
//


(function( app, $, undefined ) {
    app.view = app.view || {};
	app.view.someVar = true; //public
	
	var currentScreen='init';
   /** Show the div with id screenId, and hide all other divs that have the 'appScreen' class.
     * @param {String} an id of a div element
     * @return {void}
     */
    function showScreen(screenId){
        console.log('showScreen: ' + screenId);
        console.log('previousScreen: '+previousScreen);
        if (previousScreen != screenId){ //only if screen id changed
            var divId = '#' + screenId + '_screen';
            //$('.appScreen').not(divId).hide();
            $('.appScreen').not(divId).fadeOut(600, function(){
               app.view.loaded = false;
               $(divId).fadeIn(600, function(){
                    app.view.loaded = true;
               }); 
            });
         
        }
        previousScreen = screenId;
    }


	app.view.renderRoomSelectionScreen = function(){
		$('#roomselection_screen').clear();
		//manipulate DOM...
		var rooms = app.model.getRooms();
		addTableSelectionToScreen(rooms);	

		showScreen('roomselection');
	}

	function addTableSelectionToScreen(rooms){
		for(var roomtype in rooms){
			html += "<th colspan=\"4\">"+roomtype+"</th>";
		}
	}

}( (window.app = window.app || {}), jQuery ));
