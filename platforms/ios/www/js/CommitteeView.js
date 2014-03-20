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
		$.ajax({
			type: 'GET',
			url: "http://www.parliament.bg/rss.php?feed=cmeetings&lng=bg",
			dataType: 'xml',
			success: function(data, testStatus, jqXHR) {
				//data is a XML DOM object
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
			},
			error: function() {
			}
		});
	};

    this.initialize();

};