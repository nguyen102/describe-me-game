import './game.html';
Games = new Meteor.Collection("games");
Scores = new Meteor.Collection("scores");
WordHistory = new Meteor.Collection("word_history");
Messages = new Meteor.Collection("messages");

Template.game.onCreated(function gameOnCreated() {
    Meteor.subscribe("games");
    Meteor.subscribe("scores");
    Meteor.subscribe("word_history");
    Meteor.subscribe("messages");
});

Template.game.events({
    'click #answer-button': function (e) {
        _sendMessage();
        _updateScore();
        _resetAnswerBox();
    },
    'keyup #answer-box': function (e) {
        if (e.type == "keyup" && e.which == 13) {
            _sendMessage();
            _updateScore();
            _resetAnswerBox();
        }
    }
});

_updateScore = function() {
    var currentScore = Scores.findOne({name: "game1"}).score;
    var id = Scores.findOne({name: "game1"})._id;
    var lastEnteredWord = Messages.findOne({}, {sort: {ts:-1},limit: 1}).msg;

    var otherUserName;
    if ( Meteor.user().username == "tim") {
        otherUserName = "joo";
    } else {
        otherUserName = "tim";
    }

    otherUser = WordHistory.findOne({name: otherUserName});
    if (otherUser == null) {
        WordHistory.insert({name:  otherUserName, words: []});
    }
    var otherUserWords = WordHistory.findOne({name: otherUserName}).words;
    for(var i = 0; i < otherUserWords.length; i++){
        if(lastEnteredWord == otherUserWords[i]) {
            _removeWordFromWordHistory(lastEnteredWord, Meteor.user().username);
            _removeWordFromWordHistory(lastEnteredWord, otherUserName);
            currentScore += 1;
        }
    }

    Scores.update({_id: id}, {$set:{score: currentScore }});
};

_removeWordFromWordHistory = function(word, userName){
    var id = WordHistory.findOne({name: userName})._id;
    var words = WordHistory.findOne({name: userName}).words;
    var index = words.indexOf(word);
    if (index > - 1) {
        words.splice(index, 1);
    }
    WordHistory.update({_id: id}, {$set: {words: words}});
};



_sendMessage = function () {
    var answerBox = document.getElementById("answer-box");
    Messages.insert({user: Meteor.user().username, msg: answerBox.value, ts: new Date()});
    _addToWordHistory(Meteor.user().username, answerBox.value);
};

_addToWordHistory = function(username, word) {
    user = WordHistory.findOne({name: username});
    if (user == null) {
        WordHistory.insert({name:  Meteor.user().username, words: []});
    }
    var words = WordHistory.findOne({name: Meteor.user().username}).words;
    if (!_isInArray(word, words)){
        var id = WordHistory.findOne({name: Meteor.user().username})._id;
        words.push(word);
        WordHistory.update({_id: id}, {$set: {words: words}});
    }
};

_isInArray = function(value, array) {
    return array.indexOf(value) > -1;
};

_resetAnswerBox = function() {
    var answerBox = document.getElementById("answer-box");
    answerBox.value = "";
    answerBox.focus();
};

Template.game.helpers({
    sessionId: '',
    started: true,
    score: function() {
        if (Scores.findOne() != null) {
            return Scores.findOne({name: "game1"}).score;
        }
    },
    timeLeft: 10,
    imageUrl: function() {
        if (Games.findOne() != null){
            return Games.findOne().imageUrl;
        }
    }
});