import './game.html';

Games = new Meteor.Collection("games");

Template.game.onCreated(function gameOnCreated() {

    Meteor.call('joinGame', Meteor.userId(), function(error, gameId){
        Meteor.subscribe("games", gameId);
    });
});

Template.game.events({
    'click #answer-button': function (e) {
        alert('chill for now');
    },
    'keyup #answer-box': function (e) {
        if (e.type == "keyup" && e.which == 13) {
            alert('chill for now too');
        }
    }
});

_resetAnswerBox = function() {
    var answerBox = document.getElementById("answer-box");
    answerBox.value = "";
    answerBox.focus();
};

Template.game.helpers({
    game() {
        return Games.findOne({});
    }
});