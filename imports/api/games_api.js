import { Meteor } from 'meteor/meteor';

Games = new Meteor.Collection("games");
Scores = new Meteor.Collection("scores");
WordHistory = new Meteor.Collection("word_history");
Messages = new Meteor.Collection("messages");

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
        _createGame(1);


        Scores.remove({});
        WordHistory.remove({});
        Messages.remove({});
        Scores.insert({name:"game1", score: 10});
        
        
        Meteor.publish("games", function() {
            return Games.find();
        });
        Meteor.publish("scores", function() {
            return Scores.find();
        });
        Meteor.publish("word_history", function() {
            return WordHistory.find();
        });
        Meteor.publish("messages", function(){
            return Messages.find();
        });

    };
});