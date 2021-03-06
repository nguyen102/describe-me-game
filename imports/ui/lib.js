import './helperFunctions.js';

_updateScore = function() {
    var game = Games.findOne({_id: Session.get("gameId")});
    var currentScore = game.score;

    var otherUserWords = _getOpposingPlayerWordList(game);
    for(var i = 0; i < otherUserWords.length; i++){
        if(lastEnteredWord == otherUserWords[i]) {
            _removeWordFromWordHistory(game, lastEnteredWord);
            _addToMatchingWords(game, lastEnteredWord);
            currentScore += 10;
        }
    }

    Games.update({_id: Session.get("gameId")}, {$set:{score: currentScore }});
};

_removeWordFromWordHistory = function(game, word){
    ["player1", "player2"].forEach(function(userType){
        var wordList = _getSelfWordList(game, userType);
        var index = wordList.indexOf(word);
        if (index > - 1) {
            wordList.splice(index, 1);
        }
        _setWordList(userType, wordList);
    });
};  

_sendWord = function () {
    var game = Games.findOne({_id: Session.get("gameId")});
    var answerBox = document.getElementById("answer-box");
    lastEnteredWord = answerBox.value;
    if (! _isInArray(lastEnteredWord, game.matchingWords) && ! _isInArray(lastEnteredWord, _getSelfWordListUsingUserId(game))){
        _addToWordHistory(answerBox.value);
    }
};

_addToWordHistory = function(word) {
    var game = Games.findOne({_id: Session.get("gameId")});
    var words = _setWordListUsingUserId(game);
    if (!_isInArray(word, words)){
        words.push(word);
        _setSelfWordListFromId(game, words);
    }
};

_isInArray = function (value, array) {
    return array.indexOf(value) > -1;
};

_resetAnswerBox = function() {
    var answerBox = document.getElementById("answer-box");
    answerBox.value = "";
    answerBox.focus();
};

_opposingPlayerUserName = function(game) {
    if (Meteor.userId() == game.player1) {
        return game.user2Name;
    }else {
        return game.user1Name;
    }
};

_opposingPlayerFound = function(game) {
    return game.player1 && game.player2;
};

_playerReady = function(game) {
    if (Meteor.userId() == game.player1) {
        return game.player1Ready;
    }else {
        return game.player2Ready;
    }
};


//If both user type a word at the same time, Meteor will not report the matching word because the DB update for
//both the client won't recieve the updated words fast enough
_lookForWordsThatMightHaveBeenMissed = function(){
    var game = Games.findOne({_id: Session.get("gameId")});
    var matchingElements = _getMatchingElements(game.player1WordList, game.player2WordList);
    var previouslyMatchedWords = game.matchingWords;
    var newMatchedWords = previouslyMatchedWords;
    matchingElements.forEach(function(element){
        if (! _isInArray(element, previouslyMatchedWords)){
            newMatchedWords.push(element);
        }
    });
    Games.update({_id: game._id}, {$set: {matchingWords: newMatchedWords}});
    Games.update({_id: game._id}, {$set: {score: newMatchedWords.length * 10}});
};

_getMatchingElements = function(wordListA, wordListB) {
    var ret = [];
    for(var i in wordListB) {
        if(wordListA.indexOf( wordListB[i] ) > -1){
            ret.push(wordListB[i]);
        }
    }
    return ret;
};

_readyToStart = function() {
    var game = Games.findOne({_id: Session.get("gameId")});
    var gameId = Session.get("gameId");
    if (Meteor.userId() == game.player1) {
        Games.update({_id: gameId}, {$set: {player1Ready: true}});
    } else {
        Games.update({_id: gameId}, {$set: {player2Ready: true}});
    }
    game = Games.findOne({_id: Session.get("gameId")});
    if (game.player1Ready && game.player2Ready){
        Games.update({_id: gameId}, {$set: {started: true}});
        Games.update({_id: gameId}, {$set: {startTime: Math.floor(new Date().getTime() / 1000)}});
        _startTimer();
    }
};

_startTimer = function() {
    if (Games.findOne({_id: Session.get("gameId")})){
        var timeCountDown = setInterval(function(){
            var date = new Date();
            var time = Math.floor(date.getTime() / 1000);
            var startTime = Games.findOne({_id: Session.get("gameId")}).startTime;
            var timeLeft = clockTime - (time - startTime);
            if(timeLeft % timePerPicture == 0){
                Meteor.call("updatePicture", Session.get("gameId"), 6 - Math.floor(timeLeft / 10), function(error, result){});
            }
            if(timeLeft >= 0 ){
                // Games.update({_id: Session.get("gameId")}, {$set: {timeLeft: timeLeft}});
                Session.set("time", timeLeft);
            }
            if (timeLeft <= 0){
                clearInterval(timeCountDown);
                Games.update({_id: Session.get("gameId")}, {$set: {done: true}});
                _lookForWordsThatMightHaveBeenMissed();
            }
        }, 1000);
    }
};
//TODO Use this instead of if statement player1 player2
//http://stackoverflow.com/questions/17362401/how-to-set-mongo-field-from-variable

//TODO export methods properly
//http://stackoverflow.com/questions/16534363/call-functions-from-separate-files-with-meteor
//Shwaydogg answer
