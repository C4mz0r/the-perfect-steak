/**
 * Created by c4mz0r on 28/07/16.
 */

/*globals $:false */
"use strict";

var cookingTimes = {
  rare: {description: 'rare', firstSide: 4000, secondSide: 2000},
  mediumRare: {description: 'medium rare', firstSide: 8000, secondSide: 4000},
  medium: {description: 'medium rare', firstSide: 12000, secondSide: 6000},
  mediumWell: {description: 'medium well', firstSide: 16000, secondSide: 8000},
  well: {description: 'well', firstSide: 20000, secondSide: 10000}
};

function Steak(how, who) {
  this.description = how.description;
  this.firstSide = how.firstSide;
  this.secondSide = how.secondSide;
  this.totalTime = this.firstSide + this.secondSide;
  this.eater = who;
  console.log(" you want a " + how.description + ' steak so cook it ' + this.firstSide +
      ' and then flip for ' + this.secondSide)
}

/*
 * Schedule the steaks and indicate when to flip them
 */
function SteakScheduler() {
  this.steaks = [];
  this.push =  function(how, who) {
    this.steaks.push(new Steak(how, who));
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
    var message = 'Put ' + self.steaks[index].eater + "'s steak on the grill";
    notify(message);
    setTimeout(function() {
      flipSteak(self, index);
    }, self.steaks[index].firstSide);
  };

  // Flip the indicated steak
  var flipSteak = function(self, index) {
    console.log(self.steaks[index].eater + "'s steak " + index + ' needs to be flipped!');
    var message = 'Flip ' + self.steaks[index].eater + "'s steak now";
    notify(message);
    setTimeout(function() {
      removeSteak(self, index);
    }, self.steaks[index].secondSide);
  };

  // Remove the indicated steak
  // If things work well, then all steaks should be indicated for removal at the same time
  var removeSteak = function(self, index) {
    console.log(self.steaks[index].eater + "'s steak " + index + ' needs to be REMOVED!');
    var message = 'Remove ' + self.steaks[index].eater + "'s steak from the grill";
    notify(message);
  };

}


var notify = function(message) {
  $("#notifications").append("<p>" + message + "<button>Got it!</button></p>");
  // refresh handlers
  $("#notifications p button").click(function(){
    $(this).parent().css("text-decoration", "line-through");
  });

};


$(function(){
  var s = new SteakScheduler();

  //// Handle HTML Inputs
  $("#buttonAdd").click(function() {
    var eater = $("#eater").val();
    var preference = $("#preference").find(":selected").val();
    var preferenceText = $("#preference").find(":selected").text();
    $("#confirmedOrders ul").append("<li>" + eater + " - " + preferenceText + "</li>");
    s.push(cookingTimes[preference], eater);
  });

  $("#startCooking").click(function() {
    s.startCooking();
  });

});