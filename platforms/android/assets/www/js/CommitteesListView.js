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
		var subscrComms = settings.get('subscribedCommittees');
		var commId = -1;
		var subscribed = true;
		for (var i = 0; i < commsList.length; i++) {
			commId = commsList[i].getElementsByTagName('commitee_id')[0].textContent;
			subscribed = (subscrComms && inArray(commId, subscrComms) < 0) ? '0' : '1';
			comm[i] = {
				commId: commId,
				commName: commsList[i].getElementsByTagName('name')[0].textContent,
				created: isoToBgDate(commsList[i].getElementsByTagName('created')[0].textContent),
				typeId: commsList[i].getElementsByTagName('typeID')[0].textContent,
				type: commsList[i].getElementsByTagName('type')[0].textContent,
				chairman: commsList[i].getElementsByTagName('chairman')[0] ? commsList[i].getElementsByTagName('chairman')[0].textContent : '',
				isSubscribed: subscribed
			};
		}
		
		tplData = {
			commsList: comm
		};
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function(backBtnUrl) {
		var self = this;
		
		assignSliderOpenHandler();
		assignFooterHandlers(backBtnUrl);

		$('.subscribe-btn').unbind().bind('click', function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).parent().addClass('unsubscribedText');
			} else {
				$(this).addClass('active');
				$(this).parent().removeClass('unsubscribedText');
			}
		});
		
		$('#btn_comm_list_save').unbind().bind('click', function() {
			self.saveSubscribedCommittees();
			openAppUrl(committeeUrl);
		});
		if (!settings.get('subscribedCommittees')) {
			self.saveSubscribedCommittees();
		}
	};
	
	this.saveSubscribedCommittees = function() {
		var subscrComms = [];
		$('.ion-checkmark-circled').each(function() {
			if ($(this).hasClass('active')) {
				subscrComms.push($(this).data('committeeId'));
			}
		});
		settings.set('subscribedCommittees', subscrComms);
		//console.log(subscrComms);
		settings.saveToFile();
	};
	
	this.updateInterface = function() {
		$('.liMainMenuItem').removeClass('active');
		$('#liMainMenuCommittee').addClass('active');
		$('#page-placeholder').scrollTop(0);
	};
	
    this.initialize();

};