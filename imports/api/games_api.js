import { Meteor } from 'meteor/meteor';

Games = new Meteor.Collection("games");
Scores = new Meteor.Collection("scores");
WordHistory = new Meteor.Collection("word_history");
var imageUrls = ["https://d1yn1kh78jj1rr.cloudfront.net/preview/cal-retrotoons-0814-192_M.jpg",
"http://cdn1.theodysseyonline.com/files/2015/12/21/6358631429926013411708851658_Dog-Pictures.jpg", 
    "http://media.caranddriver.com/images/media/51/2016-10best-cars-lead-photo-664005-s-original.jpg",
    "http://weknowyourdreamz.com/images/island/island-09.jpg",
    "https://images.trvl-media.com/media/content/expus/graphics/launch/cruise1320x742.jpg",
    "http://az616578.vo.msecnd.net/files/2016/03/05/635928088052093326-1019743780_woman_smelling_flowers_in_the_field.jpg"
]
Meteor.startup(() => {

    if (Meteor.isServer) {
        
        _createGame = function (playerId) {
            let game = Games.insert({
                gameId: 1,
                player1: null,
                player2: null,
                started: false,
                timeLeft: 120,
                score: 0,
                imageUrl: "https://d1yn1kh78jj1rr.cloudfront.net/preview/cal-retrotoons-0814-192_M.jpg"
            });
            return game;
        };
        Games.remove({});
        Scores.remove({});
        WordHistory.remove({});
        
        _createGame(1);
        Scores.insert({name:"game1", score: 0});

        Meteor.methods({
            'updatePicture': function(index) {
                var gameId = Games.findOne()._id;
                Games.update({_id: gameId}, 
                    {$set: {imageUrl: imageUrls[index]}});
            }
        });

        Meteor.publish("games", function() {
            return Games.find();
        });
        Meteor.publish("scores", function() {
            return Scores.find();
        });
        Meteor.publish("word_history", function() {
            return WordHistory.find();
        });

    };
});