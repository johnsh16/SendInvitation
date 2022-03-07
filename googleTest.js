const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
const TOKEN_PATH = 'token.json'

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    authorize(JSON.parse(content), listEvents)
})

function authorize(credentials, callback) {
    const {private_key, client_id, auth_uri} = credentials;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, private_key, auth_uri
    )

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback)
        oAuth2Client.setCredentials(JSON.parse(token))
        callback(oAuth2Client)  
    })
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err)
            oAuth2Client.setCredentials(token)

            fs.writeFile(TOKEN_PATH, JSON.stringify(token, (err) => {
                if (err) return console.error(err)
                console.log('Token stored to', TOKEN_PATH)
            }))
            callback(oAuth2Client)
        })
    })
}

function listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth})
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',       
    }, (err, res) => {
        if (err) return console.log('The API returned an error:' + err)
        const events = res.data.items
        if (events.length) {
            console.log('Upcoming 10 events:')
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date
                console.log(`${start} - ${event.summary}`)
            })
        } else {
            console.log('No upcoming events found.')
        }
    })
}