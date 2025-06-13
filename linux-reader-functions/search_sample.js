// File: helloAlgolia.mjs
import { algoliasearch } from "algoliasearch";
import fs from "fs/promises"

const appID = process.env.ALGOLIA_APP_ID;
// API key with `addObject` and `editSettings` ACL
const algoliaWriteApiKey = process.env.ALGOLIA_WRITE_API_KEY;
const algoliaSearchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;
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

async function doWrite() {
    const fileNameHex = generateHexString();
    try {
        const fileContent = await fs.readFile("/Users/coffeecup/Documents/open_source/linux/json/fork_choices_1749374886304.json", "utf8");
        const rootPath = "/Users/coffeecup/Documents/open_source/linux/json";
        const rootPathReplaceRegex = new RegExp(`"${rootPath}`, "g");
        const replacedJson = fileContent.replace(rootPathReplaceRegex, '"');
        const fileContentJSON = JSON.parse(replacedJson);
        const client = algoliasearch(appID, algoliaWriteApiKey);
        const record = {content: fileContentJSON, objectID: fileNameHex};
        const {taskID} = await client.saveObject({
            indexName,
            body: record
        });
        console.log(taskID);
    } catch(e) {
        console.error(e);
    }
}

doWrite();