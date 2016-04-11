_getOpposingPlayerWordList = function(game) {
    if (Meteor.userId() == game.player1) {
        return game.player2WordList
    } else {
        return game.player1WordList;
    }
};

_getSelfWordList = function(game, userType){
    if (userType == "player1"){
        return game.player1WordList;
    } else {
        return game.player2WordList;
    }
};

_setWordListUsingUserId = function(game) {
    if (Meteor.userId() == game.player1) {
        return game.player1WordList;
    } else {
        return game.player2WordList;
    }
};

_setSelfWordListFromId = function(game, words) {
    if (Meteor.userId() == game.player1) {
        Games.update({_id: Session.get("gameId")}, {$set: {player1WordList: words}});
    } else {
        Games.update({_id: Session.get("gameId")}, {$set: {player2WordList: words}});
    }
};

_setWordList = function(userType, wordList) {
    if(userType == "player1"){
        Games.update({_id: Session.get("gameId")}, {$set: {player1WordList: wordList}});
    }else {
        Games.update({_id: Session.get("gameId")}, {$set: {player2WordList: wordList}});
    }
};

_addToMatchingWords = function(game, word) {
    var matchingWords = game.matchingWords;
    matchingWords.push(word);
    Games.update({_id: Session.get("gameId")}, {$set: {matchingWords: matchingWords}});
}; 
