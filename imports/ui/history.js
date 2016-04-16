import './history.html';

Template.history.onCreated(function gameOnCreated() {

    Meteor.subscribe("games");

});

Template.game.helpers({

    history: function() {
        return Games.find({}).map(function(item){
           return item.toString();
        });
    }
});