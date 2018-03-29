const when = require('when');
module.exports = {
    processMessage: processMessage,
};

function processMessage(event) {
    return when.resolve({
        text: 'Helloooooo',
    });
}