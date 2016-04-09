_updateScore = function() {
    var game = Games.findOne({_id: Session.get("gameId")});
    var currentScore = game.score;

    var otherUserWords = "";
    if (Meteor.userId() == game.player1) {
        otherUserWords = game.player2WordList
    } else {
        otherUserWords = game.player1WordList;
    }
    for(var i = 0; i < otherUserWords.length; i++){
        if(lastEnteredWord == otherUserWords[i]) {
            _removeWordFromWordHistory(lastEnteredWord, "player1");
            _removeWordFromWordHistory(lastEnteredWord, "player2");
            currentScore += 10;
        }
    }

    Games.update({_id: Session.get("gameId")}, {$set:{score: currentScore }});
};


_removeWordFromWordHistory = function(word, userType){
    var game = Games.findOne({_id: Session.get("gameId")});
    var wordList = "";
    if (userType == "player1"){
        wordList = game.player1WordList;
    } else {
        wordList = game.player2WordList;
    }
    var index = wordList.indexOf(word);
    if (index > - 1) {
        wordList.splice(index, 1);
    }
    if(userType == "player1"){
        Games.update({_id: Session.get("gameId")}, {$set: {player1WordList: wordList}});
    }else {
        Games.update({_id: Session.get("gameId")}, {$set: {player2WordList: wordList}});
    }
};



_sendWord = function () {
    var answerBox = document.getElementById("answer-box");
    lastEnteredWord = answerBox.value;
    _addToWordHistory(answerBox.value);
};

_addToWordHistory = function(word) {
    var game = Games.findOne({_id: Session.get("gameId")});
    var words;
    if (Meteor.userId() == game.player1) {
        words = game.player1WordList;
    } else {
        words = game.player2WordList;
    }
    if (!_isInArray(word, words)){
        words.push(word);
        if (Meteor.userId() == game.player1) {
            Games.update({_id: Session.get("gameId")}, {$set: {player1WordList: words}});
        } else {
            Games.update({_id: Session.get("gameId")}, {$set: {player2WordList: words}});
        }
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

//TODO Use this instead of if statement player1 player2
//http://stackoverflow.com/questions/17362401/how-to-set-mongo-field-from-variable
