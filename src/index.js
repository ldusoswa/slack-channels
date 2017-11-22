require('dotenv').config();

const DEFAULT_TIMEOUT = 1800000;
const TOKEN = process.env.SLACK_TOKEN || '';

let WebClient = require('@slack/client').WebClient;
let _ = require('lodash');
let express = require('express');

let web = new WebClient(TOKEN);
let app = express();

app.get('/', (req, res) => {
    res.send('<h2>The Channel Monitor App</h2>');
});

/*
 * Endpoint to receive events from Slack's Events API.
 * Handles:
 *   - url_verification: Returns challenge token sent when present.
 *   - event_callback: Confirm verification token & handle `channel_create`
 *     and `channel_rename` events.
 */
app.post('/events', (req, res) => {
    switch (req.body.type) {
        case 'url_verification': {
            res.status(200).send({challenge: req.body.challenge});
            break;
        }

        case 'event_callback': {
            if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
                res.send('');
                const event = req.body.event;
                if (event.type === 'channel_created' || event.type === 'channel_rename') {
                    const channel = event.channel;
                    console.log(channel);
                    //channelTemplate.findOrNotify(channel);
                }
            } else {
                res.sendStatus(500);
            }
            break;
        }
        default:
            res.sendStatus(500);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}!`);
});
