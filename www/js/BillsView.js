var BillsView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
		this.el.html(template(tplData));
		return this;
	};

	this.getData = function(callback) {
		var adapter = getAdapter(billsDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var billsList = data.getElementsByTagName('item');
		
		var bills = [];
		var importers = [];
		var i = 0;
		var node;
		var importersShort = '';
		var nodeComm, nodeRole, comms;
		var nodeAuthor, nodePath, reports;
		for (var bi = 0; bi < billsList.length; bi++) {
			
			//Deal with bill importers
			node = billsList[bi].getElementsByTagName('Importer')[0];
			importers = [];
			importersShort = '';
			i = 0;
			while (node) {
				//console.log(node.attributes.getNamedItem('value').value);
				importers[i] = node.attributes.getNamedItem('value').value;
				if (importersShort.length < 128) {
					importersShort += "<br>" + (i + 1) + ". " + importers[i];
				}
				node = node.nextSibling;
				i++;
			}
			
			//Deal with reports
			nodeAuthor = billsList[bi].getElementsByTagName('Author');
			nodePath = billsList[bi].getElementsByTagName('Path');
			reports = [];
			for (i = 0; i < nodeAuthor.length; i++) {
				reports[i] = {
					name: nodeAuthor[i].textContent,
					link: nodePath[i].textContent
				};
			}
			
			//Deal with committees
			nodeComm = billsList[bi].getElementsByTagName('CommitteeName');
			nodeRole = billsList[bi].getElementsByTagName('Role');
			comms = [];
			for (i = 0; i < nodeComm.length; i++) {
				comms[i] = {
					name: nodeComm[i].textContent,
					role: nodeRole[i].textContent
				};
			}
			
			bills[bi] = {
				bid: bi,
				billName: billsList[bi].getElementsByTagName('BillName')[0].textContent,
				importers: importers,
				importersShort: importersShort,
				signature: billsList[bi].getElementsByTagName('Signature')[0].attributes.getNamedItem('value').value,
				session: billsList[bi].getElementsByTagName('Session')[0].attributes.getNamedItem('value').value,
				billDate: billsList[bi].getElementsByTagName('Date')[0].attributes.getNamedItem('value').value,
				comms: comms,
				commsDisplay: comms.length > 0 ? 1 : 0,
				reports: reports,
				reportsDisplay: reports.length > 0 ? 1 : 0
				/*,
				title: newsList[pi].getElementsByTagName('title')[0].textContent,
				dscr: newsList[pi].getElementsByTagName('description')[0].textContent.replace('>>', '>'),
				img: newsList[pi].getElementsByTagName('image')[0].textContent,
				pubDate: isoToBgDate(newsList[pi].getElementsByTagName('pubDate')[0].textContent),
				link: newsList[pi].getElementsByTagName('item_link')[0].textContent*/
			};
		}
		
		tplData = {
			bills: bills
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function() {
		var self = this;
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
					console.log('no matches');
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


    this.initialize();

};