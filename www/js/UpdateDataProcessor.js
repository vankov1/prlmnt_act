var UpdateDataProcessor = function() {
	var self = this;
	this.adapter = getAdapter(updatesDataFile);
	
	this.process = function() {
		//console.log('processing new changelog');
		var parser = new DOMParser();
		var data = parser.parseFromString(adapter.rssData, "text/xml");

		var records = data.getElementsByTagName('record');
		var i;
		var changes = {
				app_news : {
					cnt: 0,
					file: newsDataFile,
					menuId: 'liMainMenuNews'}, 
				app_comsitting : {
					cnt: 0,
					file: committeeDataFile,
					menuId: 'liMainMenuCommittee'}, 
				app_mps : {
					cnt: 0,
					file: deputiesDataFile,
					menuId: 'liMainMenuMPs'}, 
				app_bills : {
					cnt: 0,
					file: billsDataFile,
					menuId: 'liMainMenuBills'}, 
				app_control : {
					cnt: 0,
					file: controllDataFile,
					menuId: 'liMainMenuControll'}, 
				app_plenary : {
					cnt: 0,
					file: plenaryDataFile,
					menuId: 'liMainMenuPlenary'}
			};
		var section;
		
		for (i = 0; i < records.length; i++) {
			section = records[i].getElementsByTagName('section')[0].textContent;
			switch (section.trim()) {
			case 'app_news':
				changes.app_news.cnt ++;
				break;
			case 'app_commsitting':
				changes.app_comsitting.cnt ++;
				break;
			case 'app_mps':
				changes.app_mps.cnt ++;
				break;
			case 'app_bills':
				changes.app_bills.cnt ++;
				break;
			case 'app_control':
				changes.app_control.cnt ++;
				break;
			case 'app_plenary':
				changes.app_plenary.cnt ++;
				break;
			}
		}
		
		var tmpAdapter;
		for (var key in changes) {
			if (changes[key].cnt > 0) {
				console.log(key + ' has ' + changes[key].cnt + ' changes');
				$('#' + changes[key].menuId).addClass('new');
				tmpAdapter = getAdapter(changes[key].file);
				tmpAdapter.forceDownload = true;
				tmpAdapter.checkDataFile();
			} else {
				$('#' + changes[key].menuId).removeClass('new');
			}
		}
		
		
	};
	
	
};
