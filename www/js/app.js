var rssDataPath = "parliament.bg_activities";
var plenaryDataFile = "plenary.xml";
var controllDataFile = 'controll.xml';
var committeeDataFile = 'committee.xml';
var committeesListFile = 'committees_list.xml';
var newsDataFile = 'news.xml';
var billsDataFile = 'bills.xml';
var deputiesDataFile = 'deputies.xml';
var votingAreasDataFile = 'voting_areas.xml';
var structsDataFile = 'structures.xml'; //Parliament structures - political groups, committees, etc.
var updatesDataFile = 'changelog.xml';
var dataFiles = [updatesDataFile, plenaryDataFile, controllDataFile, committeeDataFile, committeesListFile, newsDataFile, billsDataFile, deputiesDataFile, votingAreasDataFile, structsDataFile];
var adapters = [];
var homePageNewItemsCounters = {
	plenaries: '0',
	controll: '0',
	committee: '0',
	news: '0'
};

var settingsDataFile = 'settings.xml';

var dataFileAgeToDownload = 86400; //one day in seconds
//var dataFileAgeToDownload = 10; //one day in seconds

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if (v1 === v2) {
		return options.fn(this);
	}
	return options.inverse(this);
});

function getRssUrlByFileName(fileName) {
	var url = '';
	if (fileName == plenaryDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_plenary/";
	} else if (fileName == controllDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_control/";
	} else if (fileName == committeeDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_comsitting/";
	} else if (fileName == committeesListFile) {
		url = "http://parliament.bg/export/bg/xml/app_collection/";
	} else if (fileName == newsDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_news/";
	} else if (fileName == billsDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_bills/";
	} else if (fileName == deputiesDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_mps/";
	} else if (fileName == updatesDataFile) {
		url = "http://parliament.bg/export/bg/xml/app_log/";
	} else if (fileName == votingAreasDataFile) {
		url = "http://parliament.bg/export/bg/xml/app_constituency/";
	} else if (fileName == structsDataFile) {
		url = "http://parliament.bg/export/bg/xml/app_collection_list/";
	}
	return url;
}

function getAdapter(dataFileName) {
	var adapterIndex = 0;
	for (var i = 0; i < dataFiles.length; i++) {
		if (dataFiles[i] == dataFileName) {
			adapterIndex = i;
			break;
		}
	}
	return adapters[adapterIndex];
}

var settings = new AppSettings();

var homeUrl = "#home";
var plenaryUrl = "#plenary";
var plenaryDetailUrl = '#plenaryDetail';
var controllUrl = "#controll";
var controllDetailUrl = "#controllDetail";
var committeeUrl = "#committee";
var committeeDetailUrl = "#committeeDetail";
var committeesListUrl = "#committees-list";
var newsUrl = "#news";
var newsDetailUrl = "#newsDetail";
var optionsUrl = "#options";
var billsListUrl = "#billsList";
var billsDetailUrl = "#billsDetail";
var mpAZListUrl = "#mpAZList";
var mpDetailUrl = "#mpDetail";
var mpGroupsUrl = "#mpGroups";
var mpCommitteesUrl = "#mpCommittees";
var mpAreasUrl = "#mpAreas";


var ParalmStructType_GROUPS = 2;
var ParalmStructType_COMMITTEES = 3;

assignMainMenuHandlers();

var searchOpenDuration = 200;


function assignMainMenuHandlers() {
	if ($('#mainMenuPlenary')) {
		$('#mainMenuPlenary').unbind().bind('click', function() {
			openAppUrl(plenaryUrl);
		});
	}
	
	if ($('#mainMenuControll')) {
		$('#mainMenuControll').unbind().bind('click', function() {
			openAppUrl(controllUrl);
		});
	}
	
	if ($('#mainMenuCommittee')) {
		$('#mainMenuCommittee').unbind().bind('click', function() {
			openAppUrl(committeeUrl);
		});
	}
	
	if ($('#mainMenuBills')) {
		$('#mainMenuBills').unbind().bind('click', function() {
			openAppUrl(billsListUrl);
		});
	}
	
	if ($('#mainMenuMPs')) {
		$('#mainMenuMPs').unbind().bind('click', function() {
			openAppUrl(mpAZListUrl);
		});
	}
	
	if ($('#mainMenuNews')) {
		$('#mainMenuNews').unbind().bind('click', function() {
			openAppUrl(newsUrl);
		});
	}
	
};

// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homeTpl = Handlebars.compile($("#home-tpl").html());
    var plenaryTpl = Handlebars.compile($("#plenary-tpl").html());
    var plenaryDetailTpl = Handlebars.compile($("#plenary-tpl-detail-preview").html());
    var controllTpl = Handlebars.compile($("#controll-tpl").html());
    var controllDetailTpl = Handlebars.compile($("#controll-tpl-detail-preview").html());
    var committeeTpl = Handlebars.compile($("#committee-tpl").html());
    var committeeDetailTpl = Handlebars.compile($("#committee-tpl-detail-preview").html());
    var committeesListTpl = Handlebars.compile($("#committee-check-list-tpl").html());
    var newsTpl = Handlebars.compile($("#news-tpl").html());
    var newsDetailTpl = Handlebars.compile($("#news-tpl-detail-preview").html());
    var optionsTpl = Handlebars.compile($("#options-tpl").html());
    var billsTpl = Handlebars.compile($("#bills-tpl").html());
    var billsDetailTpl = Handlebars.compile($("#bills-tpl-detail-preview").html());
    var mpsAZTpl = Handlebars.compile($("#mps-tpl").html());
    var mpsAreasTpl = Handlebars.compile($("#mp-area-tpl").html());
    var mpsGroupsTpl = Handlebars.compile($("#mp-groups-tpl").html());
    var mpsCommsTpl = Handlebars.compile($("#mp-committees-tpl").html());

