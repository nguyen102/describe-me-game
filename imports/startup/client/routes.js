import '/client/main.html';

import '/imports/ui/game.js';
import '/imports/ui/intro.html';
import '/imports/ui/leaderboard.js';
import '/imports/ui/history.js';

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'intro',
    template: 'intro'
});

Router.route('/game', {
    name: 'game',
    template: 'game'
});

Router.route('/leaderboard', {
    name: 'leaderboard',
    template: 'leaderboard'
});

Router.route('/history', {
    name: 'history',
    template: 'history'
});