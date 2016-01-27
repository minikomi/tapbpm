// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var currentBpm = [];
var lastTime;
var resetTimeout;

function updateIcon() {
  if (!lastTime) {
    lastTime = new Date();
  } else {
    var thisTime = new Date();
    var diff = thisTime - lastTime;
    var newBpm = (60 * 1000) / diff;
    chrome.browserAction.setIcon({path:"icon2.png"});
    currentBpm.push(newBpm);
    if(currentBpm.length > 10) {
      currentBpm.shift();
    }
    var avg = 0;
    currentBpm.forEach(function(v){avg += v});
    avg = avg / currentBpm.length;
    chrome.browserAction.setBadgeText({text: ""+Math.floor(avg)});
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(function(){
      currentBpm = [];
      lastTime = undefined;
      chrome.browserAction.setBadgeText({text: ""});
      chrome.browserAction.setIcon({path:"icon1.png"});
    }, 2000)
    lastTime = thisTime;
  }
}

chrome.browserAction.setIcon({path:"icon1.png"});
chrome.browserAction.onClicked.addListener(updateIcon);
