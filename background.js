// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var currentBpm, lastTime, clickCount, resetTimeout;
var activeIcons = ["images/active1_48.png", "images/active2_48.png"];

function resetToInit(){
  currentBpm = [];
  lastTime = undefined;
  clickCount = 0;
  chrome.browserAction.setBadgeText({text: ""});
  chrome.browserAction.setIcon({path:"images/sleep_48.png"});
}

function handleTap(ev) {
  if (!lastTime) {
    clickCount = 0;
    lastTime = new Date();
  } else {
    clickCount = (clickCount + 1) % 2;
    var thisTime = new Date();
    var diff = thisTime - lastTime;
    var newBpm = (60 * 1000) / diff;
    currentBpm.push(newBpm);
    if(currentBpm.length > 10) {
      currentBpm.shift();
    }
    var avg = 0;
    currentBpm.forEach(function(v){avg += v;});
    avg = avg / currentBpm.length;
    chrome.browserAction.setBadgeText({text: ""+Math.floor(avg)});
    lastTime = thisTime;
    clearTimeout(resetTimeout);
  }

  // set icon
  chrome.browserAction.setIcon({path:activeIcons[clickCount]});

  // reset timeout to fall back to base state
  resetTimeout = setTimeout(resetToInit, 2000);
}

resetToInit();
chrome.browserAction.onClicked.addListener(handleTap);
chrome.commands.onCommand.addListener(function(command){
  if(command == "tap-bpm") {
    handleTap();
  }
});
