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
	app.view.renderPricecalcScreen = function(data){
		var elt = $('#pricecalc_screen');

		elt.empty();

		var html ="";



		html += getNextPrevButton('to-agenda', 'to-personaldetails');
		elt.html(html);

		showScreen('pricecalc');
	}
	app.view.renderRoomSelectionScreen = function(data){
		var elt = $('#roomselection_screen');
		elt.empty();
		//manipulate DOM...

		var html = "<table class='calcform table' >";
	    html += getTableSelectionHTML(data.rooms);
		html += getTableHeaderHTML(true, "Aantal werkplekken");
		html += getNewFormHTML(data.rooms);
		html += getValidationErrorHTML();
		html += "</table>";
		html += getNextPrevButton(null, 'to-agenda');
		elt.html(html);
		showScreen('roomselection');
	}

	function getNextPrevButton(prevId, nextId){
		var ret = "<div class='nextprev'>";
		if(prevId != null){
			ret +=   "<a id='"+prevId+"'>Vorige</a>";
		}
		if(nextId != null){
			ret +=   "<a id='"+nextId+"'>Volgende</a>";
		}
		ret +=    "</div>";
		return ret;
	}
	app.view.renderPersonalDetailsScreen = function(person){
		var elt = $('#personaldetails_screen');
		elt.empty();
		var html="<form class='personaldetails'>";
		html += getRadioRow(app.model.person.GENDER, app.model.person.genders);
		html += getFormRow(app.model.person.FIRSTNAME);
		html += getFormRow(app.model.person.SURNAME);
		html += getFormRow(app.model.person.STREET);
		html += getFormRow(app.model.person.NUMBER);
		html += getFormRow(app.model.person.CITY);
		html += getFormRow(app.model.person.EMAIL);
		html += getFormRow(app.model.person.PHONE);
//		html += getFormRow(app.model.person.);
		html += getFormRow(app.model.person.COMPANY);
		html += getFormRow(app.model.person.KVK);

		html += "</form>";

		html += getNextPrevButton('to-pricecalc','to-submit');

		elt.html(html);
		populateForm(person);

		showScreen('personaldetails');

	}

	function populateForm(person){
		for(var field in person){
			if(person[field] != null){
				$('input.personal-input[type="text"][name="'+field+'"]').val(person[field]);
				
			}
		}

	}

	function getFormRow(key){
		var ret = "<label class='personal-label' for='"+key+"'>"+key+":</label>"+
		          "<input class='personal-input' type='text' name='"+key+"'  /><br/>";
		return ret;

	}

	function getRadioRow(field, vals){
		var html = "";
		for(var val in vals){
			html += "<input type='radio' name='"+field+"' class='personal-input' value='"+vals[val]+"' > "+
						vals[val]+'&nbsp;&nbsp;';
		}
		return html+'<br/>';
	}

	app.view.renderAgendaScreen = function(agenda){
		var elt = $('#agenda_screen');
		elt.empty();
		var html = "";

		html += "<table class='agenda' >";
	    for(var day in agenda){
			html += "<tr>";
			html += "<td>"+day+"</td>";
			var selected = "";
			if(app.model.isDateTimeSelected(day,app.model.times.PREOFFICE)){
				selected = " selected";
			}
			html += "<td class='datetime "+selected+"' data-day='"+day+"' data-time='"+app.model.times.PREOFFICE+"'>"+
						app.model.times.PREOFFICE+"</td>";
		
			selected = "";
			if(app.model.isDateTimeSelected(day,app.model.times.OFFICE)){
				selected = " selected";
			}
			html += "<td class='datetime "+selected+"' data-day='"+day+"' data-time='"+app.model.times.OFFICE+"'>"+
						app.model.times.OFFICE+"</td>";

			selected = "";
			if(app.model.isDateTimeSelected(day,app.model.times.POSTOFFICE)){
				selected = " selected";
			}
			html += "<td class='datetime "+selected+"' data-day='"+day+"' data-time='"+app.model.times.POSTOFFICE+"'>"+
						app.model.times.POSTOFFICE+"</td>";
			html += "</tr>";
		}	

		html += "</table>";

		html += getNextPrevButton('to-selectionscreen', 'to-pricecalc');
		elt.html(html);
		showScreen('agenda');
	}

	function getTableHeaderHTML(classs, num){
		var x = classs == null ? "" : "class='numspots'";
		return "<tr class='header-row'><th>Type ruimte</th>"+
			   "    <th>m<sup>2</sup></th>"+
			   "    <th "+x+">"+num+"</th>"+
			   "    <th>Vloer</th></tr>";

	}

	function getValidationErrorHTML(){
		var html =  "<tr class='room-error' style='display:none;'>";
		html +=       "<td colspan='5' class='error'></td>";
		html +=     "</tr>";
		return html;
	}
	
	function getNewFormHTML(rooms){
		var html = "";
		html+= "<tr>";
		html+= "<td><select name='roomtype'>";

		for(var roomtype in rooms){
			html+= "<option value='"+roomtype+"'>"+roomtype+"</option>";
		}
		html+= "</select></td>";
		
		html += "<td><input type='text' name='m2'></td>";
		html += "<td><input type='text' name='numSpots'></td>";
		html += "<td><select name='floortype'>";
		html += '<option value="'+app.model.floortypes.HARD+'">';
		html +=		app.model.floortypes.HARD;
		html += "</option>";

		html += '<option value="'+app.model.floortypes.SOFT+'">';
		html +=		app.model.floortypes.SOFT;
		html += "</option>";
		html += "</select></td>";

		html += "<td><a href='#' id='add-room'>+</a></td>";
		html+="</tr>";	

		return html;
	}

	function getTableSelectionHTML(rooms){
		var html = "";
		for(var roomtype in rooms){
			var rs = rooms[roomtype];
			if(rs.length > 0){
				html += "<tr><th colspan='5' class='group-row'>"
								+roomtype+
							"</th></tr>";
				var str = '';
				if(roomtype == app.model.roomtypes.STAIRS){
					str = "Aantal"
				} else if(roomtype == app.model.roomtypes.OFFICE || roomtype==app.model.roomtypes.MEETING){
					str = "Aantal werkplekken";
				} 
				
				html += getTableHeaderHTML(null, str);
				for(var i = 0; i < rs.length; i++){
					var room = rs[i];
					html += "<tr><td>"+roomtype+" "+(i+1)+"</td>"+
								"<td>"+room.m2+" m<sup>2</sup></td>";

					if(room.numSpots != null){
						html+= "<td>"+room.numSpots+"</td>";
					} else {
						html += "<td>&nbsp;</td>";
					}

					html += "<td>"+room.floorType+"</td>";
					html += "<td><a href='#' class='remove-room'"+
								"data-room-id='"+i+"'"+
								"data-room-type='"+roomtype+"'>"+
								"&times;"+
								"</a>"+
								"</td>";
					html += "</tr>";

				}	
			}
		}
		return html;
	}

}( (window.app = window.app || {}), jQuery ));
