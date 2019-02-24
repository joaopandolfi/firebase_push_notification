const moment = require('moment');
const admin = require('firebase-admin');

const Notification = {};

Notification.save = (userPushId, pTitle, pText) => {
  const db = admin.database();
  let ref = db.ref(`/root/userNotifications/${userPushId}`);
  ref.push({
    date: moment().format('DD/MM/YYYY'),
    read: false,
    text: pText,
    title: pTitle,
  });

  ref = db.ref(`/root/userDevice/${userPushId}`);
  return ref.once('value')
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const userDeviceArr = childSnapshot.val();
        const cBadge = userDeviceArr.badge ? userDeviceArr.badge + 1 : 1;
        childSnapshot.ref.update({ badge: cBadge });
      });
    });
};

module.exports = Notification;
