/**
 * My marvin bot as a node.js app
 */

var sys = require('sys');
var xmpp = require('node-xmpp');
// WAIT TILL I NEED IT - var argv = process.argv;
var config = require('./config.js');

var bot = new xmpp.Client({ jid: config.xmpp.jid, password: config.xmpp.password });

function debug(msg) {
    // Eventually this will be optional but not right now
    sys.puts(msg);
}

bot.on('online', function() {
    bot.send(new xmpp.Element('presence', { }).
        c('show').t('chat').up().
        c('status').t('Send me commands or help for info')
        );
});

bot.on('stanza', function(stanza) {
    debug(stanza);
    // Handle subscribe requests
    if (stanza.is('presence') && stanza.attrs.type == 'subscribe') {
        debug('Subscription request from: ' + stanza.attrs.from);
        stanza.attrs.to = stanza.attrs.from;
        delete stanza.attrs.from;
        // Tell them they're subscribed
        stanza.attrs.type = 'subscribed';
        bot.send(stanza);
        // Then request subscription
        // TODO: don't let them talk to us if they won't subscribe to us
        stanza.attrs.type = 'subscribe';
        bot.send(stanza);
    }
    // Handle unsubscribe requests
    if (stanza.is('presence') && stanza.attrs.type == 'unsubscribe') {
        debug('Unsubscribe request from: ' + stanza.attrs.from);
        stanza.attrs.to = stanza.attrs.from;
        delete stanza.attrs.from;
        // Tell them they're unsubscribed
        stanza.attrs.type = 'unsubscribed';
        bot.send(stanza);
        // Then request removal
        stanza.attrs.type = 'unsubscribe';
        bot.send(stanza);
    }
    if (stanza.is('message') &&
            // Important: never reply to errors!
            stanza.attrs.type !== 'error') {
        /*
        // Swap addresses...
        stanza.attrs.to = stanza.attrs.from;
        delete stanza.attrs.from;
	    // and send back.
	    cl.send(stanza);
        */
	}
});

bot.on('error', function(e) {
    sys.puts(e);
});