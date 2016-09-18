// Called when the user clicks on the browser action.

var c1 = [];
var sleep = [];
var awake = [];
var happy = [];
var wasSleep = false;

chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      // chrome.tabs.create({"url": request.url});
      
      // chrome.downloads.download({url: 'https://www.youtube.com/watch?v=ypHS-Xj2jwI', filename: "./saveme.mp3"});
      
      
      // chrome.tabs.getSelected(null, function(tab) {
      //   var myUrl = tab.url;
      //   chrome.downloads.download({url: 'https://www.youtube.com/watch?v=5jlI4uzZGjU'});
      // });
      
    }
    
    
    // getting features
    if(request.message === "neurosteerData") {
      var features = request.data;
      
      if (sleep.length > 7) {
        sleep = [];
      }
      
      if (happy.length > 6) {
        happy = [];
      }
      
      if (features.beta <= -0.65 ) {
        sleep.push(true);
        
        if (checkSleep(true) && !wasSleep) {
          sleep = [];
          wasSleep = true;
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "sleep"});
         });
        }
      } else {
        sleep.push(false);
        if (wasSleep && checkSleep(false)) {
          wasSleep = false;
          sleep = [];
          // awake = [];
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "awake"});
         });
        }
      }
      
      if (features.c1 > 0.9) {
        c1.push(true);
        if (checkC1(true)) {
          c1 = [] ;
          // chrome.tabs.create({"url": request.url});
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "zoomIn"});
         });
        }
      } else {
        c1.push(false);
                                // cause im happy
      if (features.c1 <= 0.8 && features.gamma >= 0.20) {
        happy.push(true);
        
        if (checkHappy(true)) {
          happy = [];
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            if (checkC1(false)) {
            c1 = [];
            chrome.tabs.sendMessage(activeTab.id, {"message": "happy", "c1": false});
            } else {
                chrome.tabs.sendMessage(activeTab.id, {"message": "happy", "c1": true});
            }
          });
        }
      } else {
        happy.push(false);
        if (checkC1(false)) {
          c1 = [];
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "zoomOut"});
          });
        } 
        
      }
  


        
        
        
      }
      
      
    }
    
    if (request.message === "download") {
      chrome.downloads.download({url: request.url, filename: "./" + request.name + ".mp3"});
    }
  }
);


// Helper function

function equale(bool) {
  return function(item) {
    return item === bool;
  };
}

function checkC1(bool) {
  if ((c1.filter(equale(bool)).length - c1.filter(equale(!bool)).length) >= 5) {
    return true;
  }
  return false;
}

function checkSleep(bool) {
  if ((sleep.filter(equale(bool)).length - sleep.filter(equale(!bool)).length) >= 3) {
    return true;
  }
  return false;
}

function checkHappy(bool) {
  if ((happy.filter(equale(bool)).length - happy.filter(equale(!bool)).length) >= 3) {
    return true;
  }
  return false;
}




// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "knockknock");
//   port.onMessage.addListener(function(msg) {
//     if (msg.joke == "Knock knock")
//       port.postMessage({question: "Who's there?"});
//     else if (msg.answer == "Madame")
//       port.postMessage({question: "Madame who?"});
//     else if (msg.answer == "Madame... Bovary")
//       port.postMessage({question: "I don't get it."});
//   });
// });