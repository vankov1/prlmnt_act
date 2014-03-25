var FileStorage = function(dataFileName) {
	
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

	gotFs = function(fileSystem) {
		//console.log('got FS');
		fileSystem.root.getDirectory(rssDataPath, {create : true, exclusive : false}, gotDirEntry, fail);
	};
	
	gotDirEntry = function(dirEntry) {
		//console.log('got dir entry');
		dirEntry.getFile(plenaryDataFile, {create : true, exclusive : false}, gotFileEntry, fail);
	};
	
	gotFileEntry = function(fileEntry) {
		//console.log('got file entry');
		fileEntry.file(gotFile, fail);
	};
	
	gotFile = function(file) {
		//console.log('got file');
		var age = (new Date()).getTime() - file.lastModifiedDate;
		if ( (age / 1000) > dataFileAgeToDownload || file.size <= 0) {
			console.log('Refresh data from RSS ' + this.dataFile);
		}
	};
	
	fail = function(error) {
		console.log("GotError:" + error);
	};

};