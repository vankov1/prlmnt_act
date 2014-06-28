var ControllView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(callback) {
		var adapter = getAdapter(controllDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");

		var controllsList = data.getElementsByTagName('item');
		
		var controll = [];
		var i = 0;
		for (var pi = 0; pi < controllsList.length; pi++) {
			var agendaItems = [];
			var agendaItemsNodes = controllsList[pi].getElementsByTagName('agenda_item');
			var shortDscr = '';
			var found;
			for (var ai = 0; ai < agendaItemsNodes.length; ai++) {
				var answerer = agendaItemsNodes[ai].getElementsByTagName('answerer')[0].textContent.trim().replace(/\r?\n/g, "<br />");
				found = false;
				for (i = 0; i < agendaItems.length; i++) {
					if (answerer == agendaItems[i].answerer) {
						/*console.log(' ');
						console.log('Existing answerer:' + answerer);
						console.log('questionWithAuthor: ' + agendaItems[i].questWithAutor.length + '. ' + agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent + ' от н.п. ' + agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent);
						*/
						agendaItems[i].question.push(agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent);
						agendaItems[i].questionAuthor.push(agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent);
						agendaItems[i].questWithAutor.push((agendaItems[i].questWithAutor.length + 1) + '. ' + agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent + ' от н.п. ' + agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent);
						found = true;
						break;
					}
				}
				if (!found) {
					/*console.log(' ');
					console.log('New answerer:');
					console.log('id: ' + (agendaItems.length + 1));
					console.log('idRom: ' + romanize(agendaItems.length + 1));
					console.log('answerer: ' + answerer);
					console.log('questionWithAuthor: ' + '1. ' + agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent + ' от н.п. ' + agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent);
					console.log('----------------');*/
					agendaItems.push({
						id: agendaItems.length + 1,
						idRom: romanize(agendaItems.length + 1),
						answerer: answerer,
						question: [agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent],
						questionAuthor: [agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent],
						questWithAutor: ['1.' + agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent + ' от н.п. ' + agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent]
					});
				}
				/*agendaItems[ai] = {
					id: ai + 1,
					question: agendaItemsNodes[ai].getElementsByTagName('question')[0] ? agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent : '',
					questionAuthor: agendaItemsNodes[ai].getElementsByTagName('question_author')[0] ? agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent : '',
					answerer: agendaItemsNodes[ai].getElementsByTagName('answerer')[0] ? agendaItemsNodes[ai].getElementsByTagName('answerer')[0].textContent : ''
				};*/
				if (shortDscr.length < 255) {
					shortDscr += (ai + 1) + '. ' + agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent + "\n";
				}
			}
			if (shortDscr.length > 255) {
				shortDscr = shortDscr.substring(0, 255) + '...';
			}
			shortDscr = shortDscr.replace(/\r?\n/g, "<br />");
			controll[pi] = {
				cid: pi,
				date: isoToBgDate(controllsList[pi].getElementsByTagName('date')[0] ? controllsList[pi].getElementsByTagName('date')[0].textContent : 'n/a'),
				time: controllsList[pi].getElementsByTagName('time')[0]? controllsList[pi].getElementsByTagName('time')[0].textContent : 'n/a',
				itemLink: controllsList[pi].getElementsByTagName('itemLink')[0] ? controllsList[pi].getElementsByTagName('itemLink')[0].textContent.trim() : 'javascript:void(0)',
				agenda: agendaItems,
				dscrShort: shortDscr
			};
		}
		
		tplData = {
			controll: controll
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);
		
		$('#btnSearchControll').unbind().bind('click', function() {
			$('#searchBoxControll').slideToggle(searchOpenDuration, function() {
				if ($('#scrollingContent').hasClass('search-opened')) {
					$('#scrollingContent').removeClass('search-opened');
				} else {
					$('#scrollingContent').addClass('search-opened');
				}
			});
		});
		
		if ($('#txtSearchControll')) { 
			$('#txtSearchControll').unbind().bind('keyup', function() {
				//console.log('box val: ' + $(this).val() );
				if ($(this).val().length < 3) {
					//Make all items visible
					$('.controllListItem').removeClass('hidden');
					return;
				}
				
				//Search items for entered text
				var needle = $.trim($(this).val());
				var items = self.searchItems(needle);
				if (!items || items.length == 0) {
					return;
				}
				
				//Display results
				$('.controllListItem').each(function() {
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
		needle = needle.toLowerCase();
		var adapter = getAdapter(controllDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var controllsList = data.getElementsByTagName('item');
		var itemIds = [];
		var agendaItemsNodes = [];
		var haystack_q = '';
		var haystack_qa = '';
		var haystack_a = '';
		for (var pi = 0; pi < controllsList.length; pi++) {
			agendaItemsNodes = controllsList[pi].getElementsByTagName('agenda_item');
			for (var ai = 0; ai < agendaItemsNodes.length; ai++) {
				haystack_q = agendaItemsNodes[ai].getElementsByTagName('question')[0].textContent.toLowerCase();
				haystack_qa = agendaItemsNodes[ai].getElementsByTagName('question_author')[0].textContent.toLowerCase();
				haystack_a = agendaItemsNodes[ai].getElementsByTagName('answerer')[0].textContent.toLowerCase();
				if (haystack_q.indexOf(needle) !== -1 || haystack_qa.indexOf(needle) !== -1 || haystack_a.indexOf(needle) !== -1) {
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
		$('#liMainMenuControll').addClass('active');
	};


    this.initialize();

};