//    var slider = new PageSlider($('body'));

    for (var i = 0; i < dataFiles.length; i++) {
    	adapters[i] = new FileStorage(dataFiles[i]);
    	adapters[i].initialize();
		if (dataFiles[i] == updatesDataFile) {
			adapters[i].forceDownload = true;
		}
    }
    route();
    
    /* --------------------------------- Event Registration -------------------------------- */
    $(window).on('hashchange', route);

    document.addEventListener('deviceready', function () {

        FastClick.attach(document.body);

        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
        
        //Check for downloaded RSS files and if they are missing or too old download them
        for (var i = 0; i < adapters.length; i++) {
    		adapters[i].checkDataFile();
        	//console.log(adapters[i].dataFile);
    	}
        
        settings.loadFromFile();
        
    }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */
	function route() {
		var hash = window.location.hash;
		if (!hash) {
			//slider.slidePage(new HomeView(homeTpl).render().el);
			var home = new HomeView(homeTpl);
			$('#page-placeholder').html(home.render().el);
			home.assignHandlers();
			home.updateInterface();
			snapper.close();
			return;
		}
		
		var match;
		match = hash.match(homeUrl);
		if (match) {
			var home = new HomeView(homeTpl);
			//slider.slidePage(home.render(homePageNewItemsCounters).el);
			$('#page-placeholder').html(home.render(homePageNewItemsCounters).el);
			home.assignHandlers();
			home.updateInterface();
			snapper.close();
			return;
		}

		match = hash.match(plenaryUrl);
		if (match) {
			match = hash.match(plenaryDetailUrl);
			if (match) {
				var parts = hash.split('?');
				if (parts[1]) {
					var id = parts[1].replace('id=', '');
					var plenary = new PlenaryView(plenaryDetailTpl);
					plenary.getData(function(tplData) {
						var detailData = {};
						if (tplData.plenary.length == 0) {
							detailData = getPlenaryTestingData(id);
						} else {
							detailData = tplData.plenary[id];
						}
						//slider.slidePage(plenary.render(detailData).el);
						$('#page-placeholder').html(plenary.render(detailData).el);
						plenary.assignHandlers(plenaryUrl);
						plenary.updateInterface();
					});
					snapper.close();
					return;
				}
			}
			var plenary = new PlenaryView(plenaryTpl);
			plenary.getData(function(tplData) {
				//slider.slidePage(plenary.render(tplData).el);
				$('#page-placeholder').html(plenary.render(tplData).el);
				plenary.assignHandlers(homeUrl);
				plenary.updateInterface();
			});
			snapper.close();
			return;
		}

		match = hash.match(controllUrl);
		if (match) {
			match = hash.match(controllDetailUrl);
			if (match) {
				var parts = hash.split('?');
				if (parts[1]) {
					var id = parts[1].replace('id=', '');
					var controll = new ControllView(controllDetailTpl);
					controll.getData(function(tplData) {
						var detailData = {};
						if (tplData.controll.length == 0) {
							detailData = getControllTestingData(id);
						} else {
							detailData = tplData.controll[id];
						}
						//slider.slidePage(controll.render(detailData).el);
						$('#page-placeholder').html(controll.render(detailData).el);
						controll.assignHandlers(controllUrl);
						controll.updateInterface();
					});
					snapper.close();
					return;
				}
			}
			var controll = new ControllView(controllTpl);
			controll.getData(function(tplData) {
				//slider.slidePage(controll.render(tplData).el);
				$('#page-placeholder').html(controll.render(tplData).el);
				controll.assignHandlers(controllUrl);
				controll.updateInterface();
			});
			snapper.close();
			return;
		}
		
		match = hash.match(committeesListUrl);
		if (match) {
			var commList = new CommitteesListView(committeesListTpl);
			commList.getData(function(tplData) {
				//slider.slidePage(commList.render(tplData).el);
				$('#page-placeholder').html(commList.render(tplData).el);
				commList.assignHandlers(homeUrl);
				commList.updateInterface();
			});
			snapper.close();
			return;
		}

		match = hash.match(committeeUrl);
		if (match) {
			match = hash.match(committeeDetailUrl);
			if (match) {
				var parts = hash.split('?');
				if (parts[1]) {
					var id = parts[1].replace('id=', '');
					var committee = new CommitteeView(committeeDetailTpl);
					committee.getData(function(tplData) {
						var detailData = {};
						if (tplData.committee.length == 0) {
							detailData = getCommitteeTestingData(id);
						} else {
							detailData = tplData.committee[id];
						}
						//slider.slidePage(committee.render(detailData).el);
						$('#page-placeholder').html(committee.render(detailData).el);
						committee.assignHandlers(committeeUrl);
						committee.updateInterface();
					});
					snapper.close();
					return;
				}
			}
			var committee = new CommitteeView(committeeTpl);
			committee.getData(function(tplData) {
				//slider.slidePage(committee.render(tplData).el);
				$('#page-placeholder').html(committee.render(tplData).el);
				committee.assignHandlers(homeUrl);
				committee.updateInterface();
			});
			snapper.close();
			return;
		}

		match = hash.match(newsUrl);
		if (match) {
			match = hash.match(newsDetailUrl);
			if (match) {
				var parts = hash.split('?');
				if (parts[1]) {
					var id = parts[1].replace('id=', '');
					//console.log('id: ' + id);
					var news = new NewsView(newsDetailTpl);
					news.getData(function(tplData) {
						var detailData = {};
						if (tplData.news.length == 0) {
							detailData = getNewsTestingData(id);
						} else {
							detailData = tplData.news[id];
						}
						//slider.slidePage(news.render(detailData).el);
						$('#page-placeholder').html(news.render(detailData).el);
						news.assignHandlers(newsUrl);
						news.updateInterface();
					});
					snapper.close();
					return;
				}
			}
			var news = new NewsView(newsTpl);
			news.getData(function(tplData) {
				//slider.slidePage(news.render(tplData).el);
				$('#page-placeholder').html(news.render(tplData).el);
				news.assignHandlers(homeUrl);
				news.updateInterface();
			});
			snapper.close();
			return;
		}
		
		match = hash.match(optionsUrl);
		if (match) {
			var options = new OptionsView(optionsTpl);
			options.getData(function(tplData) {
				//slider.slidePage(options.render(tplData).el);
				$('#page-placeholder').html(options.render(tplData).el);
				options.assignHandlers('');
				options.updateInterface();
			});
			snapper.close();
			return;
		}
		
		match = hash.match(billsListUrl);
		if (match) {
			var bills = new BillsView(billsTpl);
			bills.getData(function(tplData) {
				//slider.slidePage(bills.render(tplData).el);
				$('#page-placeholder').html(bills.render(tplData).el);
				bills.assignHandlers(homeUrl);
				bills.updateInterface();
			});
			snapper.close();
			return;
		}
		
		match = hash.match(billsDetailUrl);
		if (match) {
			var parts = hash.split('?');
			if (parts[1]) {
				var id = parts[1].replace('id=', '');
				//console.log('id: ' + id);
				var bills = new BillsView(billsDetailTpl);
				bills.getData(function(tplData) {
					var detailData = {};
					if (tplData.bills.length == 0) {
						detailData = getBillsTestingData(id);
					} else {
						detailData = tplData.bills[id];
					}
					//slider.slidePage(bills.render(detailData).el);
					$('#page-placeholder').html(bills.render(detailData).el);
					bills.assignHandlers(billsListUrl);
					bills.updateInterface();
				});
				snapper.close();
				return;
			}
		}
		
		match = hash.match(mpAZListUrl);
		if (match) {
			var parts = hash.split('?');
			if (!parts[1]) {
				var filter = '';
			} else {
				var filter = parts[1].split('=');
			}
			var mps = new MPsView(mpsAZTpl);
			mps.getData(filter, function(tplData) {
				//slider.slidePage(mps.render(tplData).el);
				$('#page-placeholder').html(mps.render(tplData).el);
				mps.assignHandlers(homeUrl);
				mps.updateInterface();
			});
			snapper.close();
			return;
		}
		
		match = hash.match(mpGroupsUrl);
		if (match) {
			var groups = new ParlamStructsView(mpsGroupsTpl);
			groups.getData(ParalmStructType_GROUPS, function(tplData) {
				$('#page-placeholder').html(groups.render(tplData).el);
				groups.assignHandlers(homeUrl);
				groups.updateInterface();
			});
			snapper.close();
			return;
		}
		
		match = hash.match(mpCommitteesUrl);
		if (match) {
			var comms = new ParlamStructsView(mpsCommsTpl);
			comms.getData(ParalmStructType_COMMITTEES, function(tplData) {
				$('#page-placeholder').html(comms.render(tplData).el);
				comms.assignHandlers(homeUrl);
				comms.updateInterface();
			});
			snapper.close();
			return;
		}
				
		match = hash.match(mpAreasUrl);
		if (match) {
			var areas = new VotingAreasView(mpsAreasTpl);
			areas.getData(function(tplData) {
				$('#page-placeholder').html(areas.render(tplData).el);
				areas.assignHandlers(homeUrl);
				areas.updateInterface();
			});
			snapper.close();
			return;
		}

		
	}

}());