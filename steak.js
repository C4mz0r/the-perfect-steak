/**
 * Created by c4mz0r on 28/07/16.
 */

/*globals $:false */
"use strict";

// Multiplier for cooking times so that cooking times can be represented in minutes
var timeMultiplier = 1000; //60 * 1000;

// Indicate the cooking times needed for each side of the steak in minutes (when multipiled by timeMultiplier)
var cookingTimes = {
  rare: {description: 'rare', firstSide: 5 * timeMultiplier, secondSide: 3 * timeMultiplier},
  mediumRare: {description: 'medium rare', firstSide: 5 * timeMultiplier, secondSide: 4 * timeMultiplier},
  medium: {description: 'medium rare', firstSide: 6 * timeMultiplier, secondSide: 4 * timeMultiplier},
  well: {description: 'well', firstSide: 8 * timeMultiplier, secondSide: 6 * timeMultiplier}
};

/*
 * Steak constructor, indicating the state of the steak and who will eat it.
 */
function Steak(how, who) {
  this.description = how.description;
  this.firstSide = how.firstSide;
  this.secondSide = how.secondSide;
  this.totalTime = this.firstSide + this.secondSide;
  this.notifications = [];
  this.isPutOnGrill = false;
  this.eater = who;
  console.log(" you want a " + how.description + ' steak so cook it ' + this.firstSide +
      ' and then flip for ' + this.secondSide)
}

/*
 * Schedule the steaks and indicate when to flip them
 */
function SteakScheduler() {
  this.steaks = [];
  this.push = function(steak) {
    this.steaks.push(steak);
  };

  // Determine when to put on and flip each steak so that all steaks
  // are ready at the same time.
  this.startCooking = function() {
    // Sort the steaks by cooking time (more first)
    this.steaks.sort(function(a, b) {return b.totalTime - a.totalTime});
    var self = this;
    for (var index = 0; index < this.steaks.length; index++) {
      delayBeforePuttingOnSteaks(self, index);
    }

  };

  // Wait for the correct amount of time before putting on steaks,
  // so that they all finish cooking at the same time.
  var delayBeforePuttingOnSteaks = function(self, index) {
    var longestSteakTime = self.steaks[0].totalTime;
    var delay = longestSteakTime - self.steaks[index].totalTime;
    console.log('You will put on ' + self.steaks[index].eater + "'s steak " + index + ' in ' + delay);
    setTimeout(function() {
      putOnSteak(self, index);
    }, delay);
  };

  // Put the indicated steak on the grill
  var putOnSteak = function(self, index) {
    console.log(self.steaks[index].eater + "'s steak " + index + ' was put on the grill!');
    self.steaks[index].notifications.push('PUT');
    self.steaks[index].isPutOnGrill = true;
    setTimeout(function() {
      flipSteak(self, index);
    }, self.steaks[index].firstSide);
  };

  // Flip the indicated steak
  var flipSteak = function(self, index) {
    console.log(self.steaks[index].eater + "'s steak " + index + ' needs to be flipped!');
    self.steaks[index].notifications.push('FLIP');
    setTimeout(function() {
      removeSteak(self, index);
    }, self.steaks[index].secondSide);
  };

  // Remove the indicated steak
  // If things work well, then all steaks should be indicated for removal at the same time
  var removeSteak = function(self, index) {
    console.log(self.steaks[index].eater + "'s steak " + index + ' needs to be REMOVED!');
    self.steaks[index].notifications.push('REMOVE');
    self.steaks[index].isPutOnGrill = false;
  };

}

/*
 * Represent and display the steak positions on the grill
 */
function Grill() {
  this.steaks = [];
  this.putSteak = function(steak) {
    this.steaks.push(steak);
  };

  // Draw the grill and the steaks
  this.render = function() {
    console.log('am refreshing');
    var theGrill = $("#grill");
    theGrill.empty();
    theGrill.css('height', '300px').css('width', '300px');
    for(var i = 0; i < this.steaks.length; i++) {
      var steakClass = 'steak';

      // Indicate that the steak has a pending action
      if (this.steaks[i].notifications.length) {
        steakClass += ' alert';
      }

      // Indicate that the steak is not currently on the grill
      if (this.steaks[i].isPutOnGrill === false) {
        steakClass += ' notplaced'
      }
      theGrill.append("<div class='" + steakClass + "'>"+ this.steaks[i].eater + "<br>"
          + this.steaks[i].notifications.toString() +"</div>");
    }
  };


  // Creates a click listener that works for delegated events (e.g. steaks that get created dynamically on the grill,
  // after the listener has already been created)
  var self = this;
  $("#grill").on('click', '.steak', function(){
    var clickedSteakIndex = $(this).index();
    self.steaks[clickedSteakIndex].notifications.shift();
    self.render();
  });

  // Set up a refresh loop so that the steaks will redraw with latest notifications
  setInterval(this.render.bind(this), 2500);
}

$(function(){
  var s = new SteakScheduler();

  // When the add button is called to confirm a steak
  $("#buttonAdd").click(function() {
    var eater = $("#eater").val();
    var preferenceSelector = $("#preference");
    var preference = preferenceSelector.find(":selected").val();
    var preferenceText = preferenceSelector.find(":selected").text();
    $("#confirmedOrders > ul").append("<li>" + eater + " - " + preferenceText + "</li>");
    var steak = new Steak(cookingTimes[preference], eater);
    s.push(steak);

  });

  // When the steaks have been confirmed and we are ready to grill
  $("#startCooking").click(function() {
    s.startCooking();
    var bbq = new Grill();
    for(var i=0; i < s.steaks.length; i++) {
      bbq.putSteak(s.steaks[i]);
    }
    bbq.render();
  });



});