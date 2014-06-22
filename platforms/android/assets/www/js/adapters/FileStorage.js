var FileStorage = function(dataFileName) {
	var self = this;
	
	this.dataFile = dataFileName;
	//console.log('data file: ' + this.dataFile);
	this.fileEntry = null;
	this.rssData = '';
	this.rssDataHash = '';
	this.fileObj = null;
	this.loaded = false;
	
	this.checkAgeAndSize = true;
	this.forceDownload = false;
	
	this.callbacks = false;

	this.initialize = function() {
		// No Initialization required
		var deferred = $.Deferred();
		deferred.resolve();
		return deferred.promise();
	};

	this.checkDataFile = function() {
		//console.log('checkDataFile enter');
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFs, fail);
	};

	var gotFs = function(fileSystem) {
		//console.log('got FS');
		fileSystem.root.getDirectory(rssDataPath, {create : true, exclusive : false}, gotDirEntry, fail);
	};
	
	var gotDirEntry = function(dirEntry) {
		//console.log('got dir entry');
		dirEntry.getFile(self.dataFile, {create : true, exclusive : false}, gotFileEntry, fail);
	};
	
	var gotFileEntry = function(fileEntry) {
		//console.log('got file entry');
		fileEntry.file(gotFile, fail);
		self.fileEntry = fileEntry;
	};
	
	var gotFile = function(file) {
		//console.log('got file');
		self.fileObj = file;
		//var age = (new Date()).getTime() - file.lastModifiedDate;
		
		if ( self.forceDownload ||
			( self.checkAgeAndSize && (/*(age / 1000) > dataFileAgeToDownload ||*/ file.size <= 0) ) 
		) {
			console.log('Refresh data from RSS: ' + file.name);
			self.downloadRssFile(file.name);
		} else {
			console.log('Read rss data from file: ' + file.name);
			self.readRssFile(file.name);
		}
	};
	
	var fail = function(error) {
		console.log("GotError:" + error);
	};
	
	var countItems = function(xmlData, fileName) {
		delete self.callbacks.readFileDone;
		//console.log(fileName);
	};
	
	this.downloadRssFile = function(fileName) {
		var url = getRssUrlByFileName(fileName);
		console.log('RSS URL: ' + url);
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'xml',
			success: function(data, testStatus, jqXHR) {
				//data is a XML DOM object
				self.rssData = new XMLSerializer().serializeToString(data);
				self.loaded = true;
				
				//Create FileWriter object
				self.fileEntry.createWriter(gotFileWriter, fail);
			},
			error: function() {
				console.log('Failed fetching ' + url);
			}
		});
		
	};
	
	this.saveFile = function() {
		self.fileEntry.createWriter(gotFileWriter, fail);
	};
	
	var gotFileWriter = function(writer) {
		/*if (writer.length > 0) {
			writer.truncate(0);
		}*/
		//console.log((new XMLSerializer()).serializeToString(self.rssData));
		writer.onwrite = function(event) {
			console.log(self.fileEntry.name + " written");
			if (self.dataFile == updatesDataFile) {
				var hash = CryptoJS.MD5(self.rssData);
				self.rssDataHash = hash.toString();
				//console.log('updatesHash: ' + self.rssDataHash);
				processUpdatesInfo(settings.get('updatesHash'));
			}
		};
		writer.onerror = function(event) {
			console.log('Failed writing');
		};
		//writer.seek(writer.length);
		writer.write(self.rssData);
		//writer.write('abrakadabra');
	};
	
	this.readRssFile = function() {
		var reader = new FileReader();
		reader.onloadend = function(event) {
			console.log('Done reading ' + self.fileObj.name);
			//console.log(event.target.result);
			//Store read data
			self.rssData = event.target.result;
			self.loaded = true;
			if (self.callbacks && typeof(self.callbacks.readFileDone) != 'undefined') {
				self.callbacks.readFileDone(self.rssData, self.dataFile);
			}
		};
		reader.readAsText(self.fileObj);
	};
	
	this.registerCallbacks = function(callbacks) {
		self.callbacks = callbacks;
		//console.log('registered callback: ');
	};

};