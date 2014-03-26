var rssDataPath = "parliament.bg_activities";
var plenaryDataFile = "plenary.rss.xml";
var controllDataFile = 'controll.rss.xml';
var committeeDataFile = 'committee.xml.rss';
var newsDataFile = 'news.xml.rss';
var dataFiles = [plenaryDataFile, controllDataFile, committeeDataFile, newsDataFile];

var dataFileAgeToDownload = 86400; //one day in seconds

// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homeTpl = Handlebars.compile($("#home-tpl").html());
    var plenaryTpl = Handlebars.compile($("#plenary-tpl").html());
    var controllTpl = Handlebars.compile($("#controll-tpl").html());
    var committeeTpl = Handlebars.compile($("#committee-tpl").html());
    var newsTpl = Handlebars.compile($("#news-tpl").html());

    var homeUrl = "#home";
    var plenaryUrl = "#plenary";
    var controllUrl = "#controll";
    var committeeUrl = "#committee";
    var newsUrl = "#news";

    var slider = new PageSlider($('body'));

    var adapters = [];
    for (i in dataFiles ) {
    	adapters[i] = new FileStorage(dataFiles[i]);
    	adapters[i].initialize();
    }
    route();
    /*adapter.initialize().done(function () {
        route();
    });*/

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
        for (i in adapters) {
        	adapters[i].checkDataFile();
        	console.log(adapters[i].dataFile);
    	}
        
    }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */
	function route() {
		var hash = window.location.hash;
		if (!hash) {
			slider.slidePage(new HomeView(homeTpl).render().el);
			return;
		}

		var match = hash.match(plenaryUrl);
		if (match) {
			var plenary = new PlenaryView(plenaryTpl);
			plenary.getData(function(tplData) {
				slider.slidePage(plenary.render(tplData).el);
			});
			return;
		}

		var match = hash.match(controllUrl);
		if (match) {
			var controll = new ControllView(controllTpl);
			controll.getData(function(tplData) {
				slider.slidePage(controll.render(tplData).el);
			});
			return;
		}

		var match = hash.match(committeeUrl);
		if (match) {
			var committee = new CommitteeView(committeeTpl);
			committee.getData(function(tplData) {
				slider.slidePage(committee.render(tplData).el);
			});
			return;
		}

		var match = hash.match(newsUrl);
		if (match) {
			var news = new NewsView(newsTpl);
			news.getData(function(tplData) {
				slider.slidePage(news.render(tplData).el);
			});
			return;
		}

	}

}());