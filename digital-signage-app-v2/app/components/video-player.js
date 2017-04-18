/*
COMPONENT: video-player

Parameters:
  url
	If startUrl is passed in, load the video at that url
	immediately. Otherwise, leave video blank until setUrl()
	is called.

  looping
	Should the video loop when it completes playback
	default: false
	
  playing
	Should the video play
	default: true

  muted
	Mute the video
	default: true

Callbacks:
  onCompletedCallback(sender)
	This is an action that will be passed in as a parameter.
	Call this action using this.get('onCompletedCallback')()
	when the video has played to completion and and looping is
	disabled.
*/

import Ember from 'ember';

export default Ember.Component.extend({
	url: null,
	looping: false,
	playing: true,
	muted: true,

	click(event) {
		this.get('onClickCallback')(this);
		event.stopPropagation();
	},

	loopingObserver: Ember.observer('looping', function() {
		var videoElement = this.$().find("video").get(0);
		if (videoElement) {
			if (videoElement.ended && this.get("playing")) {
				videoElement.play();
			}
		}
  	}),
	playingObserver: Ember.observer('playing', function() {
    	var p = this.get("playing");
		var videoElement = this.$().find("video").get(0);
		if (videoElement) {
			if (p) {
				videoElement.play();
			}
			else {
				videoElement.pause();
			}
		}
		else {
			console.log("No video element found!");
		}
  	}),
	urlObserver: Ember.observer('url', function() {
		var videoElement = this.$().find("video").get(0);
		if (videoElement) {
			videoElement.load();
		}
		else {
			console.log("No video element found");
		}
  	})
});
