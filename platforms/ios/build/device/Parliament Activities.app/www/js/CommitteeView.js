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
		var adapter = getAdapter(controllDataFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		var commList = data.getElementsByTagName('item');
		
		var committee = [];
		for (var pi = 0; pi < commList.length; pi++) {
			committee[pi] = {
				title: commList[pi].getElementsByTagName('title')[0].textContent,
				pubDate: commList[pi].getElementsByTagName('pubDate')[0].textContent,
				link: commList[pi].getElementsByTagName('link')[0].textContent
			};
		}
		
		tplData = {
			committee: committee
		};
		
		if (callback) {
			callback(tplData);
		}
	};

    this.initialize();

};