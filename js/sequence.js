/* 
demo.js
*/
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

function Sequence(container, options) {
	"use strict";
	this.container = container;
	// event specifics
	this.eventQueue = []; // stores the events that are to happen	
	this.eventInterval = options.interval || 3000; // gap between two events in microseconds
	this.eventText = [];
	this.currentStep = -1;
	this.numSteps = 0;
	this.timerInterval;
	this.event_start_time;
	this.eventRunning = false;
	this.element = document.getElementById(container);
	this.display_bar = document.createElement("div");
	this.display_bar.setAttribute('id', "sequence_display_bar");
	document.body.appendChild(this.display_bar);	
	var self = this;
	this.last_mutation;
	this.observer = new MutationObserver(function(mutations) {
    	//some mutations happend on the element. Update time
    	self.last_mutation = new Date();
    });  
    this.observer.observe(this.element, { childList: true });
	this.timerInterval;
}

var wrapFunction = function(fn, context) {
    return function() {
        fn.apply(context);
    };
}

Sequence.prototype.run = function() {
	console.log("In Sequence run");
	var self = this;
	this.timerInterval = setInterval(function() {
		self.runEvents.call(self);
	}, 500);
}

Sequence.prototype.registerEvent = function(eventText, eventFunc, context) {
	// body...
	this.eventText.push(eventText);
	this.eventQueue.push(wrapFunction(eventFunc, context));
	this.numSteps = this.numSteps + 1;
};

/* This function is called every timeout seconds by setting up stuff at init*/
Sequence.prototype.runEvents = function() {
	console.log("----------- inside runevents function ----------");
	// crux of the things done here
	/*	
		1) Check for the current step to be run
		2) If some step is already running, check if the next step can be called (quite a few operaions to be done here)
		3) If everything is satisfied, run the next step
		4) Keep looking on when to run the next one if any		
	*/	
	if(!this.eventRunning) {
		// move to the next step
		this.currentStep = this.currentStep + 1;
		if(this.currentStep === (this.numSteps - 1)) {
			this.exit();
		}
		this.event_start_time = new Date();
		//update text as inner text of sequence_display_bar div
		console.log("Text:" + this.eventText[this.currentStep]);
		document.getElementById("sequence_display_bar").innerText = this.eventText[this.currentStep];
		this.eventQueue[this.currentStep]();
		this.eventRunning = true;
	} else {
		// check if we can move on to the next event
		var current_time  =  new Date();
		//TODO - Further changes need to be done here to check if respective dom is silent for some seconds of time
		// if this step caused some mutation in the dom
		var time_diff = 0;
		if(this.last_mutation > this.event_start_time) {
			time_diff = (current_time - this.last_mutation);
			//it shld be atleast 1 second from when the last change was observed in the element
			if(time_diff < 1000)
				time_diff = 0;
		} else {
		//if the step caused no mutation to the dom.. Strange but may happen
			// its been a second since anything happened with element
			time_diff = (current_time - this.event_start_time);
		}
		if(time_diff >= this.eventInterval) {
			//time to move on to next seq dude
			this.eventRunning = false;			
		}	
	}
};

//use Mutation observer to detect if dom of the element at hand has not been changed for x secs.
//If so kickstart timeout and change after timeout specified seconds

/*
Exit gracefully clearing stuff that were created by us 
*/
Sequence.prototype.exit = function() {
	console.log("Signing off now !");
	clearInterval(this.timerInterval);
	this.observer.disconnect();
	$(this.display_bar).hide();
}