var HomeView = function (template) {

    this.initialize = function () {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        this.el.on('keyup', '.search-key', this.findByName);
    };

    this.render = function() {
        this.el.html(template());
        return this;
    };
    
    this.assignHandlers = function() {
    	assignSliderOpenHandler();
    };
		
	this.updateInterface = function() {
		$('.liMainMenuItem').removeClass('active');
		$('#page-placeholder').scrollTop(0);
	};

    this.initialize();

};