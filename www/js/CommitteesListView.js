var CommitteesListView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(callback) {
		var adapter = getAdapter(committeesListFile);
		console.log('got adapter: ' + adapter.dataFile);
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");
		
		var commsList = data.getElementsByTagName('committee');
		
		var comm = [];
		for (var i = 0; i < commsList.length; i++) {
			comm[i] = {
				commId: commsList[i].getElementsByTagName('commitee_id')[0].textContent,
				commName: commsList[i].getElementsByTagName('name')[0].textContent,
				created: isoToBgDate(commsList[i].getElementsByTagName('created')[0].textContent),
				typeId: commsList[i].getElementsByTagName('typeID')[0].textContent,
				type: commsList[i].getElementsByTagName('type')[0].textContent,
				chairman: commsList[i].getElementsByTagName('chairman')[0] ? commsList[i].getElementsByTagName('chairman')[0].textContent : ''
			};
		}
		
		tplData = {
			commsList: comm
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function() {
		var self = this;
		$('.subscribe-btn').unbind().bind('click', function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).parent().children('.title').addClass('unsubscribedText');
			} else {
				$(this).addClass('active');
				$(this).parent().children('.title').removeClass('unsubscribedText');
			}
		});
	};
	
    this.initialize();

};