import './history.html';

Template.history.onCreated(function gameOnCreated() {

    Meteor.subscribe("games");

});

Template.game.helpers({

    recentGames: function() {
        return Games.find();
    }
});