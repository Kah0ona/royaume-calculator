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
	var screenId = 'init';

    app.model.init = function(){
		rooms[app.model.roomtypes.OFFICE]  = [];
		rooms[app.model.roomtypes.MEETING] = [];
		rooms[app.model.roomtypes.PANTRY]  = [];
		rooms[app.model.roomtypes.TOILET]  = [];
		rooms[app.model.roomtypes.HALLWAY] = [];
		rooms[app.model.roomtypes.STAIRS]  = [];
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
	 * @param flootype: one of app.model.floortypes
	 */
	app.model.addRoom = function(roomType, m2, floorType) {
		rooms[roomType].push({
			"m2" : m2,
			"floorType" : floorType
		});	
	};	

	/**
	 * Returns all room objects stored so far
	 */
	app.model.getRooms = function(){
		return rooms;
	}	

	/**
	 * Returns the room by a specified index
	 */
	app.model.getRoomByIndex = function(roomType,num){
		return rooms[roomType][num];
	}	

}( (window.app = window.app || {}), jQuery ));
