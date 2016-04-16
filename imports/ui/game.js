import './game.html';
import './lib/lib.js';


clockTime = 60;
timePerPicture = 10;

Template.game.onCreated(function gameOnCreated() {

    Meteor.subscribe("games");

    Meteor.call('joinGame', Meteor.userId(), Meteor.user().username, function(error, gameId){
        Session.set("gameId", gameId);
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
    },
    'click #start-button': function (e) {
        _readyToStart();
    }
});

Template.game.helpers({
    sessionId: '',
    started: function() {
        var gameId = Session.get("gameId");
        if(Games.findOne({_id: gameId}) != null){
            _startTimer();
            return Games.findOne({_id: gameId}).started;
        }
    },
    score: function() {
        if (Games.findOne({_id: Session.get("gameId")})){
            return Games.findOne({_id: Session.get("gameId")}).score;
        }
    },
    timeLeft: function() {
        // var gameId = Session.get("gameId");
        // if(Games.findOne({_id: gameId}) != null){
        //     return Games.findOne({_id: gameId}).timeLeft;
        // }else{
        //     return clockTime;
        // }
        return Session.get("time");
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
    },
    playerReady: function() {
        var gameId = Session.get("gameId");
        if(Games.findOne({_id: gameId}) != null){
            return _playerReady(Games.findOne(Session.get("gameId")));
        }
    },
    opposingPlayerFound: function() {
        var gameId = Session.get("gameId");
        if(Games.findOne({_id: gameId}) != null){
            return _opposingPlayerFound(Games.findOne(Session.get("gameId")));
        }
    }
});