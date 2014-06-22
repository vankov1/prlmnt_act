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
		var node, tmp, lawName;
		var importersShort = '';
		var nodeComm, nodeRole, comms;
		var files = [], reports = [], repAuthors, repLinks, chrono;
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
			reports = [];
			node = billsList[bi].getElementsByTagName('Reports')[0];
			if (node) {
				repAuthors = node.getElementsByTagName('Author');
				repLinks = node.getElementsByTagName('Path');
				for (i = 0; i < repAuthors.length; i++) {
					reports.push({
						author: repAuthors[i].textContent,
						link: repLinks[i].textContent
					});
				}
			}
			
			//Deal with chronology
			chrono = [];
			node = billsList[bi].getElementsByTagName('Chronology')[0];
			if (node) {
				repAuthors = node.getElementsByTagName('Date');
				repLinks = node.getElementsByTagName('Status');
				for (i = 0; i < repAuthors.length; i++) {
					//console.log(repAuthors[i].textContent + ' ' + repLinks[i].textContent);
					chrono.push({
						date: repAuthors[i].textContent,
						status: repLinks[i].textContent
					});
				}
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
			
			//Deal with files
			files = [];
			node = billsList[bi].getElementsByTagName('FilePath')[0];
			i = 0;
			while (node) {
				tmp = node.attributes.getNamedItem('value').value;
				files[i] = {
					link: tmp,
					type: (tmp.indexOf('.pdf') !== -1) ? 'PDF' : 'RTF'
				};
				node = node.nextSibling;
				i++;
			}
			
			lawName = billsList[bi].getElementsByTagName('LawName')[0].textContent;
			
			bills[bi] = {
				bid: bi,
				billName: billsList[bi].getElementsByTagName('BillName')[0].textContent,
				importers: importers,
				importersShort: importersShort,
				signature: billsList[bi].getElementsByTagName('Signature')[0].attributes.getNamedItem('value').value,
				session: billsList[bi].getElementsByTagName('Session')[0].attributes.getNamedItem('value').value,
				billDate: billsList[bi].getElementsByTagName('Date')[0].attributes.getNamedItem('value').value,
				lawName: lawName,
				dvNo: billsList[bi].getElementsByTagName('SGIss')[0].textContent,
				dvYear: billsList[bi].getElementsByTagName('SGYear')[0].textContent,
				decided: lawName.length > 0 ? 1 : 0,
				comms: comms,
				commsDisplay: comms.length > 0 ? 1 : 0,
				reports: reports,
				reportsDisplay: reports.length > 0 ? 1 : 0,
				chrono: chrono,
				chronoDisplay: chrono.length > 0 ? 1 : 0,
				files: files,
				filesDisplay: files.length > 0 ? 1 : 0
			};
		}
		
		tplData = {
			bills: bills
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);
		
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
				$('.billsListItem').each(function() {
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