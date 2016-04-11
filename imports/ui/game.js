import './game.html';
import './lib.js';
Games = new Meteor.Collection("games");

clockTime = 60;
timePerPicture = 10;
Template.game.onCreated(function gameOnCreated() {
    Meteor.subscribe("games");

    Meteor.call('joinGame', Meteor.userId(), Meteor.user().username, function(error, gameId){
        Session.set("gameId", gameId);
        if (Games.findOne({_id: Session.get("gameId")}) && Games.findOne({_id: Session.get("gameId")}).started == true){
            var timeCountDown = setInterval(function(){
                date = new Date();
                time = Math.floor(date.getTime() / 1000);
                startTime = Games.findOne({_id: Session.get("gameId")}).startTime;
                timeLeft = clockTime - (time - startTime);
                if(timeLeft % timePerPicture == 0){
                    Meteor.call("updatePicture", Session.get("gameId"), 6 - Math.floor(timeLeft / 10), function(error, result){});
                }
                Session.set("time", timeLeft);
                Games.update({_id: Session.get("gameId")}, {$set: {timeLeft: timeLeft}});
                if (timeLeft <= 0){
                    clearInterval(timeCountDown);
                    Games.update({_id: Session.get("gameId")}, {$set: {done: true}});
                    _lookForWordsThatMightHaveBeenMissed(Games.findOne({_id: Session.get("gameId")}));
                }
            }, 1000);
        }
    });

});

Template.game.events({
    'click #answer-button': function (e) {
        _sendWord();
        _updateScore();
        _resetAnswerBox();
    },
    'keyup #answer-box': function (e) {
        if (e.type == "keyup" && e.which == 13) {
            _sendWord();
            _updateScore();
            _resetAnswerBox();
        }
    }
});

Template.game.helpers({
    sessionId: '',
    started: function() {
        var gameId = Session.get("gameId");
        if(Games.findOne({_id: gameId}) != null){
            return Games.findOne({_id: gameId}).started;
        }
    },
    score: function() {
        if (Games.findOne({_id: Session.get("gameId")})){
            return Games.findOne({_id: Session.get("gameId")}).score;
        }
    },
    timeLeft: function() {
        var gameId = Session.get("gameId");
        if(Games.findOne({_id: gameId}) != null){
            return Games.findOne({_id: gameId}).timeLeft;
        }else{
            return clockTime;
        }
    },
    imageUrl: function() {
        if (Games.findOne(Session.get("gameId")) != null){
            return Games.findOne(Session.get("gameId")).imageUrl;
        }
    },
    opposingPlayer: function() {
        var gameId = Session.get("gameId");
        if(Games.findOne({_id: gameId}) != null){
            return _opposingPlayerUserName(Games.findOne(Session.get("gameId")));
        }
    },
    matchingWords: function() {
        var gameId = Session.get("gameId");
        if(Games.findOne({_id: gameId}) != null){
            return Games.findOne(Session.get("gameId")).matchingWords;
        }
    }
});