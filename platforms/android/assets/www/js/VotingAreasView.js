var VotingAreasView = function(template) {

    this.initialize = function() {
        this.el = $('<span></span>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(callback) {
		var adapter = getAdapter(votingAreasDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		//console.log('Stored Rss Data: ' + adapter.rssData);
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var areasList = data.getElementsByTagName('item');
		
		var areas = [];
		var idx = 0;
		for (var pi = 0; pi < areasList.length; pi++) {
			
			areas[idx] = {
				aid: idx,
				areaId: areasList[pi].getElementsByTagName('ID')[0] ? areasList[pi].getElementsByTagName('ID')[0].textContent : 0,
				areaName: areasList[pi].getElementsByTagName('Name')[0] ? areasList[pi].getElementsByTagName('Name')[0].textContent : 0
						
				/*type: plenariesList[pi].getElementsByTagName('type')[0] ? plenariesList[pi].getElementsByTagName('type')[0].textContent : 0,
				status: status,
				startDate: isoToBgDate(plenariesList[pi].getElementsByTagName('start_date')[0] ? plenariesList[pi].getElementsByTagName('start_date')[0].textContent : 'n/a'),
				endDate: isoToBgDate(plenariesList[pi].getElementsByTagName('end_date')[0] ? plenariesList[pi].getElementsByTagName('end_date')[0].textContent : 'n/a'),
				startTime: plenariesList[pi].getElementsByTagName('start_time')[0] ? plenariesList[pi].getElementsByTagName('start_time')[0].textContent : 'n/a',
				link: plenariesList[pi].getElementsByTagName('item_link')[0] ? plenariesList[pi].getElementsByTagName('item_link')[0].textContent : 'javascript:void(0)',
				pubDate: isoToBgDate(plenariesList[pi].getElementsByTagName('pubDate')[0] ? plenariesList[pi].getElementsByTagName('pubDate')[0].textContent : 'n/a'),
				agenda: agendaItems,
				dscrShort: shortDscr*/
			};
			idx++;
		}
		
		tplData = {
			areas: areas
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);
		assignMPTabHandlers();
		
		/*
		$('#btnSearchPlenary').unbind().bind('click', function() {
			$('#searchBoxPlenary').slideToggle(searchOpenDuration, function() {
				if ($('#scrollingContent').hasClass('search-opened')) {
					$('#scrollingContent').removeClass('search-opened');
				} else {
					$('#scrollingContent').addClass('search-opened');
				}
			});
		});
		
		if ($('#txtSearchPlenary')) { 
			$('#txtSearchPlenary').unbind().bind('keyup', function() {
				//console.log('box val: ' + $(this).val() );
				if ($(this).val().length < 3) {
					//Make all items visible
					$('.plenariesListItem').removeClass('hidden');
					return;
				}
				
				//Search items for entered text
				var needle = $.trim($(this).val());
				var items = self.searchItems(needle);
				if (!items || items.length == 0) {
					return;
				}
				
				//Display results
				$('.plenariesListItem').each(function() {
					//console.log($(this).data("listItemId"));
					if ($.inArray($(this).data("listItemId"), items) !== -1) {
						$(this).removeClass('hidden');
					} else {
						$(this).addClass('hidden');
					}
				});
			});
		};
		*/
	};
	
	this.searchItems = function(needle) {
		var adapter = getAdapter(plenaryDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var plenariesList = data.getElementsByTagName('item');
		var itemIds = [];
		var agendaItemsNodes = [];
		var haystack = '';
		for (var pi = 0; pi < plenariesList.length; pi++) {
			agendaItemsNodes = plenariesList[pi].getElementsByTagName('agenda_item');
			for (var ai = 0; ai < agendaItemsNodes.length; ai++) {
				haystack = agendaItemsNodes[ai].getElementsByTagName('item_text')[0].textContent;
				if (haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
					//console.log(pi + ' - position ' + haystack.indexOf(needle));
					itemIds.push(pi);
					break;
				}
			}
		}
		return itemIds;
	};
	
	
	this.updateInterface = function() {
		$('.liMainMenuItem').removeClass('active');
		$('#liMainMenuMPs').addClass('active');
		$('#page-placeholder').scrollTop(0);
	};

	
    this.initialize();

};