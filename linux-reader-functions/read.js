import functions from '@google-cloud/functions-framework';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getStorage, ref, getDownloadURL} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "linux-reader.firebaseapp.com",
  projectId: "linux-reader",
  storageBucket: "linux-reader.firebasestorage.app",
  messagingSenderId: "26517360277",
  appId: "1:26517360277:web:bb77017d427c4d9b82559c"
};

functions.http('helloHttp', async(req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  // get req
  let reqJson = {}
  try {
    reqJson = JSON.parse(req.body);
  } catch (e) {
    console.error(e);
  }
  const fullPath = reqJson.fullPath;
  if (!fullPath) {
    const response = JSON.stringify({status: "Failed1"});
    res.send(response);
    return;
  }
  // storage
  const storageRef = ref(storage, fullPath);
  let downloadUrl = "";
  let response = "{}";
  try {
    await getDownloadURL(storageRef).then((url) => {
      downloadUrl = url;
    });
    response = JSON.stringify({ status: "OK", downloadUrl });
  } catch (e) {
    console.error(e);
    response = JSON.stringify({ status: "Failed2" });
  }
  res.send(response);
  // res.send(`Hello ${req.query.name || req.body.name || 'World'}!`);
});
