const { google } = require('googleapis');
const path = require('path');

// Setup auth using the downloaded service account file
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function writeToSheet(matches) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '18aKLv2ZS4fMuwzCZq46Ngb9yzxo-RtIqeuo47gSX9H8'; // TODO: Replace with your real Sheet ID
  const range = 'Matches!A2'; // Assumes row 1 has headers

  const values = matches.map(item => [
    item.checkIn,
    item.nights,
    item.resort,
    item.roomType,
    item.sleeps,
    item.price,
    item.status,
    item.link
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  console.log(`✅ Wrote ${values.length} listings to Google Sheet`);
}

module.exports = { writeToSheet };
