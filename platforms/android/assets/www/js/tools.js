function openUrlInExternal(url) {
	window.open(url, "_system");
	return false;
}

function openAppUrl(url) {
	//console.log(url);
	window.location.href = url;
}

function getPlenaryTestingData(id) {
	var ret = {};
	ret.id = id;
	ret.type = 1;
	ret.status = 1;
	ret.startDate = '2014-04-09';
	ret.endDate = '2014-04-14';
	ret.link = 'http://www.parliament.bg/bg/plenaryprogram/ID/799';
	ret.pubDate = '2014-04-21 22:49:54';
	ret.agenda = [
		{id: 1, 
			itemText: 'Ново обсъждане на Закона за изменение и допълнение на Закона за собствеността и ползуването на земеделските земи, приет от Народното събрание на 4 април 2014 г. и върнат за ново обсъждане с Указ № 73 от 11 април 2014 г. на Президента на Републиката по чл. 101 от Конституцията на Република България.',
			isBill: '1',
			billLink: 'http://www.parliament.bg/bg/bills/ID/14832/'},
		{id: 2, 
			itemText: 'Второ гласуване на Законопроект за изменение и допълнение на Закона за устройството на Черноморското крайбрежие (Общ законопроект, изготвен на основата на приетите на първо гласуване на 7.2.2014 г. два законопроекта с вносители: Снежина Маджарова и група народни представители, 30.10.2013 г.; Димчо Михалевски и група народни представители, 27.11.2013 г.) - продължение.',
			isBill: '1',
			billLink: 'http://www.parliament.bg/bg/bills/ID/14800/'},
		{id: 3, 
			itemText: 'Второ гласуване на Законопроект за изменение и допълнение на Закона за обществените поръчки (Вносител: Министерски съвет, 29.8.2013 г. Приет на първо гласуване на 10.10.2013 г.) - продължение.',
			isBill: '0',
			billLink: ''},
		{id: 4, 
			itemText: 'Второ гласуване на Законопроект за изменение и допълнение на Закона за устройството на Черноморското крайбрежие (Общ законопроект, изготвен на основата на приетите на първо гласуване на 7.2.2014 г. два законопроекта с вносители: Снежина Маджарова и група народни представители, 30.10.2013 г.; Димчо Михалевски и група народни представители, 27.11.2013 г.) - продължение.',
			isBill: '1',
			billLink: 'http://www.parliament.bg/bg/bills/ID/14800/'},
		{id: 5, 
			itemText: 'Второ гласуване на Законопроект за изменение и допълнение на Закона за устройството на Черноморското крайбрежие (Общ законопроект, изготвен на основата на приетите на първо гласуване на 7.2.2014 г. два законопроекта с вносители: Снежина Маджарова и група народни представители, 30.10.2013 г.; Димчо Михалевски и група народни представители, 27.11.2013 г.) - продължение.',
			isBill: '1',
			billLink: 'http://www.parliament.bg/bg/bills/ID/14800/'},
	];
	
	return ret;
}

function getControllTestingData(id) {
	var ret = {};
	return ret;
}

function getCommitteeTestingData(id) {
	var ret = {};
	return ret;
}

function getNewsTestingData(id) {
	var ret = {};
	return ret;
}

function getBillsTestingData(id) {
	var ret = {};
	return ret;
}

function romanize (num) {
	if (!+num)
		return false;
	var	digits = String(+num).split(""),
		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
		       "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
		       "","I","II","III","IV","V","VI","VII","VIII","IX"],
		roman = "",
		i = 3;
	while (i--)
		roman = (key[+digits.pop() + (i * 10)] || "") + roman;
	return Array(+digits.join("") + 1).join("M") + roman;
}

function deromanize (str) {
	var	str = str.toUpperCase(),
		validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
		token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
		key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
		num = 0, m;
	if (!(str && validator.test(str)))
		return false;
	while (m = token.exec(str))
		num += key[m[0]];
	return num;
}

function isoToBgDate(date) {
	var parts = date.split(' ');
	if (!parts[0]) {
		return date;
	}
	parts = parts[0].split('-');
	return parts[2] + '.' + parts[1] + '.' + parts[0];
}

function varDumpObj(obj) {
	console.log('obj dump begin:');
	for (var prop in obj) {
		console.log(prop + ' -> ' + obj[prop]);
	}
	console.log('obj dump end');
}

function isArray(variable) {
	if (Object.prototype.toString.call(variable) === '[object Array]') {
		return true;
	}
	return false;
}

function inArray(needle, haystack) {
	var pos = -1;
	if (!isArray(haystack)) {
		return pos;
	}
	for (var i = 0; i < haystack.length; i++) {
		if (needle == haystack[i]) {
			pos = i;
			break;
		}
	}
	
	return pos;
}

function assignSliderOpenHandler() {
	if (!$('#open-left')) {
		return;
	}
	
	$('#open-left').unbind().bind('click', function() {
		if (snapper.state().state == "left") {
			snapper.close();
		} else {
			snapper.open('left');
		}
	});
}


function assignFooterHandlers(backBtnUrl) {
	if ($('#footerBackButton')) {
		$('#footerBackButton').unbind().bind('click', function() {
			openAppUrl(backBtnUrl);
		});
	}
	if ($('#footerSettingsButton')) {
		$('#footerSettingsButton').unbind().bind('click', function() {
			openAppUrl(optionsUrl + '?opener=' + opener);
		});
	}
}


function assignMPTabHandlers() {
	if ($('#mpTabAZ')) {
		$('#mpTabAZ').unbind().bind('click', function() {
			openAppUrl(mpAZListUrl);
		});
	}
	if ($('#mpTabGroups')) {
		$('#mpTabGroups').unbind().bind('click', function() {
			openAppUrl(mpGroupsUrl);
		});
	}
	if ($('#mpTabComms')) {
		$('#mpTabComms').unbind().bind('click', function() {
			openAppUrl(mpCommitteesUrl);
		});
	}
	if ($('#mpTabAreas')) {
		$('#mpTabAreas').unbind().bind('click', function() {
			openAppUrl(mpAreasUrl);
		});
	}
};


function processUpdatesInfo(savedUpdatesHash) {
	adapter = getAdapter(updatesDataFile);
	if (!settings.loaded || !adapter.loaded) {
		console.log('Not all files loaded');
		return;
	}
	console.log('Both files loaded');
	console.log('saved hash: ' + savedUpdatesHash);
	console.log('adapter hash: ' + adapter.rssDataHash);
	if (adapter.rssDataHash != savedUpdatesHash) {
		console.log('Hashes do not match - we have new changelog');
		settings.set('updatesHash', adapter.rssDataHash);
		settings.saveToFile();
		var updater = new UpdateDataProcessor();
		updater.process();
	}
}


function myInArray(needle, haystack) {
	var ret = -1;
	for (var i = 0; i < haystack.length; i++) {
		if (needle == haystack[i]) {
			ret = i;
			break;
		}
	}
	return ret;
}