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
			} else if (filter[0] == 'groupId') {
				mpMatchesFilter = this.filterByStructure(mpsList[i], filter[1], ParalmStructType_GROUPS);
			} else if (filter[0] == 'committeeId') {
				mpMatchesFilter = this.filterByStructure(mpsList[i], filter[1], ParalmStructType_COMMITTEES);
			} else if (filter[0] == 'mpId') {
				mpMatchesFilter = this.filterByMpId(mpsList[i], filter[1]);
			}
			
			if (!mpMatchesFilter) {
				continue;
			}
			
			/*if (idx == 3 || idx == 73) {
				console.log(
						mpsList[i].getElementsByTagName('FirstName')[0].attributes.getNamedItem('value').value + ' ' + 
						mpsList[i].getElementsByTagName('SirName')[0].attributes.getNamedItem('value').value + ' ' +
						mpsList[i].getElementsByTagName('FamilyName')[0].attributes.getNamedItem('value').value);
			}*/
			
			mps[idx] = {
				mpi: idx,
				mpId: mpsList[i].getElementsByTagName('item_ID')[0].textContent,
				mpFName: mpsList[i].getElementsByTagName('FirstName')[0].attributes.getNamedItem('value').value,
				mpSName: mpsList[i].getElementsByTagName('SirName')[0].attributes.getNamedItem('value').value,
				mpFamily: mpsList[i].getElementsByTagName('FamilyName')[0].attributes.getNamedItem('value').value,
				politForce: mpsList[i].getElementsByTagName('PoliticalForce')[0].attributes.getNamedItem('value').value,
				izbRajon: mpsList[i].getElementsByTagName('Constituency')[0].attributes.getNamedItem('value').value
			};
			
			if (filter[0] == 'mpId') {
				mps[idx] = this.getDetailMPInfo(mps[idx], mpsList[i]);
				break;
			}
			
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
	
	this.filterByStructure = function(mpRec, toMatch, structType) {
		//console.log(toMatch);
		var structures = mpRec.getElementsByTagName('ParliamentaryStructure');
		var type, endDate, groupId;
		for (var i = 0; i < structures.length; i++) {
			type = structures[i].getElementsByTagName('ParliamentaryStructureTypeID')[0].attributes.getNamedItem('value').value;
			if (type != structType) {
				continue;
			}
			
			endDate = structures[i].getElementsByTagName('ParliamentaryStructurePeriod')[0].getElementsByTagName('To')[0].attributes.getNamedItem('value').value;
			if (endDate.trim() != '') {
				continue;
			}
			
			groupId = structures[i].getElementsByTagName('ParliamentaryStructureID')[0].attributes.getNamedItem('value').value;
			if (groupId == toMatch) {
				return true;
			} else {
				continue;
			}
		}
		return false;
	};
	
	
	this.filterByMpId = function(mpRec, toMatch) {
		var mpId = mpRec.getElementsByTagName('item_ID')[0].textContent;
		if (mpId == toMatch) {
			return true;
		}
		return false;
	};
	
	this.getDetailMPInfo = function(mpShortInfo, mpNode) {
		var tmp = [];
		
		//General info
		mpShortInfo.dateOfBirth = mpNode.getElementsByTagName('DateOfBirth')[0].attributes.getNamedItem('value').value;
		mpShortInfo.placeOfBirth = mpNode.getElementsByTagName('PlaceOfBirth')[0].attributes.getNamedItem('value').value;
		mpShortInfo.email = mpNode.getElementsByTagName('E-mail')[0].attributes.getNamedItem('value').value;
		mpShortInfo.politicalForce = mpNode.getElementsByTagName('PoliticalForce')[0].attributes.getNamedItem('value').value;
		mpShortInfo.izbRajon = mpNode.getElementsByTagName('Constituency')[0].attributes.getNamedItem('value').value;
		mpShortInfo.langs = '';
		if (mpNode.getElementsByTagName('Language').length > 1) {
			tmp = [];
			for (var i = 1; i < mpNode.getElementsByTagName('Language').length; i++) {
				tmp.push(mpNode.getElementsByTagName('Language')[i].attributes.getNamedItem('value').value);
			}
			mpShortInfo.langs = tmp.join(', ');
		}
		mpShortInfo.profession = '';
		if (mpNode.getElementsByTagName('Profession').length > 1) {
			tmp = [];
			for (var i = 1; i < mpNode.getElementsByTagName('Profession').length; i++) {
				tmp.push(mpNode.getElementsByTagName('Profession')[i].attributes.getNamedItem('value').value);
			}
			mpShortInfo.profession = tmp.join(', ');
		}
		mpShortInfo.maritalStatus = mpNode.getElementsByTagName('MaritalStatus')[0].attributes.getNamedItem('value').value;
		
		//ParliamentaryActivity
		mpShortInfo.structs = [];
		var activity = mpNode.getElementsByTagName('ParliamentaryActivity')[0];
		if (activity) {
			var structs = activity.getElementsByTagName('ParliamentaryStructure');
			for (var i = 0; i < structs.length; i++) {
				mpShortInfo.structs.push({
					name: structs[i].getElementsByTagName('ParliamentaryStructureName')[0].attributes.getNamedItem('value').value,
					position: structs[i].getElementsByTagName('ParliamentaryStructurePosition')[0].attributes.getNamedItem('value').value,
					sdate: structs[i].getElementsByTagName('From')[0].attributes.getNamedItem('value').value,
					edate: (structs[i].getElementsByTagName('To')[0].attributes.getNamedItem('value').value.trim() == '') ? 'до момента' : structs[i].getElementsByTagName('To')[0].attributes.getNamedItem('value').value.trim()
				});
			}
		}
		
		//Bills
		mpShortInfo.bills = [];
		var billsNode = mpNode.getElementsByTagName('Bills')[0];
		if (billsNode) {
			var bills = billsNode.getElementsByTagName('Bill');
			for (var i = 0; i < bills.length; i++) {
				mpShortInfo.bills.push({
					billName: bills[i].getElementsByTagName('Name')[0].attributes.getNamedItem('value').value,
					link: bills[i].getElementsByTagName('ProfileURL')[0].attributes.getNamedItem('value').value
				});
			}
		}
		
		return mpShortInfo;
	};
	
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);
		assignMPTabHandlers();

		$('#btnSearchMPs').unbind().bind('click', function() {
			$('#searchBoxMPs').slideToggle(searchOpenDuration, function() {
				if ($('#scrollingContent').hasClass('search-opened')) {
					$('#scrollingContent').removeClass('search-opened');
				} else {
					$('#scrollingContent').addClass('search-opened');
				}
			});
		});
		
		if ($('#txtSearchMPs')) { 
			$('#txtSearchMPs').unbind().bind('keyup', function() {
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
				$('.mpsListItem').each(function() {
					//console.log($(this).data("listItemId") + ' -> ' + items.indexOf($(this).data("listItemId")) );
					
					if (myInArray($(this).data("listItemId"), items) == -1) {
						$(this).addClass('hidden');
					} else {
						$(this).removeClass('hidden');
					}
				});
			});
		};

	};
	
	this.searchItems = function(needle) {
		needle = needle.toLowerCase();
		var adapter = getAdapter(deputiesDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var mpsList = data.getElementsByTagName('item');
		var itemIds = [];
		var haystack = '';
		for (var i = 0; i < mpsList.length; i++) {
			haystack = mpsList[i].getElementsByTagName('FirstName')[0].attributes.getNamedItem('value').value;
			haystack += ' ' + mpsList[i].getElementsByTagName('SirName')[0].attributes.getNamedItem('value').value;
			haystack += ' ' + mpsList[i].getElementsByTagName('FamilyName')[0].attributes.getNamedItem('value').value;
			
			//console.log('haystack: ' + haystack);
						
			if (haystack.toLowerCase().indexOf(needle) !== -1) {
				itemIds.push(mpsList[i].getElementsByTagName('item_ID')[0].textContent);
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