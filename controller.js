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
		$('#calculator').on('click', '.remove-room',function(){
			var rid = $(this).attr('data-room-id');
			var rtype = $(this).attr('data-room-type');
			alert('test');
			app.model.removeRoom(rtype,rid);
			app.controller.render();
		});
	}
}( (window.app = window.app || {}), jQuery ));
