import { Meteor } from 'meteor/meteor';

export const Games = new Mongo.Collection('tasks');

Meteor.startup(() => {

    if (Meteor.isServer) {

        Meteor.publish('games', function gamePublication(userId) {

            return Games.find();/*
             let game = Games.upsert(
             {
             started: false,
             player1: {$exists: true},
             player2: {$exists: false}
             },
             {
             $set: {
             started: true,
             player2: userId
             }
             }
             );

             if (game) {
             return Games.findOne(game);
             } else {
             return Games.insert({
             started: false,
             player1: userId
             });
             }*/
        });

        Meteor.methods({});
    }
});