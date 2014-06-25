var NewsView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
		this.el.html(template(tplData));
		return this;
	};

	this.getData = function(callback) {
		var adapter = getAdapter(newsDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var newsList = data.getElementsByTagName('item');
		
		var news = [];
		for (var pi = 0; pi < newsList.length; pi++) {
			news[pi] = {
				nid: pi,
				title: newsList[pi].getElementsByTagName('title')[0].textContent,
				dscr: newsList[pi].getElementsByTagName('description')[0].textContent.replace('>>', '>'),
				img: newsList[pi].getElementsByTagName('image')[0].textContent,
				pubDate: isoToBgDate(newsList[pi].getElementsByTagName('pubDate')[0].textContent),
				link: newsList[pi].getElementsByTagName('item_link')[0].textContent
			};
		}
		
		tplData = {
			news: news
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);

		$('#btnSearchNews').unbind().bind('click', function() {
			$('#searchBoxNews').slideToggle(searchOpenDuration, function() {
				if ($('#scrollingContent').hasClass('search-opened')) {
					$('#scrollingContent').removeClass('search-opened');
				} else {
					$('#scrollingContent').addClass('search-opened');
				}
			});
		});
		
		if ($('#txtSearchNews')) { 
			$('#txtSearchNews').unbind().bind('keyup', function() {
				//console.log('box val: ' + $(this).val() );
				if ($(this).val().length < 3) {
					//Make all items visible
					//console.log('Make all items visible');
					$('.newsListItem').removeClass('hidden');
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
				$('.newsListItem').each(function() {
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
		
		var newsList = data.getElementsByTagName('item');
		var itemIds = [];
		var haystack = '';
		for (var pi = 0; pi < newsList.length; pi++) {
			haystack = newsList[pi].getElementsByTagName('description')[0].textContent;
			if (haystack.indexOf(needle) !== -1) {
				//console.log(pi + ' - position ' + haystack.indexOf(needle));
				itemIds.push(pi);
			}
		}
		return itemIds;
	};
	
	this.updateInterface = function() {
		$('.liMainMenuItem').removeClass('active');
		$('#liMainMenuNews').addClass('active');
	};


    this.initialize();

};