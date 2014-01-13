//view.js

(function( app, $, undefined ) {
    app.view = app.view || {};
    
	var previousScreen = null;	
	var currentScreen='init';
   /** Show the div with id screenId, and hide all other divs that have the
	 * 'appScreen' class.
     * @param {String} an id of a div element
     * @return {void}
     */
    function showScreen(screenId){
        //console.log('showScreen: ' + screenId);
        //console.log('previousScreen: '+previousScreen);
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

	app.view.renderRoomSelectionScreen = function(data){
		var elt = $('#roomselection_screen');
		elt.empty();
		//manipulate DOM...
		var table = getTableSelectionHTML(data.rooms);
		elt.html(table);
		showScreen('roomselection');
	}

	function getTableSelectionHTML(rooms){
		var html = "<table border='1'>";
		for(var roomtype in rooms){
			var rs = rooms[roomtype];
			html += "<tr><th colspan='5'>"+roomtype+"</th></tr>";
			for(var i = 0; i < rs.length; i++){
				var room = rs[i];
				html += "<tr><td>"+roomtype+" "+(i+1)+"</td>"+
						    "<td>"+room.m2+"</td>"+
							"<td>"+room.floorType+"</td>";

				if(room.workPlaces != null){
					html+= "<td>"+room.workPlaces+"</td>";
				} else {
				   	html += "<td>&nbsp;</td>";
				}

				html += "<td><a href='#' class='remove-room'"+
							"data-room-id='"+i+"'"+
							"data-room-type='"+roomtype+"'>"+
							"&times;"+
							"</a>"+
							"</td>";
				html += "</tr>";
			}	
		}
		return html;
	}

}( (window.app = window.app || {}), jQuery ));
