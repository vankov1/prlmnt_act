// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homeTpl = Handlebars.compile($("#home-tpl").html());
    var plenaryTpl = Handlebars.compile($("#plenary-tpl").html());
    var controllTpl = Handlebars.compile($("#controll-tpl").html());

    var homeUrl = "#home";
    var plenaryUrl = "#plenary";
    var controllUrl = "#controll";
    var committeeUrl = "#committee";
    var newsUrl = "#news";

    var slider = new PageSlider($('body'));

    var adapter = new MemoryAdapter();
    adapter.initialize().done(function () {
        route();
    });

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

	}

}());