const https = require("https");
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


/**
 * Trigger para avisar a API quando o susuário abre a mensagem
 * @receive messageID (Id da mensagem)
 * @receive pushID (PushId do usuário)
 * @receive time (Timestap)
 * @return nothing
 */
exports.triggerPushOpened = functions.database.ref('/root/PushClicked/{pushId}')
  .onWrite((snapshot, event) => {
    const fdata = snapshot.val();
    const callUrl = `https://.../clicked?messageId=${fdata.messageID}&pushId=${fdata.pushID}&time=${time}`;
    https.get(callUrl, (res) => {
      if (res.statusCode === 404) return new Error({message: 404 });

      let response = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response += chunk;
      });

      res.on('end', (e) => {
        console.log(`[Debug]-Trigger:: ${fdata.pushID} Clicked item ${fdata.messageID} at ${fdata.time}`);
      });
    }).on('error', (e) => {
      console.log(`[Debug]-Trigger:: ${e.message}`);
    });
    return true;
  });
