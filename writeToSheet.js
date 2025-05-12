const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function writeToSheet(matches, sheetName) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '18aKLv2ZS4fMuwzCZq46Ngb9yzxo-RtIqeuo47gSX9H8';
  if (!sheetName) throw new Error('Missing sheetName for writeToSheet');
  const range = `${sheetName}!A2`;

  const values = matches.map(item => [
    item.checkIn,
    item.nights,
    item.resort,
    item.roomType,
    item.sleeps,
    item.price,
    item.status,
    item.link,
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  console.log(`✅ Wrote ${values.length} listings to sheet tab "${sheetName}"`);
}

module.exports = { writeToSheet };
