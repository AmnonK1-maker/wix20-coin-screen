// Wix 20 selfie upload — Google Apps Script web app (deploy: execute as me, access: anyone in wix.com).
// Saves "<email> <time>.jpg" into the Google Form's selfie folder, so the Mac (people/sync.mjs) picks it up
// exactly like a form upload and matches the person by the email in the file name.
var FOLDER_ID = 'PUT-DRIVE-FOLDER-ID';   // Drive folder: "סלפי שלך … (File responses)"
var FORM_URL = 'PUT-GOOGLE-FORM-URL';

function doGet() {
  var t = HtmlService.createTemplateFromFile('index');
  t.email = Session.getActiveUser().getEmail();
  t.formUrl = FORM_URL;
  return t.evaluate().setTitle('Wix 20 – Make your mark')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

function saveSelfie(dataUrl, consent) {
  var email = Session.getActiveUser().getEmail();
  if (!email) throw new Error('Please sign in with your Wix account');
  if (!consent) throw new Error('Please agree to show it on the screen');
  var m = /^data:image\/jpeg;base64,(.+)$/.exec(dataUrl || '');
  if (!m) throw new Error('The photo did not arrive, please try again');
  var bytes = Utilities.base64Decode(m[1]);
  if (bytes.length > 8 * 1024 * 1024) throw new Error('The photo is too large');
  var stamp = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'yyyy-MM-dd HH-mm-ss');
  DriveApp.getFolderById(FOLDER_ID).createFile(Utilities.newBlob(bytes, 'image/jpeg', email + ' ' + stamp + '.jpg'));
  return { ok: true };
}
