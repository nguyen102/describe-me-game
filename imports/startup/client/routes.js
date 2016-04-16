import '/client/main.html';

import '/imports/ui/game.js';
import '/imports/ui/intro.html';

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