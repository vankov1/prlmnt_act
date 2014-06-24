var MPsView = function(template) {
	var self = this;

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
		this.el.html(template(tplData));
		return this;
	};

	this.getData = function(filter, callback) {
		var adapter = getAdapter(deputiesDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
				
		var mps = [];
		var idx = 0;
		
		var mpsList = data.getElementsByTagName('item');
		
		var tmp;
		var mpMatchesFilter = false;

		for (var i = 0; i < mpsList.length; i++) {

			if (filter == '') {
				mpMatchesFilter = true;
			} else if (filter[0] == 'areaId') {
				mpMatchesFilter = this.filterByArea(mpsList[i], filter[1]);
			}
			
			if (!mpMatchesFilter) {
				continue;
			}
			
			mps[idx] = {
				mpi: idx,
				mpId: mpsList[i].getElementsByTagName('item_ID')[0].textContent,
				mpFName: mpsList[i].getElementsByTagName('FirstName')[0].attributes.getNamedItem('value').value,
				mpSName: mpsList[i].getElementsByTagName('SirName')[0].attributes.getNamedItem('value').value,
				mpFamily: mpsList[i].getElementsByTagName('FamilyName')[0].attributes.getNamedItem('value').value,
				politForce: mpsList[i].getElementsByTagName('PoliticalForce')[0].attributes.getNamedItem('value').value,
				izbRajon: mpsList[i].getElementsByTagName('Constituency')[0].attributes.getNamedItem('value').value
				/*,
				title: newsList[pi].getElementsByTagName('title')[0].textContent,
				dscr: newsList[pi].getElementsByTagName('description')[0].textContent.replace('>>', '>'),
				img: newsList[pi].getElementsByTagName('image')[0].textContent,
				pubDate: isoToBgDate(newsList[pi].getElementsByTagName('pubDate')[0].textContent),
				link: newsList[pi].getElementsByTagName('item_link')[0].textContent*/
			};
			idx++;
		}
		
		tplData = {
			mps: mps
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.filterEmpty = function(mpRec, toMatch) {
		return true;
	};
	
	this.filterByArea = function(mpRec, toMatch) {
		var area = mpRec.getElementsByTagName('Constituency')[0].attributes.getNamedItem('value').value.split('-');
		if (toMatch == area[0]) {
			return true;
		} else {
			return false;
		}
	};
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);
		assignMPTabHandlers();

		$('#btnSearchBills').unbind().bind('click', function() {
			$('#searchBoxBills').slideToggle("slow");
		});
		
		if ($('#txtSearchBills')) { 
			$('#txtSearchbills').unbind().bind('keyup', function() {
				//console.log('box val: ' + $(this).val() );
				if ($(this).val().length < 3) {
					//Make all items visible
					//console.log('Make all items visible');
					$('.billsListItem').removeClass('hidden');
					return;
				}
				
				//Search items for entered text
				var needle = $.trim($(this).val());
				var items = self.searchItems(needle);
				if (!items || items.length == 0) {
					//console.log('no matches');
					return;
				}
				
				//Display results
				$('.billListItem').each(function() {
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
		var adapter = getAdapter(newsDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var billsList = data.getElementsByTagName('item');
		var itemIds = [];
		var haystack = '';
		for (var pi = 0; pi < newsList.length; pi++) {
			haystack = billList[pi].getElementsByTagName('billName')[0].textContent;
			if (haystack.indexOf(needle) !== -1) {
				//console.log(pi + ' - position ' + haystack.indexOf(needle));
				itemIds.push(pi);
			}
		}
		return itemIds;
	};
	
	
	this.updateInterface = function() {
		$('.liMainMenuItem').removeClass('active');
		$('#liMainMenuBills').addClass('active');
	};


    this.initialize();

};