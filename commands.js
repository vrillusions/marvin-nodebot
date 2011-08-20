var xmpp = require('node-xmpp');

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
        
        send_response(cl, from, resp)
    }
    else if (msg.indexOf('delay') == 0) {
        // Use for testing on non-blocking IO
        do_delay(cl, from);
    }
    else if (msg.indexOf('echo ') == 0) {
        // remove echo part and send it off
        send_response(cl, from, msg.substr(5));
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

function do_delay(cl, from) {
    function sleep(milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds);
    }
    
    send_response(cl, from, 'Sleeping for 15 seconds');
    sleep(15000);
    send_response(cl, from, 'Done.');
}
exports.run_command = run_command;
