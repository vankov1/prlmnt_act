var FileStorage = function(dataFileName) {
	var self = this;
	
	this.dataFile = dataFileName;
	console.log('data file: ' + this.dataFile);
	this.fileEntry = null;

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
		var age = (new Date()).getTime() - file.lastModifiedDate;
		if ( (age / 1000) > dataFileAgeToDownload || file.size <= 0) {
			console.log('Refresh data from RSS: ' + file.name);
			self.downloadRssFile(file.name);
		}
	};
	
	var fail = function(error) {
		console.log("GotError:" + error);
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
				self.rssData = data;
				
				//Create FileWriter object
				self.fileEntry.createWriter(gotFileWriter, fail);
			},
			error: function() {
				console.log('Failed fetching ' + url);
			}
		});
		
	};
	
	var gotFileWriter = function(writer) {
		//writer.truncate(1);
		//console.log((new XMLSerializer()).serializeToString(self.rssData));
		writer.onwrite = function(event) {
			console.log(self.fileEntry.name + " written");
		};
		writer.onerror = function(event) {
			console.log('Failed writing');
		};
		//writer.seek(writer.length);
		writer.write((new XMLSerializer()).serializeToString(self.rssData));
		//writer.write('abrakadabra');
	};

};