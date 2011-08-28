var xmpp = require('node-xmpp');
var random = require('node-random');

/**
 * @param cl object xmpp.Client() object
 * @param from string source jid
 * @param msg string the message, body tags should be removed
 */
function run_command(cl, from, msg) {
    // basically the command has to be at the beginning of the message (hence
    // the index 0) and then process the command
    if (msg.indexOf('help') == 0) {
        var resp = '';
        resp += "Here are the available commands:\n";
        resp += "echo message - repeats what you say\n";
        resp += "random - returns a random 32 character string from random.org\n";
        
        send_response(cl, from, resp)
    }
    else if (msg.toLowerCase().indexOf('echo ') == 0) {
        // remove echo part and send it off
        send_response(cl, from, msg.substr(5));
    }
    else if (msg.toLowerCase().indexOf('random') == 0) {
        // get a random string
        // need to get 2 items 16 characters long since I can't get a single 32 character string
        function randomCallback(str){
            send_response(cl, from, str.join(''));
        }
        var options = {
            secure: true,
            num: 2,
            length: 16
        };
        function randomErrorCallback(type, code, string) {
            console.error("RANDOM.ORG Error: Type: "+type+", Status Code: "+code+", Response Data: "+string);
        }
        random.generateStrings(randomCallback, options, randomErrorCallback);
    }
    else {
        // unknown command
        send_response(cl, from, 'Unknown command, send help for more info');
    }
}

/**
 * @param cl object xmpp.Client() object
 * @param to string recipient of message
 * @param msg string response to send to recipient
 */
function send_response(cl, to, msg) {
    cl.send(new xmpp.Element('message', { to: to, type: 'chat' }).
        c('body').t(msg));
}

exports.run_command = run_command;
