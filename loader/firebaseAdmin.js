const admin = require('firebase-admin');
const serviceAccountKey = require('../constants/serviceAccountKey');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});
