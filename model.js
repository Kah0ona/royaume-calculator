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
	app.model.times.POSTOFFICE = "Na 17.00 uur";

	app.model.person.FIRSTNAME = "Voornaam";
	app.model.person.SURNAME = "Achternaam";
	app.model.person.STREET = "Straat";
	app.model.person.NUMBER = "Huisnummer";
	app.model.person.CITY = "Plaats";
	app.model.person.EMAIL = "E-mail";
	app.model.person.PHONE = "Telefoon";
	app.model.person.GENDER = "Geslacht";
	app.model.person.COMPANY = "Bedrijfsnaam";
	app.model.person.KVK = "KvK-nummer";


	app.model.person.genders = app.model.person.genders || {};
	app.model.person.genders.MALE = "De heer";
	app.model.person.genders.FEMALE = "mevrouw";

	
	var rooms = {};
	var agenda = {};
	var personalDetails = {};
	var screenId = 'roomSelectionScreen';
	var submitUrl;
	var NUM_MINUTES_PER_WORKSPACE = 4;
	var HOURLY_RATE = 20;
    app.model.init = function(options){
		submitUrl = options.submitUrl || '/wp-content/plugins/royaume/submit.php';
		initRooms();
		initAgenda();
		initPersonalDetails();
	}	
	
	function initPersonalDetails(){
		var per = loadFromLocalStorage('person');
		if(per != null){
			personalDetails = per;
		} else {
			personalDetails[app.model.person.GENDER] = app.model.person.genders.FEMALE;
			personalDetails[app.model.person.FIRSTNAME] = null;
			personalDetails[app.model.person.SURNAME] = null;
			personalDetails[app.model.person.STREET] = null;
			personalDetails[app.model.person.NUMBER] = null;
			personalDetails[app.model.person.CITY] = null;
			personalDetails[app.model.person.EMAIL] = null;
			personalDetails[app.model.person.PHONE] = null;
			personalDetails[app.model.person.COMPANY] = null;
			personalDetails[app.model.person.KVK] = null;
			persistInLocalStorage('person',personalDetails);
		}
	}

	app.model.submitDetails = function(callback){
		var data = {};
		data.rooms = app.model.getRooms();
		data.price = app.model.calculateTotalPrice();
		data.agenda = app.model.getAgenda();
		data.personal = app.model.getPersonalDetails();
		var html = app.view.getOverviewHTML(data);
		var dt = {
		   "html" : html,
		   "personal" : data.personal,
		   "agenda" : data.agenda,
		   "price" : data.price,
		   "action" : 'processcalc'
		};
		$.ajax({
			type: "POST",
			url: submitUrl,
			data: dt,
			success: callback,
			dataType: 'json' 
		});
	}

	app.model.calculateTotalPrice = function(){
		var totalMinutes = 0;
		for(var roomType in rooms){
			totalMinutes += app.model.getNumMinutesByRoom(roomType, rooms[roomType]);	
		}
		var daypartsPerWeek = app.model.getNumDaypartsPerWeek();
		var weeksPerMonth = 4;
		var totalPrice = (totalMinutes / 60) * HOURLY_RATE * weeksPerMonth * daypartsPerWeek;
		totalPrice = Math.round(totalPrice);
		return { "total" : totalPrice };
	}

	app.model.getNumDaypartsPerWeek = function(){
		var ret = 0;
		for(var dayKey in agenda){
			ret += agenda[dayKey].length;
		}
		return ret;
	}
	/**
	 * returns the number of minutes of workload for this room
	 */
	app.model.getNumMinutesByRoom = function(roomType, rooms) {
		var ret = 0;
		switch(roomType) {
			case app.model.roomtypes.OFFICE: 
				ret += getNumMinutesForOffices(rooms);
			break;
			case app.model.roomtypes.MEETING: 
				ret += getNumMinutesForMeetingRooms(rooms);
			break;
			case app.model.roomtypes.PANTRY: 
				ret += getNumMinutesForPantries(rooms);
			break;
			case app.model.roomtypes.TOILET: 
				ret += getNumMinutesForToilets(rooms);
			break;
			case app.model.roomtypes.HALLWAY: 
				ret += getNumMinutesForHallways(rooms);
			break;
			case app.model.roomtypes.STAIRS: 
				ret += getNumMinutesForStairs(rooms);
			break;
		}
		return ret;
	}



	function getNumMinutesForOffices(offices){
		var ret = 0;
		for(var i = 0; i < offices.length; i++){
			var office = offices[i];
			var m2 = parseInt(office.m2);
			var numSpots = parseInt(office.numSpots); // 4 minutes per workspace
			var floorFactor = (office.floorType == app.model.floortypes.HARD) ? 1.2 : 1;
			var officeMins = 0;
			if(m2 > 0 && m2 <= 10){
				officeMins = 6;
			}
			if(m2 > 10 && m2 <= 20){
				officeMins = 11;
			}
			if(m2 > 20 && m2 <= 30){
				officeMins = 16;
			}
			if(m2 > 30 && m2 <= 40){
				officeMins = 19;
			}
			if(m2 > 40 && m2 <= 50){
				officeMins = 21;
			}
			if(m2 > 50 && m2 <= 60){
				officeMins = 22;
			}

			var total = (officeMins + (NUM_MINUTES_PER_WORKSPACE * numSpots)) * floorFactor;
			ret += total;
		}
		return ret;
	}

	function getNumMinutesForMeetingRooms(meetingRooms){
		var ret = 0;
		for(var i = 0; i < meetingRooms.length; i++){
			var meetingRoom = meetingRooms[i];
			var m2 = parseInt(meetingRoom.m2);
			var floorFactor = (meetingRoom.floorType == app.model.floortypes.HARD) ? 1.2 : 1;
			var meetingRoomMins = 0;
			if(m2 > 0 && m2 <= 10){
				meetingRoomMins = 9;
			}
			else if(m2 > 10 && m2 <= 20){
				meetingRoomMins = 15;
			}
			else if(m2 > 20 && m2 <= 30){
				meetingRoomMins = 20;
			}
			var total = meetingRoomMins * floorFactor;
			ret += total;
		}
		return ret;
	}

	function getNumMinutesForPantries(pantries){
		var ret = 0;
		for(var i = 0; i < pantries.length; i++){
			var pantrie = pantries[i];
			var m2 = parseInt(pantrie.m2);
			var floorFactor = (pantrie.floorType == app.model.floortypes.HARD) ? 1.2 : 1;
			var pantrieMins = m2 / 5;
			if(m2 > 0 && m2 <= 3){
				pantrieMins = 7;
			}
			else if(m2 > 3 && m2 <= 6){
				pantrieMins = 15;
			}
			else if(m2 > 6 && m2 <= 9){
				pantrieMins = 20;
			}
			else if(m2 > 9 && m2 <= 14){
				pantrieMins = 25;
			}
			else if(m2 > 14 && m2 <= 20){
				pantrieMins = 30;
			}
			var total = pantrieMins * floorFactor;
			ret += total;
		}
		return ret;
	}
	function getNumMinutesForToilets(toilets){
		var ret = 0;
		for(var i = 0; i < toilets.length; i++){
			var toilet = toilets[i];
			var m2 = parseInt(toilet.m2);
			var floorFactor = (toilet.floorType == app.model.floortypes.HARD) ? 1.2 : 1;
			var toiletMins = m2 / 5;
			if(m2 > 0 && m2 <= 2){
				toiletMins = 4;
			}
			else if(m2 > 2 && m2 <= 4){
				toiletMins = 5;
			}
			var total = toiletMins * floorFactor;
			ret += total;
		}
		return ret;
	}
	function getNumMinutesForHallways(halls){
		var ret = 0;
		for(var i = 0; i < halls.length; i++){
			var hall = halls[i];
			var m2 = parseInt(hall.m2);
			var floorFactor = (hall.floorType == app.model.floortypes.HARD) ? 1.2 : 1;
			var hallMins = 0;
			if(m2 > 0 && m2 <= 5){
				hallMins = 4;
			}
			else if(m2 > 5 && m2 <= 10){
				hallMins = 6;
			}
			else if(m2 > 10 && m2 <= 15){
				hallMins = 8;
			}
			else if(m2 > 15 && m2 <= 20){
				hallMins = 10;
			}
			var total = hallMins * floorFactor;
			ret += total;
		}
		return ret;
	}

	function getNumMinutesForStairs(stairs){
		var ret = 0;
		for(var i = 0; i < stairs.length; i++){
			var stair = stairs[i];
			var floorFactor = (stair.floorType == app.model.floortypes.HARD) ? 1.2 : 1;

			ret += stair.numSpots * 5 * floorFactor;
		}
		return ret;
	}

	app.model.getPersonalDetails = function(){
		return personalDetails;
	}

	app.model.setPersonalDetail = function(key,val){
		personalDetails[key] = val;
		persistInLocalStorage('person',personalDetails);
	}

	app.model.getPersonalDetail = function(key){
		return personalDetails[key];
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

	app.model.getPersonalDetails = function(){
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
