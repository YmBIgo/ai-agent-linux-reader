import fs from "fs/promises";

const jsonPaths = [
    "/Users/coffeecup/Documents/open_source/linux/json/schduler_choices_1749346625590.json",
    "/Users/coffeecup/Documents/open_source/linux/json/fork_choices_1749374886304.json",
    "/Users/coffeecup/Documents/open_source/linux/json/gemini_scheduler_1749381116025.json"
];

const rootPath = "/Users/coffeecup/Documents/open_source/linux/";

// indexer : https://linux-reader-indexer-216690996383.asia-northeast1.run.app
// searcher : https://linux-reader-searcher-216690996383.asia-northeast1.run.app
// getter  : https://linux-reader-getter-216690996383.asia-northeast1.run.app

async function writeThroughtFunction(jsonPath, rootPath, description) {
    const json = await fs.readFile(jsonPath, "utf8");
    const response = await fetch("https://linux-reader-indexer-216690996383.asia-northeast1.run.app", {
        method: "POST",
        body: JSON.stringify({
            json,
            rootPath,
            description
        })
    });
    const result = await response.json();
    console.log(result);
    // status: string, fullPath: string;
}

// jsonPaths.forEach((j) => {
//     try {
//         writeThroughtFunction(j, rootPath, "");
//     } catch(e) {
//         console.error(e);
//     }
// })

async function searchThroughtFunction(search) {
    const response = await fetch("https://linux-reader-searcher-216690996383.asia-northeast1.run.app", {
        method: "POST",
        body: JSON.stringify({
            search
        })
    });
    const result = await response.json();
    console.log(result);
    // status: string, result: [{fullPath: string, objectID: string, hightlights: string}]
}

// searchThroughtFunction("Linux")

async function getThroughtFunction(fullPath) {
    const response = await fetch("https://linux-reader-getter-216690996383.asia-northeast1.run.app", {
        method: "POST",
        body: JSON.stringify({
            fullPath
        })
    });
    const result = await response.json();
    console.log(result);
    // status: string, downloadUrl: string
}

// getThroughtFunction("1dc5963896ce65745702d005.json");

async function getDownloadURLThroughFirebase(url) {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
}

getDownloadURLThroughFirebase("https://firebasestorage.googleapis.com/v0/b/linux-reader.firebasestorage.app/o/1dc5963896ce65745702d005.json?alt=media&token=289adec7-1d31-48f6-9dc9-3c7a18ac95f2")