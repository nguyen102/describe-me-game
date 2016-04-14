import { Meteor } from 'meteor/meteor';

Games = new Meteor.Collection("games");

Meteor.startup(() => {

    if (Meteor.isServer) {

        var Future = Npm.require("fibers/future");

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        Games.remove({});

        Meteor.methods({
            'updatePicture': function (gameId, index) {
                var urls = Games.findOne({_id: gameId}).allImageUrls;
                Games.update({_id: gameId},
                    {$set: {imageUrl: urls[index]}});
            },
            'joinGame': function (playerId, userName) {
                return _joinGame(playerId, userName);
            }
        });

        Meteor.publish("games", function () {
            return Games.find();
        });
        Meteor.publish("word_history", function () {
            return WordHistory.find();
        });

        function _joinGame(playerId, userName) {
            var availableGame = Games.findOne({
                player1: {$exists: true},
                player2: {$exists: false},
                started: false,
                done: false
            });

            //If existing game exist, set it to be done and start a new game
            var existingGame = Games.findOne({
                player1: playerId,
                done: false
            });

            if (existingGame == null) {
                existingGame = Games.findOne({
                    player2: playerId,
                    done: false
                });
            }

            if (existingGame != null) {
                return existingGame._id;
            }
            if (availableGame && availableGame.player1 != playerId) {
                availableGame.player2 = playerId;
                availableGame.user2Name = userName;
                availableGame.started = false;
                availableGame.score = 0;
                availableGame.player1WordList = [];
                availableGame.player2WordList = [];
                availableGame.player1Ready = false;
                availableGame.player2Ready = false;

                Games.update({_id: availableGame._id}, availableGame);


                return availableGame._id;

            } else {

                let futures = [];

                for (let images = 0; images < 6; images++) {

                    let future = new Future();
                    futures.push(future);

                    HTTP.get(
                        'https://feature-joo-gs-random-preview-url.graphicstock.videoblocksdev.com/api/v1/random-preview',
                        {

                        },
                        function (error, response) {
                            if (error) {
                                future.return({success: false});
                            } else {
                                future.return(response.data);
                            }
                        });
                }

                let urls = _.map(futures, function (future) {

                    let result = future.wait();

                    if (result.success) {
                        return result.info.small_preview_url;
                    } else {
                        return 'https://vb-wasabi-test.s3.amazonaws.com/preview/track-and-field-athlete-jumping-hurdle_G1amnU8d_S.jpg';
                    }
                });

                return Games.insert({
                    player1: playerId,
                    user1Name: userName,
                    matchingWords: [],
                    timeLeft: 60,
                    started: false,
                    done: false,
                    imageUrl: urls[0],
                    allImageUrls: urls
                });
            }
        }
    }
});