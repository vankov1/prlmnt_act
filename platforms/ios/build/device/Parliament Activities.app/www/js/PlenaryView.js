var PlenaryView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(callback) {
		var adapter = getAdapter(plenaryDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		//console.log('Stored Rss Data: ' + adapter.rssData);
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var plenariesList = data.getElementsByTagName('item');
		
		var plenary = [];
		for (var pi = 0; pi < plenariesList.length; pi++) {
			var agendaItems = [];
			var agendaItemsNodes = plenariesList[pi].getElementsByTagName('agenda_item');
			var shortDscr = '';
			for (var ai = 0; ai < agendaItemsNodes.length; ai++) {
				agendaItems[ai] = {
					id: ai + 1,
					itemText: agendaItemsNodes[ai].getElementsByTagName('item_text')[0] ? agendaItemsNodes[ai].getElementsByTagName('item_text')[0].textContent : '',
					isBill: agendaItemsNodes[ai].getElementsByTagName('is_bill')[0] ? agendaItemsNodes[ai].getElementsByTagName('is_bill')[0].textContent : 0,
					billLink: agendaItemsNodes[ai].getElementsByTagName('bill_link')[0] ? agendaItemsNodes[ai].getElementsByTagName('bill_link')[0].textContent : 'javascript:void(0)'
				};
				if (shortDscr.length < 255) {
					shortDscr += agendaItems[ai].itemText + "\n";
				}
			}
			if (shortDscr.length > 255) {
				shortDscr = shortDscr.substring(0, 255) + '...';
			}
			shortDscr = shortDscr.replace(/\r?\n/g, "<br />");
			
			plenary[pi] = {
				id: pi,
				type: plenariesList[pi].getElementsByTagName('type')[0] ? plenariesList[pi].getElementsByTagName('type')[0].textContent : 0,
				status: plenariesList[pi].getElementsByTagName('status')[0] ? plenariesList[pi].getElementsByTagName('status')[0].textContent : 0,
				startDate: plenariesList[pi].getElementsByTagName('start_date')[0] ? plenariesList[pi].getElementsByTagName('start_date')[0].textContent : 'n/a',
				endDate: plenariesList[pi].getElementsByTagName('end_date')[0] ? plenariesList[pi].getElementsByTagName('end_date')[0].textContent : 'n/a',
				startTime: plenariesList[pi].getElementsByTagName('start_time')[0] ? plenariesList[pi].getElementsByTagName('start_time')[0].textContent : 'n/a',
				link: plenariesList[pi].getElementsByTagName('item_link')[0] ? plenariesList[pi].getElementsByTagName('item_link')[0].textContent : 'javascript:void(0)',
				pubDate: plenariesList[pi].getElementsByTagName('pubDate')[0] ? plenariesList[pi].getElementsByTagName('pubDate')[0].textContent : 'n/a',
				agenda: agendaItems,
				dscrShort: shortDscr
			};
		}
		
		tplData = {
			plenary: plenary
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function() {
		$('#btnSearchPlenary').unbind().bind('click', function() {
			$('#searchBoxPlenary').slideToggle("slow");
		});
	};

    this.initialize();

};