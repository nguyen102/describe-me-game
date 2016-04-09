import './game.html';
import './lib.js';
Games = new Meteor.Collection("games");
Scores = new Meteor.Collection("scores");
WordHistory = new Meteor.Collection("word_history");

var clockTime = 60;
Template.game.onCreated(function gameOnCreated() {
    Meteor.subscribe("games");
    Meteor.subscribe("scores");
    Meteor.subscribe("word_history");

    Meteor.call('joinGame', Meteor.user().username, function(error, gameId){
        Session.set("gameId", gameId);
        if (Games.findOne({_id: Session.get("gameId")}) && Games.findOne({_id: Session.get("gameId")}).started == true){
            var timeCountDown = setInterval(function(){
                timeLeft = clockTime;
                date = new Date();
                time = Math.floor(date.getTime() / 1000);
                if (Games.findOne().startTime == null){
                    id = Games.findOne()._id;
                    Games.update({_id: id}, {$set: {startTime: time}});
                }else {
                    startTime = Games.findOne().startTime;
                    timeLeft = clockTime - (time - startTime);
                }
                if(timeLeft % 10 == 0){
                    Meteor.call("updatePicture", 6 - Math.floor(timeLeft / 10), function(error, result){});
                }
                Session.set("time", timeLeft);
                Games.update({_id: Session.get("gameId")}, {$set: {timeLeft: timeLeft}});
                if (timeLeft <= 0){
                    clearInterval(timeCountDown);
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
        gameId = Session.get("gameId")
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
        gameId = Session.get("gameId")
        if(Games.findOne({_id: gameId}) != null){
            return Games.findOne({_id: gameId}).timeLeft;
        }
    },
    imageUrl: function() {
        if (Games.findOne() != null){
            return Games.findOne().imageUrl;
        }
    }
});