import { Meteor } from 'meteor/meteor';

Games = new Meteor.Collection("games");

var imageUrls = ["https://d1yn1kh78jj1rr.cloudfront.net/preview/cal-retrotoons-0814-192_M.jpg",
"http://cdn1.theodysseyonline.com/files/2015/12/21/6358631429926013411708851658_Dog-Pictures.jpg", 
    "http://media.caranddriver.com/images/media/51/2016-10best-cars-lead-photo-664005-s-original.jpg",
    "http://u.realgeeks.media/islandsearch/tahitiisland.jpg",
    "https://images.trvl-media.com/media/content/expus/graphics/launch/cruise1320x742.jpg",
    "http://az616578.vo.msecnd.net/files/2016/03/05/635928088052093326-1019743780_woman_smelling_flowers_in_the_field.jpg"
]
Meteor.startup(() => {

    if (Meteor.isServer) {
        Games.remove({});
        Meteor.methods({
            'updatePicture': function(gameId, index) {
                // var gameId = Games.findOne()._id;
                Games.update({_id: gameId}, 
                    {$set: {imageUrl: imageUrls[index]}});
            },
            'joinGame': function(playerId) {
                return _joinGame(playerId);
            }
        });

        Meteor.publish("games", function() {
            return Games.find();
        });
        Meteor.publish("word_history", function() {
            return WordHistory.find();
        });

        function _joinGame(playerId) {

            let availableGame = Games.findOne({
                player1: {$exists: true},
                player2: {$exists: false},
                started: false,
                done: false
            });

            if (availableGame && availableGame.player1 != playerId && availableGame.player2 != playerId) {
                availableGame.player2 = playerId;
                availableGame.started = true;
                availableGame.score = 0;
                availableGame.player1WordList = [];
                availableGame.player2WordList = [];
                availableGame.imageUrl = imageUrls[0];
                availableGame.startTime = Math.floor(new Date().getTime() / 1000);

                Games.update({_id: availableGame._id}, availableGame);
                

                return availableGame._id;

            } else {

                let gameId = Games.insert({
                    player1: playerId,
                    timeLeft: 60,
                    started: false,
                    done: false
                });

                return gameId;
            }
        };
    };
});