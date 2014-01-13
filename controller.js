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
			alert('test');
			app.model.removeRoom(rtype,rid);
			app.controller.render();
		});

		$('#calculator').on('click', '#add-room', function(event){
			var roomType = $('.calcform select[name="roomtype"]').val();
			var m2 = $('.calcform input[name="m2"]').val();
			var numSpots = $('.calcform input[name="numSpots"]').val();
			var floorType = $('.calcform select[name="floortype"]').val();
			console.log(roomType);
			console.log(m2);
			console.log(numSpots);
			console.log(floorType);
			app.model.addRoom(roomType, m2, floorType, numSpots);
			app.controller.render();
		});
	}
}( (window.app = window.app || {}), jQuery ));
