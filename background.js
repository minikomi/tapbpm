// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var currentBpm;
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
    if(currentBpm) {
      currentBpm = ((currentBpm + newBpm) / 2);
      chrome.browserAction.setBadgeText({text: ""+Math.floor(currentBpm)});
    } else {
      currentBpm = newBpm;
    }
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(function(){
      currentBpm = undefined;
      lastTime = undefined;
      chrome.browserAction.setBadgeText({text: ""});
      chrome.browserAction.setIcon({path:"icon1.png"});
    }, 2000)
    lastTime = thisTime;
  }
}

chrome.browserAction.setIcon({path:"icon1.png"});
chrome.browserAction.onClicked.addListener(updateIcon);
