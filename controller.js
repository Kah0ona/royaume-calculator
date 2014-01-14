//controller
//



(function( app, $, undefined ) {
    app.controller = app.controller || {};

	//public
	app.controller.render = function(){
        var screenId = app.model.getScreenId();
        
        var data = {};
        switch(screenId){
            case 'roomSelectionScreen':
				data.rooms = app.model.getRooms();
				console.log(app.view);
                app.view.renderRoomSelectionScreen(data);
			break;

			case 'second':

			break;
       }
    };

	app.controller.init = function(){
	    bindButtons();
	}
	
	function bindButtons(){
		$('#calculator').on('click', '.remove-room',function(event){
			event.preventDefault();
			var rid = $(this).attr('data-room-id');
			var rtype = $(this).attr('data-room-type');
			
			app.model.removeRoom(rtype,rid);
			app.controller.render();
		});

		$('#calculator').on('click', '#add-room', function(event){
			event.preventDefault();
			$('.room-error').hide();
			
			var roomType = $('.calcform select[name="roomtype"]').val();
			var m2 = $('.calcform input[name="m2"]').val();
			var numSpots = $('.calcform input[name="numSpots"]').val();
			var floorType = $('.calcform select[name="floortype"]').val();
			var errors = [];

			if(m2 != parseInt(m2)){
				errors.push('Vierkante meter: vul een geheel getal in.');	
			}
			
			if(numSpots != parseInt(numSpots)){
				errors.push('Aantal werkplekken: vul een geheel getal in.');
			}
console.log(errors);
			
			if(errors.length>0) {
				var errMsg = "";
				for(var i = 0 ; i < errors.length; i++){
					console.log(errors[i]);
					errMsg += errors[i]+ "<br/>";
				}
				console.log(errMsg);
				$('.room-error .error').html(errMsg);
				$('.room-error').show();
			} else {
				app.model.addRoom(roomType, m2, floorType, numSpots);
				app.controller.render();
				$('.room-error').hide();
				$('.room-error .error').html('');
			}

		});
	}
}( (window.app = window.app || {}), jQuery ));
