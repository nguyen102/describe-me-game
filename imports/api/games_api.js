import { Meteor } from 'meteor/meteor';

// export const Games = new Mongo.Collection('games');
Games = new Meteor.Collection("games");
Meteor.startup(() => {

    if (Meteor.isServer) {
        // Meteor.publish('games', function gamePublication(userId) {
        //     return Games.find();
        // });


        _createGame = function (playerId) {
            let game = Games.insert({
                player1: playerId,
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

        Meteor.publish("games", function() {
            return Games.find();
        });

    };
});