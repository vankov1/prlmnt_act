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
		
		var committee = [];
		for (var pi = 0; pi < commList.length; pi++) {
			var agendaTxt = commList[pi].getElementsByTagName('agenda')[0].textContent;
			/*var agendaTxt = commList[pi].getElementsByTagName('agenda')[0].textContent.replace(/\r?\n/g, "").replace("<br />", "<br>").replace("<br/>", "<br>");
			var items = agendaTxt.split('<br>');*/
			
			var test = commList[pi].getElementsByTagName('agenda')[0].textContent.split('<br/>');
			
			/*if (pi == 0) {
				console.log('aaaaaaaaaa <br />' + test.length);
				console.log("\n" + commList[pi].getElementsByTagName('agenda')[0].textContent);
				console.log("\n" + agendaTxt);
			}*/
			//var agenda = [];
			var shortDscr = agendaTxt.substring(0, 255);
			if (agendaTxt.length > 255) {
				shortDscr += '...';
			}
			/*var shortDscr = '';
			for (var i = 0; i < items.length; i++) {
				if (items[i].trim() != '') {
					agenda.push({
						id: agenda.length + 1,
						itemText: items[i].trim()
					});
				}
				if (shortDscr.length < 255) {
					shortDscr += items[i].trim() + "\n";
				}
			}
			if (shortDscr.length > 255) {
				shortDscr = shortDscr.substring(0, 255) + '...';
			}*/
			
			committee[pi] = {
				cid: pi,
				committeeId: commList[pi].getElementsByTagName('commitee_id')[0].textContent,
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
		}
		
		tplData = {
			committee: committee
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function() {
		var self = this;
		$('#btnSearchCommittee').unbind().bind('click', function() {
			$('#searchBoxCommittee').slideToggle("slow");
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


    this.initialize();

};