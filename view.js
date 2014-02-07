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
        if (previousScreen != screenId){ //only if screen id changed
            var divId = '#' + screenId + '_screen';
            //$('.appScreen').not(divId).hide();
            $('.appScreen').not(divId).hide();
			$(divId).show();

			/*	
			fadeOut(600, function(){
               app.view.loaded = false;
               $(divId).fadeIn(600, function(){
                    app.view.loaded = true;
               }); 
            });
			*/
        }
        previousScreen = screenId;
    }

	app.view.renderHourlySelectionScreen = function(data){
		var elt = $('#hourly_selection_screen');
		elt.empty();
		var html = "";
		html += "<table class='table hourly_selection'>";
		for(var day in data){
			html += "<tr>";
			html += "<td>"+day+"</td>";
			html += "<td>"+getDaySelectionElement(day, data[day])+"</td>";
			html += "</tr>";
		}
		html += "</table>";
		html += getNextPrevButton(null, 'to-hourlyagenda');
		elt.html(html);
		showScreen('hourly_selection');
	}

	function getDaySelectionElement(day, dayData){
		var html = "<select data-day='"+day+"' class='hourly-select'> ";
		for(var i = 0; i <= 6; i+=0.5){
			if(i == 0.5) { i = 1; }
			var sel = "";
			if(dayData.amount == i){
				sel = "selected";
			}
			html += "<option value='"+i+"' "+sel+">"+i+" uren</option>";
		}
		html += '</select>';
		return html;
	}	
	app.view.renderSubmitScreen = function(data){
		var elt = $('#submit_screen');
		elt.empty();
		var html = "";
	    html += app.view.getOverviewHTML(data);
		html += getSubmitButton();	
		html += getNextPrevButton('to-personaldetails',null);
		elt.html(html);

		showScreen('submit');
	}

	app.view.renderThankYouScreen = function(data){
		var elt = $('#thank_you_screen');
		elt.empty();
		var html = "";
		html += "Bedankt voor uw aanvraag. U ontvangt een e-mail ter bevestiging, en we nemen zo spoedig mogelijk contact met u op.";
		elt.html(html);

		showScreen('thank_you');
	}

	app.view.getOverviewHTML = function(data){
		var html = "";
		html += getProductOverview(data.rooms);
		html += "<hr />";
		html += getAgendaOverview(data.agenda); 
		html += "<hr />";
		html += getTotalPriceHTML(data.price);
		html += "<hr />";
		html += getPersonalDetailsOverview(data.personal);
		html += "<hr />";
		return html;
	}
	function getSubmitButton(){
		var html = "";
		html += "<input type='button' value='Versturen' id='submitdetails'/>";
		return html;

	}
	function getPersonalDetailsOverview(person){
		var html = "<h3>Persoonlijke gegevens</h3>";
		html += "<table class='personaldetailsoverview'>";
		for(var key in person){
			var val = "";
			if(person[key] != null){
				val = person[key]
			}
			html += "<tr><td class='personkey'>"+key+"</td><td class='personvalue'>"+val+"</td></tr>";
		}
		html += "</table>";
		return html;

	}

	function getAgendaOverview(agenda){
		var html = "<h3>Gekozen dagen</h3>";
		html += "<table class='agenda-overview'>";
	    for(var day in agenda){
			if(agenda[day].length > 0){
				for(var i = 0; i < agenda[day].length; i++){
					html += "<tr><td class='dateslot'>"+day
						 +"</td><td class='datetimeslot'>"+agenda[day][i]+"</td></tr>";
				}
			}
		}
		html += "</table>";
		return html;
	}


	function getProductOverview(rooms){
		var html = "<h3>Gekozen ruimtes</h3>";

		html += "<table class='productoverview table'>";
		html += "<tr><th>Type</th><th>Oppervlak</th><th>Vloer</th><th>Aantal<br/>(werkplekken)</th></tr>";
		for(var key in rooms){
			for(var i = 0; rooms[key]!=null && i < rooms[key].length; i++){
				var room = rooms[key][i];
			//	console.log(room);
				html += "<tr>";
				html += "<td>"+key+" "+(i+1)+"</td>";
				html += "<td style='text-align: right'>"+room.m2+" m<sup>2</sup></td>";
				if(room.floorType!=null){
					html += "<td style='text-align: right'>"+room.floorType+"</td>";
				} else {
					html += "<td>&nbsp;</td>";
				}
				if(room.numSpots != null){
					html += "<td style='text-align: right'>"+room.numSpots+"</td>";
				} else {
					html += "<td>&nbsp;</td>";
				}
				html += "</tr>";
			}
		}

		html += "</table>";
		return html;	
	}

	app.view.renderPricecalcScreen = function(total){
		var elt = $('#pricecalc_screen');

		elt.empty();

		var html ="";
		html += getTotalPriceHTML(total); 
		html += getNextPrevButton('to-agenda', 'to-personaldetails');
		elt.html(html);

		showScreen('pricecalc');
	}
	function getTotalPriceHTML(total){
		var html = "<h3>Uw prijs</h3>";
		html += "<div class='price-total-container'><div class='price-total'>"+
			formatPrice(total)+"</div><br/><span class='per-four-weeks'>Per 4 weken, exclusief BTW</span></div>";
		return html;
	}

	function formatPrice(price){
		Number.prototype.formatMoney = function(c, d, t){
		var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : 
				d, t = t == undefined ? "." : 
				t, s = n < 0 ? "-" : 
				"", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
				j = (j = i.length) > 3 ? j % 3 : 0;
				
		   return s + (j ? i.substr(0, j) + t : "") 
					+ i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t)
					+ (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		};
	
		return price.formatMoney(2,',','.');

	}
	app.view.renderRoomSelectionScreen = function(data){
		var elt = $('#roomselection_screen');
		elt.empty();
		//manipulate DOM...

		var html = "<h3>Specificeer uw kantoor</h3>";
		html += "<p>Voeg hieronder ruimtes toe, en klik daarna op 'Volgende'. U kunt zoveel ruimtes toevoegen als u wilt.</p>";   
		html += "<table class='calcform table' >";
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
			ret +=   "<a class='prev' id='"+prevId+"'>Vorige</a>";
		}
		if(nextId != null){
			ret +=   "<a class='next' id='"+nextId+"'>Volgende</a>";
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
		html += getFormRow(app.model.person.ZIPCODE);
		html += getFormRow(app.model.person.CITY);
		html += getFormRow(app.model.person.EMAIL);
		html += getFormRow(app.model.person.PHONE);
		html += getFormRow(app.model.person.COMPANY);
		html += getFormRow(app.model.person.KVK);

		html += "</form>";
		html += "<div class='alert personal-validation-error' style='display: none;'>Alle velden dienen te worden ingevuld.</div>";
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

	function getAgendaHTML(agenda) {
		var html = "<table class='agenda' >";
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

		return html;
	}

	app.view.renderHourlyAgendaScreen = function(agenda){
		var elt = $('#agenda_screen');
		elt.empty();
		var html = "";

		html += getAgendaHTML(agenda);
		html += getNextPrevButton('to-hourlyselectionscreen', 'to-pricecalc');

		elt.html(html);
		showScreen('agenda');
	}

	app.view.renderAgendaScreen = function(agenda){
		var elt = $('#agenda_screen');
		elt.empty();
		var html = "";

		html += getAgendaHTML(agenda);
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

		html += "<td><a href='#' id='add-room'><i class='icon-plus'></i></a></td>";
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
					html += "<tr><td>"+roomtype+" "+(i+1)+"</td>";
					if(roomtype == app.model.roomtypes.STAIRS){
						html += "<td>&nbsp;</td>";
					} else {
						html += "<td>"+room.m2+" m<sup>2</sup></td>";
					}

					if(room.numSpots != null){
						html+= "<td>"+room.numSpots+"</td>";
					} else {
						html += "<td>&nbsp;</td>";
					}

					html += "<td>"+room.floorType+"</td>";
					html += "<td><a href='#' class='remove-room'"+
								"data-room-id='"+i+"'"+
								"data-room-type='"+roomtype+"'>"+
								"<i class='icon-minus'></i>"+
								"</a>"+
								"</td>";
					html += "</tr>";

				}	
			}
		}
		return html;
	}

}( (window.app = window.app || {}), jQuery ));
