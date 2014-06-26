var ParlamStructsView = function(template) {

    this.initialize = function() {
        this.el = $('<span></span>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(structType, callback) {
		var adapter = getAdapter(structsDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		//console.log('Stored Rss Data: ' + adapter.rssData);
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var structList = data.getElementsByTagName('collection');
		
		var type;
		var idx = 0;
		var structId = 0;
		
		var mpParser = new DOMParser();
		var mpsAdapter = getAdapter(deputiesDataFile);
		var mpsStructs = mpParser.parseFromString(mpsAdapter.rssData, "text/xml").getElementsByTagName('ParliamentaryActivity');
		//console.log('брой депутати: ' + mpsStructs.length);
		
		//We iterate mp's records to count mps in desired type
		/*var structIds = [];
		var structMembers = [];
		var structNodes;
		var endDate;
		for (var i = 0; i < mpsStructs.length; i++) {
			structNodes = mpsStructs[i].getElementsByTagName('ParliamentaryStructure');
			structId = 0;
			for (var j = 0; j< structNodes.length; j++) {
				type = structNodes[j].getElementsByTagName('ParliamentaryStructureTypeID')[0].attributes.getNamedItem('value').value;
				endDate = structNodes[j].getElementsByTagName('To')[0].attributes.getNamedItem('value').value;
				if (type != structType || endDate != '') {
					continue;
				}
				structId = structNodes[j].getElementsByTagName('ParliamentaryStructureID')[0].attributes.getNamedItem('value').value;
				idx = structIds.indexOf(structId);
				if (idx == -1) {
					idx = structIds.length;
					structIds[idx] = structId;
					structMembers[idx] = 0;
				}
				structMembers[idx]++;
			}
		}*/
		
		//get structures
		var structs = [];
		//var pos = 0, cnt = 0;
		idx = 0;
		for (var pi = 0; pi < structList.length; pi++) {
			
			type = structList[pi].getElementsByTagName('typeID')[0] ? structList[pi].getElementsByTagName('typeID')[0].textContent : 0;
			if (type != structType) {
				continue;
			}
			
			structId = structList[pi].getElementsByTagName('collection_id')[0] ? structList[pi].getElementsByTagName('collection_id')[0].textContent : 0;
			//get member's count
			/*pos = structIds.indexOf(structId);
			if (pos == -1) {
				cnt = 0;
			} else {
				cnt = structMembers[pos];
			}*/
			
			structs[idx] = {
				gid: idx,
				structType: type,
				structId: structId,
				structName: structList[pi].getElementsByTagName('collection_name')[0] ? structList[pi].getElementsByTagName('collection_name')[0].textContent : '',
				structTypeName: structList[pi].getElementsByTagName('type')[0] ? structList[pi].getElementsByTagName('type')[0].textContent : '',
				structMembers: structList[pi].getElementsByTagName('members')[0] ? structList[pi].getElementsByTagName('members')[0].textContent : 0
			};
			idx++;
		}
		
		tplData = {
			structs: structs
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
		$('#liMainMenuPlenaries').addClass('active');
	};

	
    this.initialize();

};