var OptionsView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(callback) {		
		var options = {appNotifAllowed : "0"};
		
		if (!settings.get('appNotificationsAllowed')) {
			settings.set('appNotificationsAllowed', '0');
			//console.log('saving settings to file appNotificationsAllowed = 0');
			settings.saveToFile();
		} else {
			options.appNotifAllowed = '' + settings.get('appNotificationsAllowed');
			console.log('settings.get appNotificationsAllowed: ' + options.appNotifAllowed);
		}
		
		tplData = options;
		
		if (callback) {
			callback(tplData);
		}
	};
	
	this.assignHandlers = function() {
		var self = this;
		
		$('#chkNotifications').unbind().bind('click', function() {
			//console.log('chkNotifications clicked ' + $(this).prop('checked'));
			if ($(this).prop('checked')) {
				settings.set('appNotificationsAllowed', '1');
			} else {
				settings.set('appNotificationsAllowed', '0');
			}
			settings.saveToFile();
		});
	};
	

    this.initialize();

};