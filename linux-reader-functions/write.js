import functions from '@google-cloud/functions-framework';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getStorage, ref, uploadString} from "firebase/storage";
// File: helloAlgolia.mjs
import { algoliasearch } from "algoliasearch";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "linux-reader.firebaseapp.com",
  projectId: "linux-reader",
  storageBucket: "linux-reader.firebasestorage.app",
  messagingSenderId: "26517360277",
  appId: "1:26517360277:web:bb77017d427c4d9b82559c"
};

const appID = process.env.ALGOLIA_APP_ID;
// API key with `addObject` and `editSettings` ACL
const algoliaWriteApiKey = process.env.ALGOLIA_WRITE_API_KEY;
const indexName = "linux_reader";

const hexSeed = "0123456789abcdef";

function generateHexString() {
    let result = "";
    for(let i = 0; i < 24; i++) {
        const hexValue = Math.floor(Math.random() * 16);
        result += hexSeed[hexValue];
    }
    return result;
}

functions.http('helloHttp', async(req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    // get req
    let reqJson = {}
    try {
        reqJson = JSON.parse(req.body);
    } catch(e) {
        console.error(e);
    }
    const fileNameHex = generateHexString();
    const json = reqJson.json;
    let description = reqJson.description ?? "";
    let rootPath = reqJson.rootPath;
    if (!json || !rootPath) {
        const response = JSON.stringify({status: "Failed1"});
        res.send(response)
        return;
    }
    if (rootPath.endsWith("/")) {
        rootPath = rootPath.slice(0, -1);
    }
    // 万が一フロントで置換していない場合のために加える
    const rootPathReplaceRegex = new RegExp(`"${rootPath}`, "g");
    if (!json.includes(`"${rootPath}`)) {
        const response = JSON.stringify({status: "Failed2"});
        res.send(response)
        return;
    }
    const replacedJson = json.replace(rootPathReplaceRegex, '"');
    const refName = `${fileNameHex}.json`;
    // upload
    const storageRef = ref(storage, refName);
    let response = "{}";
    try {
        const parsedJson = JSON.parse(replacedJson);
        const purpose = parsedJson.purpose;
        if (!purpose) {
            response = JSON.parse({status: "Failed3"});
            res.send(response);
            return;
        }
        if (!description) {
            description = purpose;
        }
        let status = "Failed"
        let fullPath = ""
        await uploadString(storageRef, replacedJson).then(async(snapshot) => {
            fullPath = snapshot.metadata.fullPath;
            const client = algoliasearch(appID, algoliaWriteApiKey);
            const record = {content: parsedJson, fullPath, description, objectID: fileNameHex};
            const {taskID} = await client.saveObject({
                indexName,
                body: record
            });
            if (taskID) status = "OK";
        });
        response = JSON.parse({status, fullPath});
    } catch(e) {
        console.error(e);
        response = JSON.stringify({status: "Failed4"});
    }
    res.send(response);
})