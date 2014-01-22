//model.js

(function( app, $, undefined ) {
    app.model = app.model || {};
	
	app.model.roomtypes = app.model.roomtypes || {};
	app.model.floortypes = app.model.floortypes || {};
	app.model.days = app.model.days || {};
	app.model.times = app.model.times || {};
	app.model.person = app.model.person || {};

	app.model.roomtypes.OFFICE = 'Kantoorruimte';
	app.model.roomtypes.MEETING = 'Vergaderruimte';
	app.model.roomtypes.PANTRY = 'Pantry / keuken';
	app.model.roomtypes.TOILET = 'Toilet';
	app.model.roomtypes.HALLWAY = 'Hal';
	app.model.roomtypes.STAIRS = 'Trap';

	app.model.floortypes.HARD = 'Hard';
	app.model.floortypes.SOFT = 'Zacht';

	app.model.days.MONDAY = "Maandag";
	app.model.days.TUESDAY = "Dinsdag";
	app.model.days.WEDNESDAY = "Woensdag";
	app.model.days.THURSDAY = "Donderdag";
	app.model.days.FRIDAY = "Vrijdag";
	app.model.days.SATURDAY = "Zaterdag";
	app.model.days.SUNDAY = "Zondag";
	
	app.model.times.PREOFFICE = "Voor 09.00 uur";
	app.model.times.OFFICE = "Tussen 09.00 en 17.00 uur";
	app.model.times.POSTOFFICE = "Na 09.00 uur";

	app.model.person.FIRSTNAME = "Voornaam";
	app.model.person.SURNAME = "Achternaam";
	app.model.person.STREET = "Straat";
	app.model.person.NUMBER = "Huisnummer";
	app.model.person.CITY = "Plaats";
	app.model.person.EMAIL = "E-mail";
	app.model.person.PHONE = "Telefoon";
	app.model.person.FIRSTNAME = "Voornaam";
	app.model.person.FIRSTNAME = "Voornaam";


	var rooms = {};
	var agenda = {};
	var personalDetails = {};
	var screenId = 'roomSelectionScreen';

    app.model.init = function(){
		initRooms();
		initAgenda();
		initPersonalDetails();
	}	
	
	function initPersonalDetails(){
		var per = loadFromLocalStorage('person');
		if(per != null){
			personalDetails = per;
		} else {
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.FIRSTNAME] = null;
		}

	}
	function initAgenda(){
		var ag = loadFromLocalStorage('agenda');
		if(ag != null) {
			agenda = ag; 	

	    } else {
			agenda[app.model.days.MONDAY] = [];	
			agenda[app.model.days.TUESDAY] = [];	
			agenda[app.model.days.WEDNESDAY] = [];	
			agenda[app.model.days.THURSDAY] = [];	
			agenda[app.model.days.FRIDAY] = [];	
			agenda[app.model.days.SATURDAY] = [];	
			agenda[app.model.days.SUNDAY] = [];	
			persistInLocalStorage('agenda', agenda);
		}
	}

	app.model.getAgenda = function(){
		return agenda;
	}

	app.model.addDayTimeToAgenda = function(day, time){
		agenda[day].push(time);	
		persistInLocalStorage('agenda',agenda);
	}

	app.model.isDateTimeSelected = function(day,time){
		var d =	agenda[day];
		var c = 0;
		for(var i = 0; i < d.length; i++){
			var t = d[i];
			if(t == time){
				return true;
			}
		}
		return false;
	}

	app.model.clearDay = function(day){
		agenda[day] = [];
		persistInLocalStorage('agenda',agenda);
	}

	app.model.getPersonalDetails(){
		return personalDetails;
	}

	app.model.removeDayTimeFromAgenda = function(day,time){
		var d =	agenda[day];
		var c = 0;
		for(var i = 0; i < d.length; i++){
			var t = d[i];
			if(t == time){
				d.splice(i,1);		
			}
			
		}
		persistInLocalStorage('agenda',agenda);
	}

	function initRooms(){
		var rms = loadFromLocalStorage('rooms');
		if(rms != null){
			rooms = rms;
		} else {
			rooms[app.model.roomtypes.OFFICE]  = [];
			rooms[app.model.roomtypes.MEETING] = [];
			rooms[app.model.roomtypes.PANTRY]  = [];
			rooms[app.model.roomtypes.TOILET]  = [];
			rooms[app.model.roomtypes.HALLWAY] = [];
			rooms[app.model.roomtypes.STAIRS]  = [];
			persistInLocalStorage('rooms', rooms);
		}
	}
	app.model.getScreenId = function(){
		return screenId;
	}
	
	app.model.setScreenId = function(id){
		screenId = id;
	}

	/**
	 * Adds a room
	 * @param roomType: one of app.model.roomtypes
	 * @param m2: integer of square meters of the room
	 * @param floortype: one of app.model.floortypes
	 */
	app.model.addRoom = function(roomType, m2, floorType, numSpots) {
		rooms[roomType].push({
			"m2" : m2,
			"floorType" : floorType,
			"numSpots" : numSpots
		});	
		persistInLocalStorage('rooms',rooms);
	};	

	/**
	 * Returns all room objects stored so far
	 */
	app.model.getRooms = function(){
		return rooms;
	}	
	
	app.model.removeRoom = function(roomType, roomIndex){
		rooms[roomType].splice(roomIndex, 1);
		persistInLocalStorage('rooms', rooms);
	}
	/**
	 * Returns the room by a specified index
	 */
	app.model.getRoomByIndex = function(roomType,num){
		return rooms[roomType][num];
	}
	function supportsLocalStorage() {  
		if(localStorage){
			return true;
		} else {
			return false
		}
	}  
	function persistInLocalStorage(key, val){
		if(supportsLocalStorage()){
			var str = JSON.stringify(val);
			console.log("persisting: ",str);
			localStorage.setItem(key, str);
		}
	}

	function loadFromLocalStorage(key){
		if(supportsLocalStorage()){
			var ret = localStorage.getItem(key);
			console.log("loaded: ",ret);
			if(ret == null){ return null; }

			return JSON.parse(ret);
		} else {
			return null;
		}
	}

}( (window.app = window.app || {}), jQuery ));
