const { RTMClient }  = require('@slack/client');

const slack_oauth= 'xoxb-337441105504-URrHFrFXjJJwhmuLZWQRby97';
const slack_token    = 'xoxp-339213669079-337438635616-338292547413-429725eb274a798decdaa3c9de435059';

const rtm = new RTMClient(slack_oauth);
rtm.start();

let channel;
rtm.on('authenticated', (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='general') { channel = c.id }
    }
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on('message', function () {
    rtm.sendMessage("Hello!", conversationId)  .then((res) => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
});