const { google } = require("googleapis");
const { Readable } = require("stream");

// Set the service account credentials file path in .env:
// GOOGLE_APPLICATION_CREDENTIALS=./config/service-account.json
// GOOGLE_DRIVE_FOLDER_ID=<ID of the folder shared with the service account>

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// file: comes from multer's memory storage as { buffer, originalname, mimetype }
async function uploadFileToDrive(file) {
  const response = await drive.files.create({
    requestBody: {
      name: `${Date.now()}-${file.originalname}`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: file.mimetype,
      body: bufferToStream(file.buffer),
    },
    fields: "id",
  });

  const fileId = response.data.id;

  // Grant "anyone with the link" access so it can be opened from the link
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  const fileData = await drive.files.get({
    fileId,
    fields: "webViewLink, webContentLink",
  });

  return {
    driveFileId: fileId,
    fileUrl: fileData.data.webViewLink,
  };
}

async function deleteFileFromDrive(fileId) {
  await drive.files.delete({ fileId });
}

module.exports = { uploadFileToDrive, deleteFileFromDrive };