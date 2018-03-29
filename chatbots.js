/* chatbots.js */
'use strict';
const Botkit       = require('botkit');
// use the tokens you got from the previous step
const slack_oauth= 'xoxb-337441105504-URrHFrFXjJJwhmuLZWQRby97';
const slack_token    = 'xoxp-339213669079-337438635616-338292547413-429725eb274a798decdaa3c9de435059';
exports.fn = {
  /**
   * Starts Slack-Bot
   *
   * @returns {*}
   */
  slackBot() {
    // initialisation
    const slackController = Botkit.slackbot({
      // optional: wait for a confirmation events for each outgoing message before continuing to the next message in a conversation
      require_delivery: true
    });
    const slackBot = slackController.spawn({
      token: slack_token
    });
    // create rtm connection
    slackBot.startRTM((err, bot, payload) => {
      if (err) {
        throw new Error('Could not connect to Slack');
      }
      slackController.log('Slack connection established.');
    });
    // listener that handles incoming messages
    slackController.hears(['.*'], ['direct_message', 'direct_mention'], (bot, message) => {
      slackController.log('Slack message received');
      bot.reply('I have received your message!')
    });
  }
};