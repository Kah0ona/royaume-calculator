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
                app.view.renderRoomSelectionScreen(data);
			break;
			case 'pricecalcScreen':
				var data = app.model.calculateTotalPrice();
				app.view.renderPricecalcScreen(data);
			break;
			case 'agendaScreen':
				var data = app.model.getAgenda();
				app.view.renderAgendaScreen(data);	
			break;
			case 'personalDetailsScreen':
				var data = app.model.getPersonalDetails();
				app.view.renderPersonalDetailsScreen(data);	
			break;
			case 'submitScreen':
				var data = {}
				data.rooms = app.model.getRooms();
				data.price = app.model.calculateTotalPrice();
				data.agenda = app.model.getAgenda();
				data.personal = app.model.getPersonalDetails();
				app.view.renderSubmitScreen(data);
			break;
			case 'thankYouScreen':
				var data = {};
				app.view.renderThankYouScreen(data);	
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
		$('#calculator').on('click', '#submitdetails', function(event){
			app.model.submitDetails(function(result){
				app.model.setScreenId('thankYouScreen');
				app.controller.render();
			});
		});
		$('#calculator').on('change', 'select[name="roomtype"]', function(){
			var roomtype = $('.calcform select[name="roomtype"]').val();
			$('.calcform input[name="m2"]').show();
			if(roomtype == app.model.roomtypes.STAIRS){
				$('.numspots').html('Aantal');
				$('.calcform input[name="numSpots"]').show();
				$('.calcform input[name="m2"]').hide()
			} else if(roomtype == app.model.roomtypes.MEETING || 
					  roomtype == app.model.roomtypes.OFFICE){
				$('.numspots').html('Aantal werkplekken');
				$('.calcform input[name="numSpots"]').show();
			} else {
				$('.calcform input[name="numSpots"]').hide();
				$('.numspots').html('');
			}
		});
		var toScreen = function(id){
			event.preventDefault();
			app.model.setScreenId(id);
			app.controller.render();
		}
		$('#calculator').on('click', '#to-agenda',function(event){ toScreen('agendaScreen')});
		$('#calculator').on('click', '#to-selectionscreen',function(event){ toScreen('roomSelectionScreen')});
		$('#calculator').on('click', '#to-personaldetails',function(event){ toScreen('personalDetailsScreen')});
		$('#calculator').on('click', '#to-pricecalc',function(event){ toScreen('pricecalcScreen')});
		$('#calculator').on('click', '#to-submit',function(event){ toScreen('submitScreen')});
		$('#calculator').on('change', '.personal-input', function(event){
			var elt = $(event.target);
			var key = elt.attr('name');
			app.model.setPersonalDetail(key,elt.val());
		});
		$('#calculator').on('click','.datetime',function(event){
			event.preventDefault();
			//var day = $(event.getTarget());
			var elt = $( event.target );
			var day = elt.attr('data-day'); 
			var time = elt.attr('data-time');
			if(app.model.isDateTimeSelected(day,time)){
				app.model.removeDayTimeFromAgenda(day,time);
			} else {
				app.model.clearDay(day);
				app.model.addDayTimeToAgenda(day,time);
			}
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

			if(m2 != parseInt(m2) && 
			   roomType != app.model.roomtypes.STAIRS  ){
			   errors.push('Vierkante meter: vul een geheel getal in.');	
			}
			
			if(numSpots != parseInt(numSpots) && 
			   roomType != app.model.roomtypes.TOILET && 
			   roomType != app.model.roomtypes.PANTRY && 
			   roomType != app.model.roomtypes.STAIRS && 
			   roomType != app.model.roomtypes.HALLWAY){
				errors.push('Aantal werkplekken: vul een geheel getal in.');
			}
			

			if(roomType == app.model.roomtypes.OFFICE && m2 > 60){
				errors.push('m<sup>2</sup> vul een getal in tussen de 0 en 60');
			}
			if(roomType == app.model.roomtypes.MEETING && m2 > 30){
				errors.push('m<sup>2</sup> vul een getal in tussen de 0 en 30');
			}
			if(roomType == app.model.roomtypes.PANTRY && m2 > 20){
				errors.push('m<sup>2</sup> vul een getal in tussen de 0 en 20');
			}
			if(roomType == app.model.roomtypes.TOILET && m2 > 4){
				errors.push('m<sup>2</sup> vul een getal in tussen de 0 en 4');
			}
			if(roomType == app.model.roomtypes.HALLWAY && m2 > 20){
				errors.push('m<sup>2</sup> vul een getal in tussen de 0 en 20');
			}

			
			if(errors.length>0) {
				var errMsg = "";
				for(var i = 0 ; i < errors.length; i++){
					console.log(errors[i]);
					errMsg += errors[i]+ "<br/>";
				}
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
