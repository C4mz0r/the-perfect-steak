/**
 * Created by c4mz0r on 28/07/16.
 */

/*globals $:false */
"use strict";

// Multiplier for cooking times so that cooking times can be represented in minutes
var timeMultiplier = 1000; //60 * 1000;

var cookingTimes = {
  rare: {description: 'rare', firstSide: 5 * timeMultiplier, secondSide: 3 * timeMultiplier},
  mediumRare: {description: 'medium rare', firstSide: 5 * timeMultiplier, secondSide: 4 * timeMultiplier},
  medium: {description: 'medium rare', firstSide: 6 * timeMultiplier, secondSide: 4 * timeMultiplier},
  well: {description: 'well', firstSide: 8 * timeMultiplier, secondSide: 6 * timeMultiplier}
};

function Steak(how, who) {
  this.description = how.description;
  this.firstSide = how.firstSide;
  this.secondSide = how.secondSide;
  this.totalTime = this.firstSide + this.secondSide;
  this.notifications = [];
  this.eater = who;
  console.log(" you want a " + how.description + ' steak so cook it ' + this.firstSide +
      ' and then flip for ' + this.secondSide)
}

/*
 * Schedule the steaks and indicate when to flip them
 */
function SteakScheduler() {
  this.steaks = [];
  /*
  this.push =  function(how, who) {
    this.steaks.push(new Steak(how, who));
  };
  */
  this.push = function(steak) {
    this.steaks.push(steak);
  }

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

  this.render = function() {
    console.log('am refreshing');
    $("#grill").empty();
    $("#grill").css('height', '300px').css('width', '300px');
    for(var i = 0; i < this.steaks.length; i++) {
      var steakClass = 'steak';
      if (this.steaks[i].notifications.length)
        steakClass += ' alert';
      $("#grill").append("<div class='" + steakClass + "'>"+ this.steaks[i].eater + "<br>" + this.steaks[i].notifications.toString() +"</div>");
    }

    // TODO: Figure out better way to bind to these dynamic elements
    var self = this;
    $(".steak").click(function(){
      var clickedSteakIndex = $(this).index();
      self.steaks[clickedSteakIndex].notifications.shift();
      self.render();
    });
  }

  // Set up a refresh loop so that the steaks will redraw with latest notifications
  setInterval(this.render.bind(this), 2500);
}

$(function(){
  var s = new SteakScheduler();
  var bbq = new Grill();

  //// Handle HTML Inputs
  $("#buttonAdd").click(function() {
    var eater = $("#eater").val();
    var preference = $("#preference").find(":selected").val();
    var preferenceText = $("#preference").find(":selected").text();
    $("#confirmedOrders ul").append("<li>" + eater + " - " + preferenceText + "</li>");
    var steak = new Steak(cookingTimes[preference], eater);
    s.push(steak);
    bbq.putSteak(steak);
    bbq.render();
  });


  $("#startCooking").click(function() {
    s.startCooking();
  });



});