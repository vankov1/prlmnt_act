var FileStorage = function(dataFileName) {
	var self = this;
	
	this.dataFile = dataFileName;
	console.log('data file: ' + this.dataFile);

	this.initialize = function() {
		// No Initialization required
		var deferred = $.Deferred();
		deferred.resolve();
		return deferred.promise();
	};

	this.checkDataFile = function() {
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
	};
	
	var gotFile = function(file) {
		//console.log('got file');
		var age = (new Date()).getTime() - file.lastModifiedDate;
		if ( (age / 1000) > dataFileAgeToDownload || file.size <= 0) {
			console.log('Refresh data from RSS ' + self.dataFile);
		}
	};
	
	var fail = function(error) {
		console.log("GotError:" + error);
	};

};