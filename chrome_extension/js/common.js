//cf. http://www.chromium.org/developers/web-intents-in-chrome
//cf. http://miteshmaheta.blogspot.jp/2012/07/webcam-in-html5.html
//cf. http://events.html5j.org/conference/2012/09/

function initCrossBrowser() {

	window.Intent = window.Intent || window.WebKitIntent;
	window.navigator.startActivity = window.navigator.startActivity || window.navigator.webkitStartActivity;
	window.intent = window.intent || window.webkitIntent;

	// Catch stream from the camera using getUserMedia. Syntax is different as per the borwser. for ex. webkitGetUserMedia - Chrome, mozGetUserMedia- Mozilla Firefox.
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia || navigator.msGetUserMedia;

	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

}

function attachUserMedia(videoElement) {

	// Check if browser supports or not.
	if (!navigator.getUserMedia) {
		return;
	}

	var click = function() {
		var computedStyle = document.defaultView.getComputedStyle(videoElement, "");
		var canvas = document.createElement("canvas");
		var height = parseInt(computedStyle.height);
		var width = parseInt(computedStyle.width);
		canvas.height = height;
		canvas.width = width;
		var context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, width, height);
		intent.postResult(canvas.toDataURL("image/jpeg"));
	};

	//If Media streaming is success, This function will called.
	var success = function(stream) {
		// Replace the source of the video element with the stream from the camera
		videoElement.src = window.URL.createObjectURL(stream) || stream;
		videoElement.play();
		videoElement.addEventListener("click", click, false);
	};

	//If Media streaming is fail, This function will call.   
	var error = function(error) {
		console.error('An error occurred: [CODE ' + error.code + ']');
		videoElement.play();
	};

	// specially used this syntax for chrome. Other browser supports {video:true,audio:true}
	var options = {video: true, toString: function(){return 'video';}};

	//Main method call to run webcam
	navigator.getUserMedia(options, success, error);

}

function initialize() {
	initCrossBrowser();
	if (!window.Intent) {
		return;
	}
	var video = document.getElementById("video");
	attachUserMedia(video);
}

window.addEventListener("load", initialize, false);
