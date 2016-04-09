import { Meteor } from 'meteor/meteor';

Games = new Meteor.Collection("games");

var imageUrls = [
    "https://d1yn1kh78jj1rr.cloudfront.net/preview/cal-retrotoons-0814-192_M.jpg",
    "http://cdn1.theodysseyonline.com/files/2015/12/21/6358631429926013411708851658_Dog-Pictures.jpg",
    "http://media.caranddriver.com/images/media/51/2016-10best-cars-lead-photo-664005-s-original.jpg",
    "http://weknowyourdreamz.com/images/island/island-09.jpg",
    "https://images.trvl-media.com/media/content/expus/graphics/launch/cruise1320x742.jpg",
    "http://az616578.vo.msecnd.net/files/2016/03/05/635928088052093326-1019743780_woman_smelling_flowers_in_the_field.jpg"
];

Meteor.startup(() => {

    if (Meteor.isServer) {
        
        function _joinGame(playerId) {

            let availableGame = Games.findOne({
                player1: {$exists: true},
                player2: {$exists: false},
                started: false
            });

            if(availableGame){
                availableGame.player2 = playerId;
                availableGame.started = true;
                availableGame.timeLeft = 120;
                availableGame.totalScore = 0;
                availableGame.imageUrl = Random.choice(imageUrls);

                Games.update({_id: availableGame._id}, availableGame);

                Meteor.setTimeout(function() {
                    _resetImage(availableGame);
                }, 15000);

                return availableGame._id;

            }else{

                let gameId = Games.insert({
                    player1: playerId,
                    started: false
                });

                return gameId;
            }
        }

        function _resetImage(game){

            console.log(game._id + "yo");
            game.timeLeft = game.timeLeft - 15;
            game.imageUrl = imageUrls[_.random(0, 5)];
            Games.update({_id: game._id}, game);

            if(game.timeLeft > 0){
                Meteor.setTimeout(function() {
                    _resetImage(game);
                }, 15000);
            }
        }

        Meteor.methods({
            'joinGame': function(playerId) {
                return _joinGame(playerId);
            }
        });

        Meteor.publish("games", function(gameId) {
            return Games.find({_id: gameId});
        });
    }
});