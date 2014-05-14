var AppSettings = function() {
	this.settings = {};
	this.loaded = false;
	this.adapter = new FileStorage(settingsDataFile);
	this.adapter.initialize();
	this.adapter.checkAgeAndSize = false;
	this.adapter.registerCallbacks({'readFileDone': this.parseSettings});
	
	this.loadFromFile = function() {
		this.adapter.checkDataFile();
	};
	
	this.parseSettings = function(xmlData) {
		console.log('settingData: ' + xmlData);
	};
	
	this.set = function(key, val) {
		this.settings[key] = val;
		//console.log(this.settings[key]);
	};
	
	this.get = function(key) {
		return this.settings[key];
	};
	
	this.saveToFile = function() {
		//console.log(this.settings['subscribedCommittees']);
		//JSON.stringify(this.settings)
		this.adapter.rssData = JSON.stringify(this.settings);
	};
	
};
