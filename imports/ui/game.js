import './game.html';
Games = new Meteor.Collection("games");

Template.game.onCreated(function gameOnCreated() {
    // Meteor.subscribe('games', {userId: Meteor.userId()});
    Meteor.subscribe("games");
});

Template.game.events({
    'click #answer-button': function (e) {
        _sendMessage();
    },
    'keyup #answer-box': function (e) {
        if (e.type == "keyup" && e.which == 13) {
            _sendMessage();
        }
    }
});

Template.game.helpers({
    sessionId: '',
    started: true,
    score: 7,
    timeLeft: 10,
    imageUrl: function() {
        return Games.findOne().imageUrl;
    }
});

_sendMessage = function () {
    var answerBox = document.getElementById("answer-box");
    console.log(answerBox.value);
    answerBox.value = "";
    answerBox.focus();
};