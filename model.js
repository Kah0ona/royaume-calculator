//model.js

(function( app, $, undefined ) {
    app.model = app.model || {};
	
	app.model.roomtypes = app.model.roomtypes || {};
	app.model.floortypes = app.model.floortypes || {};

	app.model.roomtypes.OFFICE = 'Kantoorruimte';
	app.model.roomtypes.MEETING = 'Vergaderruimte';
	app.model.roomtypes.PANTRY = 'Pantry / keuken';
	app.model.roomtypes.TOILET = 'Toilet';
	app.model.roomtypes.HALLWAY = 'Hal';
	app.model.roomtypes.STAIRS = 'Trap';

	app.model.floortypes.HARD = 'Hard';
	app.model.floortypes.SOFT = 'Zacht';

	var rooms = {};
	var screenId = 'roomSelectionScreen';

    app.model.init = function(){
		var rms = loadFromLocalStorage();
		if(rms != null){
			rooms = rms;
		} else {
			rooms[app.model.roomtypes.OFFICE]  = [];
			rooms[app.model.roomtypes.MEETING] = [];
			rooms[app.model.roomtypes.PANTRY]  = [];
			rooms[app.model.roomtypes.TOILET]  = [];
			rooms[app.model.roomtypes.HALLWAY] = [];
			rooms[app.model.roomtypes.STAIRS]  = [];
			persistInLocalStorage();
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
		persistInLocalStorage();
	};	

	/**
	 * Returns all room objects stored so far
	 */
	app.model.getRooms = function(){
		return rooms;
	}	
	
	app.model.removeRoom = function(roomType, roomIndex){
		rooms[roomType].splice(roomIndex, 1);
		persistInLocalStorage();
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
	function persistInLocalStorage(){
		if(supportsLocalStorage()){
			var str = JSON.stringify(rooms);
			console.log("persisting: ",str);
			localStorage.setItem("rooms", str);
		}
	}

	function loadFromLocalStorage(){
		if(supportsLocalStorage()){
			var ret = localStorage.getItem("rooms");
			console.log("loaded: ",ret);
			if(ret == null){ return null; }

			return JSON.parse(ret);
		} else {
			return null;
		}
	}

}( (window.app = window.app || {}), jQuery ));
