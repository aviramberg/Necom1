// alert("Helo from your Chrome extension!");

// Constants

var host = 'wss://api.neurosteer.com/api/v1/features/000666046289/real-time/?all=true&access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJZZVpYOW5Bb2V6NWdEdWFiRGE3MXVub1IiLCJlbWFpbCI6ImF2aXJhbS5iZXJnQG1haWwuaHVqaS5hYy5pbCIsImlhdCI6MTQ3NDE5NDQ1MSwiZXhwIjoxNDc0MjA4ODUxfQ.QgVtBtrUX412whuJykgPMy4YlqZwiPavwzaruNd7JtU';

var defualtWinSize = 100;
var currentWinSize = 100;
var zoomStep = 10;

// Data Members 
var downloads = [];
var player;
// 'https://api.neurosteer.com/app?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ4MXJ5MUZKaFRBeFQxNGJvTnhzWU1jbEUiLCJlbWFpbCI6ImF2aXJhbS5iZXJnQG1haWwuaHVqaS5hYy5pbCIsImlhdCI6MTQ3MzU5MjM4MywiZXhwIjoxNDczNjA2NzgzfQ.w3ZCF6H5CXXPn1KFKc1tnF8QY03rA-1BQ3EaLBWs0Hk#/diary'
// var firstHref = $("a[href^='http']").eq(0).attr("href");

// console.log(firstHref);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");
      var v = document.title;
      // downloads.push(v);
      changeYoutubePlayer();
      // player.pauseVideo();
      // player.playVideo();
      // var myPlayer = document.getElementById('playerid');
      // myPlayer.stopVideo();
      // chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
      
      // chrome.runtime.sendMessage({"message": "open_new_tab"});
      
      
      
      
      
      
      
      
     


    var socket;
    var data2 = [];
    if (!window.WebSocket) {
         window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        var reconnectInterval = 1000;
        var connect = function () {
            var count = 0;

            socket = new WebSocket(host);
            socket.onmessage = function (event) {
            record = eval("(" + event.data + ")"); // convert to JSON
            // console.log(record.features.e1);
            console.log(record.features.gamma, record.features.c1, record.features.sigma, record.features.alpha);
            chrome.runtime.sendMessage({"message": "neurosteerData", "data": record.features});
            };
           socket.onopen = function (event) {
                var ta = document.getElementById('responseText');
                console.log("Web Socket opened!");
            };
            socket.onerror = function () {
                console.log('socket error');
                setTimeout(connect, reconnectInterval);
            };
            socket.onclose = function (event) {
                console.log('socket close');
                var ta = document.getElementById('responseText');
                console.log("Web Socket closed, reconnect in " + reconnectInterval + " msec");
                setTimeout(connect, reconnectInterval);
            };
        };
       connect();

    } else {
       alert("Your browser does not support Web Socket.");
    }
      
      
      
      
      
      
      
      
      
      
      
      
      
    }
    if ( request.message === "zoomIn" ) {
      console.log("zoomIn");
      zoomIn();
    }
    
    if ( request.message === "zoomOut" ) {
      console.log("zoomOut");
      zoomOut();
    }
    
    if (request.message === "sleep") {
      console.log("Enter to sleep mode");
      player.pauseVideo();
      // chrome.runtime.sendMessage({"message": "sleepMode", "url": document.URL});
    }
    
    if (request.message === "awake") {
      console.log("Awake again");
      player.playVideo();
    }
    
    if (request.message === "happy") {
      console.log("user happy");
      if (!request.c1) {
         zoomOut();
      }
      if ($.inArray(document.title, downloads)) {
        if (confirm("We see that you liked the video, do you want to download it?")) {
          chrome.runtime.sendMessage({"message": "download", "name" : document.title, "url":document.URL});
        }
        downloads.push(document.title);
      }
    }
  }
);


// Helper Function:


function zoomIn(){
  currentWinSize += zoomStep;
  $('body').css('zoom', ' ' + currentWinSize + '%');
}

function zoomOut() {
  if (currentWinSize > defualtWinSize) {
    currentWinSize -= zoomStep;
    $('body').css('zoom', ' ' + currentWinSize + '%');
  }
}

function changeYoutubePlayer() {
  // var tag = document.createElement('script');

  // tag.src = "https://www.youtube.com/iframe_api";
  // var firstScriptTag = document.getElementsByTagName('script')[0];
  // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  // var player;
  
  function onPlayerReady(event) {
      event.target.playVideo();
  }
  
  var done = false;
  function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 6000);
        console.log("player started");
        done = true;
      }
  }
  
  function stopVideo() {
      player.stopVideo();
  }
  
  
  var href = document.URL;
  var vidId =  href.substr(href.indexOf("=") + 1);
  // var vidId = href.substr(href.indexOf("=") + 1);
  // console.log(vidId);
  player = new YT.Player('player', {
          height: '360',
          width: '640',
          videoId: vidId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
  var oldPlayerContainer = document.getElementById("placeholder-player");
  oldPlayerContainer.replaceChild(document.getElementById("player"), document.getElementsByClassName("player-api player-width player-height")[0]);
  player.h.className = "player-api player-width player-height";
}



// var port = chrome.runtime.connect({name: "knockknock"});
// port.postMessage({joke: "Knock knock"});
// port.onMessage.addListener(function(msg) {
//   if (msg.question == "Who's there?")
//     port.postMessage({answer: "Madame"});
//   else if (msg.question == "Madame who?")
//     port.postMessage({answer: "Madame... Bovary"});
// });