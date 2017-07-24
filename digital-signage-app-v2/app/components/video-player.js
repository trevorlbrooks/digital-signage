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
  onEndedCallback(sender)
	This is an action that will be passed in as a parameter.
	Call this action using this.get('onCompletedCallback')()
	when the video has played to completion and and looping is
	disabled.
  onClickCallback
  onHoverCallback
*/

import Ember from 'ember';

export default Ember.Component.extend({
  metadata: Ember.inject.service(),
  
	url: null,
	looping: false,
	playing: true,
	muted: true,
	highlightedStyle: '',
  startingTime: 0,
  tagId: '',

	click(event) {
    let vid = this.$('video')[0];
		this.get('onClickCallback') (this.get('videoPos'), vid.currentTime, vid.duration);
		event.stopPropagation();
	},
	mouseEnter() {
		this.get('onHoverCallback') (this.get('videoPos'));
	},
	playingObserver: Ember.observer('playing', function() {
    let p = this.get("playing");
    let videoElement = this.$('video')[0];

    if (videoElement) {
      if (p) {
        videoElement.play();
      }
      else {
        videoElement.pause();
      }
    }
  }),
  actions: {
  	ended() {
      if (this.$('video')) {
        if (this.get('looping')) {
          let videoElement = this.$('video')[0];
          
          if (videoElement) {
            videoElement.play();
          }
        }
        else {
          this.get('onEndedCallback') (this.get('videoPos'), this.$('video')[0].duration);
        }
      }
  	},
    play() {
      if (this.$('video')) {
        if (this.get('playing')) {
          let videoElement = this.$('video')[0];
          
          if (videoElement) {
            videoElement.play();
          }
        }
      }
    }
  }
});
