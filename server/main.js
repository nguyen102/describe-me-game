import { Meteor } from 'meteor/meteor';

Games = new Meteor.Collection("games");

Meteor.startup(() => {

    if (Meteor.isServer) {

        Meteor.methods({

        });
    }
});
