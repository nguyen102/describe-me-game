// function _updateScore() {
//     var currentScore = Scores.findOne({name: "game1"}).score;
//     var id = Scores.findOne({name: "game1"})._id;
//
//     var otherUserName;
//     if ( Meteor.user().username == "tim") {
//         otherUserName = "joo";
//     } else {
//         otherUserName = "tim";
//     }
//
//     otherUser = WordHistory.findOne({name: otherUserName});
//     if (otherUser == null) {
//         WordHistory.insert({name:  otherUserName, words: []});
//     }
//     var otherUserWords = WordHistory.findOne({name: otherUserName}).words;
//     for(var i = 0; i < otherUserWords.length; i++){
//         if(lastEnteredWord == otherUserWords[i]) {
//             _removeWordFromWordHistory(lastEnteredWord, Meteor.user().username);
//             _removeWordFromWordHistory(lastEnteredWord, otherUserName);
//             currentScore += 10;
//         }
//     }
//
//     Scores.update({_id: id}, {$set:{score: currentScore }});
// };
_updateScore = function() {
    var currentScore = Games.findOne({_id: Session.get("gameId")}).score;
    console.log("Current score is: " + currentScore);

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
            currentScore += 10;
        }
    }

    Games.update({_id: Session.get("gameId")}, {$set:{score: currentScore }});
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



_sendWord = function () {
    var answerBox = document.getElementById("answer-box");
    lastEnteredWord = answerBox.value;
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

_isInArray = function (value, array) {
    return array.indexOf(value) > -1;
};

_resetAnswerBox = function() {
    var answerBox = document.getElementById("answer-box");
    answerBox.value = "";
    answerBox.focus();
};