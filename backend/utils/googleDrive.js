// utils/googleDrive.js
const { google } = require("googleapis");
const { Readable } = require("stream");
const Admin = require("../models/Admin");

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// state = the admin's existing JWT (already signed & verifiable) - carries identity through the redirect
function getAuthUrl(state) {
  const oauth2Client = getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    state,
  });
}

async function exchangeCodeForTokens(code) {
  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

async function getDriveClientForAdmin(adminId) {
  const admin = await Admin.findById(adminId).select("googleDrive");
  if (!admin?.googleDrive?.connected || !admin.googleDrive.refreshToken) {
    const err = new Error("Google Drive is not connected for this admin");
    err.code = "DRIVE_NOT_CONNECTED";
    throw err;
  }
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({ refresh_token: admin.googleDrive.refreshToken });
  return google.drive({ version: "v3", auth: oauth2Client });
}

async function uploadFileToDrive(file, adminId) {
  const drive = await getDriveClientForAdmin(adminId);
  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);

  const { data: created } = await drive.files.create({
    requestBody: { name: file.originalname },
    media: { mimeType: file.mimetype, body: bufferStream },
    fields: "id",
  });

  await drive.permissions.create({
    fileId: created.id,
    requestBody: { role: "reader", type: "anyone" },
  });

  const { data: fresh } = await drive.files.get({
    fileId: created.id,
    fields: "webViewLink",
  });

  return { driveFileId: created.id, fileUrl: fresh.webViewLink };
}

async function deleteFileFromDrive(driveFileId, adminId) {
  const drive = await getDriveClientForAdmin(adminId);
  await drive.files.delete({ fileId: driveFileId });
}

module.exports = { getAuthUrl, exchangeCodeForTokens, uploadFileToDrive, deleteFileFromDrive };