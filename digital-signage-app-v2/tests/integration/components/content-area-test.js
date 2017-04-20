import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('content-area', 'Integration | Component | content area', {
  integration: true
});

test('it renders', function(assert) {
  let data = Ember.Object.create({
    "config": {
        "modelIdentifier": "kenny",
        "ui": {
            "dwell": 3,
            "idle": 15,
            "menuLocale": "top"
        },
        "keyboard": {
            "select": "d",
            "previous": "a",
            "cancel": "s",
            "next": "h"
        }
    },
    "videos": {
        "0": {
            "fileIdentifier": "kenny_band_1.mp4",
            "isUrl": false,
            "prettyName": "Kenny with a Rubber Band: Episode X-II - A New Hope",
            "description": "Kenny shoots a rubber band... You won't believe what happens next!",
            "attributes": [ "0", "6" ]
        },
        "1": {
            "fileIdentifier": "kenny_band_2.mp4",
            "isUrl": false,
            "prettyName": "Kenny with a Rubber Band: Episode IIII - Return of the New Hope",
            "description": "The phantom menace strikes back at the return of the revenge of the clones.",
            "attributes": [ "0", "6" ]
        },
        "2": {
            "fileIdentifier": "kenny_flap.mp4",
            "isUrl": false,
            "prettyName": "3 flappy 5 me",
            "description": "Our hero is sitting in the museum lab one day when Michael decides he needs a video to test stuff. The story unfolds as Kenny decides to make a video based on the lost footage from Josh.",
            "attributes": [ "5", "6" ]
        },
        "3": {
            "fileIdentifier": "kenny_sticks.mp4",
            "isUrl": false,
            "prettyName": "Kenny: Sticks - Electric Boogaloo",
            "description": "Ever wonder what would happen when a talentless nerd decides to begin a career in air-drumming? Find out in this zany action adventure horror comedy drama starring Kendall Schmit as Kenny, the hapless air-drummer wannabe as his loyal friends and family help him on his tough road to stardom.",
            "attributes": [ "1", "3", "4", "6" ]
        }
    },
    "attribute": {
        "0": {
            "name": "Rubber Band",
            "description": "Rubber bands are fun but they can be treacherous and have been known to turn on even the best rubber banders when they detect weakness.",
            "x": 0.5,
            "y": 0.5,
            "videos": [ "0", "1" ]
        },
        "1": {
            "name": "Promark 747B",
            "description": "Promark Neil Peart Signature 747Bs are the ONLY way to play.",
            "x": 0.8,
            "y": 0.8,
            "videos": [ "3" ]
        },
        "3": {
            "name": "Drum Sticks",
            "description": "I wanted to quit drumming, but my family said to STICK to it. Glad I did.",
            "x": 0.2,
            "y": 0.2,
            "videos": [ "3" ]
        },
        "4": {
            "name": "Interpretive Dance",
            "description": "Like dancing, but more interpretive.",
            "x": 0.2,
            "y": 0.8,
            "videos": [ "2", "3" ]
        },
        "5": {
            "name": "Birds",
            "description": "Birds can usually fly.",
            "x": 0.8,
            "y": 0.2,
            "videos": [ "2" ]
        },
        "6": {
            "name": "Needs a Haircut",
            "description": "Looks like someone needs a haircut.",
            "x": 0.5,
            "y": 0.2,
            "videos": [ "0", "1", "2", "3" ]
        }
    },
    "relation": {
        "0": {
            "videoId": "0",
            "relatedId": "1",
            "difficulty": "1",
            "attributeId": "0"
        },
        "1": {
            "videoId": "1",
            "relatedId": "0",
            "difficulty": "-1",
            "attributeId": "0"
        }
    }
});

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('testData', data);

  this.render(hbs`
    {{#content-area data=testData}}
      test
    {{/content-area}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'test');
});