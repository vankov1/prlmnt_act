var AppSettings = function() {
	this.settings = {};
	this.loaded = false;
	
	this.loadFromFile = function() {
		adapter = new FileStorage(settingsDataFile);
		adapter.initialize();
		adapter.checkAgeAndSize = false;
		adapter.registerCallbacks({'readFileDone': this.parseSettings});
		adapter.checkDataFile();
	};
	
	this.parseSettings = function(xmlData) {
		console.log('settingData: ' + xmlData);
	};
	
	this.set = function(key, val) {
		this.settings.key = val;
	};
	
	this.get = function(key) {
		return this.settings.key;
	};
	
	this.saveToFile = function() {
		console.log(this.settings.subscribedCommittees);
		//JSON.stringify(this.settings)
	};
	
};
