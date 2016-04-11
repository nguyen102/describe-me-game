import { Meteor } from 'meteor/meteor';

Games = new Meteor.Collection("games");

var imageUrls = ["https://unsplash.it/800/500?image=0",
"http://cdn1.theodysseyonline.com/files/2015/12/21/6358631429926013411708851658_Dog-Pictures.jpg", 
    "http://media.caranddriver.com/images/media/51/2016-10best-cars-lead-photo-664005-s-original.jpg",
    "http://u.realgeeks.media/islandsearch/tahitiisland.jpg",
    "https://images.trvl-media.com/media/content/expus/graphics/launch/cruise1320x742.jpg",
    "http://az616578.vo.msecnd.net/files/2016/03/05/635928088052093326-1019743780_woman_smelling_flowers_in_the_field.jpg"
];

Meteor.startup(() => {

    if (Meteor.isServer) {
        Games.remove({});
        Meteor.methods({
            'updatePicture': function(gameId, index) {
                var urls = Games.findOne({_id: gameId}).allImageUrls;
                Games.update({_id: gameId}, 
                    {$set: {imageUrl: urls[index]}});
            },
            'joinGame': function(playerId, userName) {
                return _joinGame(playerId, userName);
            }
        });

        Meteor.publish("games", function() {
            return Games.find();
        });
        Meteor.publish("word_history", function() {
            return WordHistory.find();
        });

        _getSixRandomPictures = function() {
            var randomPictureUrls = [];
            for(var i = 0; i < 6; i++) {
                var number = Math.floor((Math.random() * 100) + 10);
                randomPictureUrls.push("https://unsplash.it/300?image=" + number);
            }
            return randomPictureUrls;
        };

        function _joinGame(playerId, userName) {
            let availableGame = Games.findOne({
                player1: {$exists: true},
                player2: {$exists: false},
                started: false,
                done: false
            });

            if (availableGame && availableGame.player1 != playerId && availableGame.player2 != playerId) {
                var urls = _getSixRandomPictures();
                availableGame.player2 = playerId;
                availableGame.user2Name = userName;
                availableGame.started = true;
                availableGame.score = 0;
                availableGame.player1WordList = [];
                availableGame.player2WordList = [];
                availableGame.imageUrl = urls[0];
                availableGame.startTime = Math.floor(new Date().getTime() / 1000);
                availableGame.allImageUrls = urls;

                Games.update({_id: availableGame._id}, availableGame);
                

                return availableGame._id;

            } else {

                let gameId = Games.insert({
                    player1: playerId,
                    user1Name: userName,
                    matchingWords: [],
                    timeLeft: 60,
                    started: false,
                    done: false
                });

                return gameId;
            }
        };
    };
});