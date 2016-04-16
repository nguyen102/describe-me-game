import './history.html';

Template.history.onCreated(function gameOnCreated() {

    Meteor.subscribe("games");

});

Template.history.helpers({

    recentGames: function() {

        return Games.find().map(function(item){
            return JSON.stringify(item, null, 2);
        });
    }
});