var CommitteeView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(callback) {
		var adapter = getAdapter(committeeDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		var commList = data.getElementsByTagName('item');
		var agendaTxt = '';
		var test = '';
		var shortDscr = '';
		
		var committee = [];
		var commId = -1;
		var subscribedComms = settings.get('subscribedCommittees');
		
		var index = 0;
		for (var pi = 0; pi < commList.length; pi++) {
			commId = commList[pi].getElementsByTagName('commitee_id')[0].textContent;
			if (subscribedComms && inArray(commId, subscribedComms) < 0) {
				continue;
			}
			
			agendaTxt = commList[pi].getElementsByTagName('agenda')[0].textContent;
			
			test = commList[pi].getElementsByTagName('agenda')[0].textContent.split('<br/>');
			
			shortDscr = agendaTxt.substring(0, 255);
			if (agendaTxt.length > 255) {
				shortDscr += '...';
			}
			
			committee[index] = {
				cid: index,
				committeeId: commId,
				committeeName: commList[pi].getElementsByTagName('committee')[0].textContent.replace(/\r?\n/g, ""),
				date: isoToBgDate(commList[pi].getElementsByTagName('date')[0].textContent),
				time: commList[pi].getElementsByTagName('time')[0].textContent,
				hall: commList[pi].getElementsByTagName('hall')[0].textContent,
				building: commList[pi].getElementsByTagName('building')[0].textContent,
				agenda: agendaTxt,
				pubDate: isoToBgDate(commList[pi].getElementsByTagName('pubDate')[0].textContent),
				link: commList[pi].getElementsByTagName('item_link')[0].textContent,
				dscrShort: shortDscr
			};
			index++;
		}
		
		tplData = {
			committee: committee
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);

		$('#btnSearchCommittee').unbind().bind('click', function() {
			$('#searchBoxCommittee').slideToggle(searchOpenDuration, function() {
				if ($('#scrollingContent').hasClass('search-opened')) {
					$('#scrollingContent').removeClass('search-opened');
				} else {
					$('#scrollingContent').addClass('search-opened');
				}
			});
		});
		
		$('#committeesListButton').unbind().bind('click', function() {
			openAppUrl(committeesListUrl);
		});
		
		if ($('#txtSearchCommittee')) { 
			$('#txtSearchCommittee').unbind().bind('keyup', function() {
				//console.log('box val: ' + $(this).val() );
				if ($(this).val().length < 3) {
					//Make all items visible
					//console.log('Make all items visible');
					$('.committeeListItem').removeClass('hidden');
					return;
				}
				
				//Search items for entered text
				var needle = $.trim($(this).val());
				var items = self.searchItems(needle);
				if (!items || items.length == 0) {
					console.log('no matches');
					return;
				}
				
				//Display results
				$('.committeeListItem').each(function() {
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
		var adapter = getAdapter(committeeDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var commList = data.getElementsByTagName('item');
		var itemIds = [];
		var haystack = '';
		for (var pi = 0; pi < commList.length; pi++) {
			haystack = commList[pi].getElementsByTagName('agenda')[0].textContent + ' ' + commList[pi].getElementsByTagName('committee')[0].textContent;
			if (haystack.indexOf(needle) !== -1) {
				//console.log(pi + ' - position ' + haystack.indexOf(needle));
				itemIds.push(pi);
			}
		}
		return itemIds;
	};
	
	this.updateInterface = function() {
		$('.liMainMenuItem').removeClass('active');
		$('#liMainMenuCommittee').addClass('active');
	};


    this.initialize();

};