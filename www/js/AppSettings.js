var AppSettings = function() {
	var self = this;
	this.settings = {};
	this.loaded = false;
	this.adapter = new FileStorage(settingsDataFile);
	this.adapter.initialize();
	this.adapter.checkAgeAndSize = false;
	
	this.parseSettings = function(jsonData) {
		//console.log('settingData: ' + xmlData);
		if (jsonData) {
			self.settings = JSON.parse(jsonData);
			self.loaded = true;
			//console.log("self.get('updatesHash')" + self.get('updatesHash'));
			processUpdatesInfo(self.get('updatesHash'));
		} else {
			self.settings = {};
		}
		//console.log(self.settings);
	};

	this.adapter.registerCallbacks({readFileDone: this.parseSettings});
	
	this.loadFromFile = function() {
		self.adapter.checkDataFile();
	};
	
	this.set = function(key, val) {
		//console.log(val);
		self.settings[key] = val;
		//console.log(this.settings[key]);
	};
	
	this.get = function(key) {
		//varDumpObj(self.settings);
		return self.settings[key];
	};
	
	this.saveToFile = function() {
		//console.log(this.settings['subscribedCommittees']);
		//JSON.stringify(this.settings)
		self.adapter.rssData = JSON.stringify(self.settings);
		//console.log(this.adapter.rssData);
		self.adapter.saveFile();
	};
	
};
