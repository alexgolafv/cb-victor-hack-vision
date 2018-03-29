const { RTMClient }  = require('@slack/client');
require('dotenv').config();
const interpreter = require('./messages-interpreter');

const slack_oauth= process.env.SLACK_OAUTH;

const rtm = new RTMClient(slack_oauth);
rtm.start();

let channel;
rtm.on('authenticated', (rtmStartData) => {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on('message', function (event) {
    return interpreter.processMessage().then((res) => {
        return rtm.sendMessage(res.text, event.channel).then((res) => {
            console.log('Message sent: ', res.ts);
        })
    }).catch(console.error);
});