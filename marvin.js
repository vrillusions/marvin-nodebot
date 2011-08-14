/**
 * My marvin bot as a node.js app
 */

var sys = require('sys');
var xmpp = require('node-xmpp');
// WAIT TILL I NEED IT - var argv = process.argv;
var config = require('./config.js');

sys.puts('JID: ' + config.xmpp.jid);
sys.puts('Password: ' + config.xmpp.password);