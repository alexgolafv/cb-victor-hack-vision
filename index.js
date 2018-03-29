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
    const sendMsg = (text) => {
        return rtm.sendMessage(text, event.channel).then((res) => {
            console.log('Message sent: ', res.ts);
        });
    }

    return interpreter.processMessage(event, sendMsg).then((res) => {
        return sendMsg(res.text);
    }).catch(console.error);
});

rtm.on('reaction_added', (event) => {
    // For structure of `event`, see https://api.slack.com/events/reaction_added
    console.log(`User ${event.user} reacted with ${event.reaction}`);
  });
  