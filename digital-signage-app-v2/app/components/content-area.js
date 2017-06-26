import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';
import toposort from 'npm:toposort';

export default Ember.Component.extend(KeyboardControls, {
  displayVideoSelect: false,
  displayVideoSelectTimeout: null,
  displayVideo: false,
  video: null,
  videoPlaying: false,
  keyboard: null,
  backgroundVideoPos: 0,
  backgroundVideoUrl: null,
  backgroundVideoKeys: null,
  selectionVideos: [],
  afterVideoListData: null,
  showAfterVideoList: false,
  
  mapData: [ ],

  showVideoSelect: function() {
    this.set('displayVideoSelect', true);

    this.send('resetTimeout');
  },
  hideVideoSelect: function() {
    this.set('displayVideoSelect', false);

    clearTimeout(this.get('displayVideoSelectTimeout'));
  },
  pauseVideo: function() {
    this.set('videoPlaying', !this.get('videoPlaying'));
    this.set('displayVideoSelect', !this.get('videoPlaying'));
    this.set('focus', this.get('videoPlaying'));
  },
  select: function() {
    this.set('videoPlaying', false);
    this.set('focus', false);
    this.showVideoSelect();

    this.send('resetTimeout');
  },
  cancel: function() {
    this.pauseVideo();

    this.send('resetTimeout');
  },
  goNext: function() {
    this.pauseVideo();

    this.send('resetTimeout');
  },
  goPrevious: function() {
    this.pauseVideo();

    this.send('resetTimeout');
  },
  makeMapData: function() {
    let mapData = [ ];
    
    for (let key in this.get('data.attributes')) {
      
      mapData.push(Ember.copy(this.get('data.attributes')[key]));
      mapData[mapData.length - 1].id = key;
      
      for (let i = 0; i < mapData[mapData.length - 1].videos.length; i++) {
        let vidId = mapData[mapData.length - 1].videos[i];
        let video =  this.get('data.videos')[vidId];
        
        video.id = vidId;
        
        mapData[mapData.length - 1].videos[i] = video;
      }
    }
    
    mapData.sort(function(a, b) {
      return (a.y - b.y) || (a.x - b.x);
    });
    
    mapData.forEach(function(attribute) {
      let nodes = [ ];
      let edges = [ ];
      
      nodes = attribute.videos;
      
      nodes.forEach(function(node, index) {
      nodes[index] = [ node ];
        
        node.relations.forEach(function(edgeData) {
          let edgeObj = { };
          
          if (edgeData.difficulty >= 0 && edgeData.attributeId === attribute.id) {
            edgeObj.to = edgeData.relatedId;
            edgeObj.from = node.id;
            edgeObj.diff = edgeData.difficulty;
            
            edges.push(edgeObj);  
          }
        });
      });
      
      edges.sort(function(a, b) {
        return a.diff - b.diff;
      });
      
      if (edges.length) {
        let topoEdges = [ ];

        this.kruskals(nodes, edges).forEach(function(edge) {
          let arr = [ ];
          
          arr[0] = edge.from;
          arr[1] = edge.to;
          
          topoEdges.push(arr);
        });
        
        topoEdges = toposort(topoEdges);
        
        for (let videoIndex = 0; videoIndex < topoEdges.length; videoIndex++) {
          let videoId;
          
          if (videoIndex > 4) {
            return;
          }
          
          videoId = topoEdges[videoIndex];
          
          topoEdges[videoIndex] = this.get('data.videos')[videoId];
        }
        
        attribute.videos = topoEdges;
      }
      else {
        attribute.videos = nodes[0];
      }
    }, this);

    this.set('mapData', mapData);
  },
  kruskals: function(nodes, edges) {
    let numTrees = 0;
    let kst = [ ];
    let numNodes = nodes.length;

    do {
      let rel = edges.shift();
      let fromTreeIndex;
      let toTreeIndex;

      if(!rel) {
        break;
      }
      
      for (let treeIndex = 0; treeIndex < nodes.length; treeIndex++) {
        let tree = nodes[treeIndex];
         
        if (!rel) {
          break;
        }
        
        for (let nodeIndex = 0; nodeIndex < tree.length; nodeIndex++) {
          let node = tree[nodeIndex];
          
          if (node.id.toString() === rel.from) {
            fromTreeIndex = treeIndex;
          }
          else if (node.id.toString() === rel.to) {
            toTreeIndex = treeIndex;
          }
        }
        
        if (fromTreeIndex === undefined || toTreeIndex === undefined) {
          continue;
        }
        
        if (fromTreeIndex !== toTreeIndex) {
          let newTree = nodes[fromTreeIndex].concat(nodes[toTreeIndex]);
          nodes.push(newTree);
          
          nodes.splice(fromTreeIndex, 1);
          nodes.splice(toTreeIndex, 1);

          kst.push(rel);
          
          numTrees = numTrees + 1;
          
          rel = null;
        }
      }
      
    } while (numTrees < numNodes - 1);

    return kst;
  },

  init() {
    let backgroundId = this.get('data.config.backgroundVideos')[0];   
    this._super(...arguments);
    this.set('keyboard', this.get('data.config.keyboard'));
    this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    this.set('backgroundVideoKeys', this.get('data.config.backgroundVideos'));
    this.showVideoSelect();
    this.set('selectionVideos', []);

    for (let vid in this.get('data.videos')) {
      this.get('selectionVideos').pushObject(this.get('data.videos')[vid]);
    }

    let afterVideoListData = [
    ];

    for (let key in this.get('data.attributes')){
      let videos = [];

      afterVideoListData.push(Ember.copy(this.get('data.attributes')[key]));

      for (let i = 0; i < afterVideoListData[afterVideoListData.length - 1].videos.length; i++){
        videos.push(this.get('data.videos')[afterVideoListData[afterVideoListData.length - 1].videos[i]]);
      }

      afterVideoListData[afterVideoListData.length - 1].videos = videos;
    }

    afterVideoListData.unshift(
      {
        prettyName: "History",
        description: "",
        x: 0,
        y: 0,
        videos: [
          {
            prettyName: "ioenasihoetna",
            description: "oansionasnt",
            attributes: [ ],
            relations: [
              {
                relatedId: "",
                difficulty: 1,
                attributeId: ""
              }
            ],
            full: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            },
            teaser: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            }
          }
        ]
      }
    );
    
    this.set('afterVideoListData', afterVideoListData);
    
    this.makeMapData();
  },
  didRender() {
    if (this.$().is(':focus') !== this.get('focus')) {
      this.updateFocus(this.get('focus'));
    }
  },
  
  click() {
    this.set('focus', false);
    this.showVideoSelect();
  },
  actions: {
    videoSelected(sender, videoData) {
      if (videoData) {
        var url = videoData.full.fileIdentifier;
        //strips off media fragments fix by sending vid object data from model
        this.set('video', this.get('data.config.modelIdentifier') + '/' + url);
        this.set('displayVideo', true);
        this.set('videoPlaying', true);
        this.hideVideoSelect();
        this.set('focus', true);
      }
      else {
        this.pauseVideo();
      }
    },
    videoEnded() {
      this.set('focus', false);
      this.showVideoSelect();
      this.set('displayVideo', false);
    },
    cycleBackground() {
      let backArrayLength = this.get('backgroundVideoKeys').length;
      let curVidPos = this.get('backgroundVideoPos');

      this.set('backgroundVideoPos', (curVidPos + 1) % backArrayLength);

      let backgroundId = this.get('data.config.backgroundVideos')[this.get('backgroundVideoPos')];
      this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    },
    doNothing(/*sender, selected*/) {
      //console.log(selected);
    },

    cancelPressed() {
      this.cancel();
    },
    resetTimeout() {
      let component = this;

      clearTimeout(this.get('displayVideoSelectTimeout'));

      let timeout = setTimeout(() => {
                      component.hideVideoSelect();
                      component.set('focus', true);
                    }, this.get('data.config.ui.idle') * 1000);

      this.set('displayVideoSelectTimeout', timeout);
    }
  }
});
