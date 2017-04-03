'use strict';

const GreetingsTpl = require('./templates/greetings.html');
const Marionette = require('backbone.marionette');

require('sass/greetings.scss');

let GreetingsView = Marionette.View.extend({
    tagName: 'div',
    className: 'greetings-container',
    template: GreetingsTpl,
    templateContext: function() {
        return {
            greetings: this.getOption('greetings')
        };
    },
    events: {
        'click #go': 'go'
    },
    go: function(e) {
        e.preventDefault();
        this.trigger('greetings:continue');
    }

});

module.exports = GreetingsView;
