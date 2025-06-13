import functions from "@google-cloud/functions-framework";
// File: helloAlgolia.mjs
import { algoliasearch } from "algoliasearch";

const appID = process.env.ALGOLIA_APP_ID;
// API key with `addObject` and `editSettings` ACL
const algoliaSearchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;
const indexName = "linux_reader";

functions.http("helloHttp", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  // get req
  let reqJson = {}
  try {
    reqJson = JSON.parse(req.body);
  } catch (e) {
    console.error(e);
  }
  // get req
  const searchWord = reqJson.search;
  if (!searchWord) {
    const response = JSON.stringify({ status: "Failed" });
    res.send(response);
    return;
  }
  // algolia client
  const client = algoliasearch(appID, algoliaSearchApiKey);
  let response = "{}";
  try {
    const { results } = await client.search({
      requests: [
        {
          indexName,
          query: searchWord,
          hitsPerPage: 20,
        },
      ],
    });
    const objectResult = results[0].hits.map((r) => ({
      fullPath: `${r.objectID}.json`,
      objectID: r.objectID,
      description: r.description || "詳細は提供されていません",
      highlights: Object.values(r._highlightResult)
        .map((hr) => {
          return Object.values(hr?.content ?? {})
          .map((c) => {
            return JSON.stringify(c.value)
          })
          .filter((c) => {
            const cIndex = c.indexOf("<em>")
            if (cIndex === -1) return ""
            return c.slice(cIndex - 4, cIndex + 46)
          })
          .filter(Boolean)
          .join(", ")
        })
        .filter(Boolean)
        .join(", "),
    }));
    response = JSON.stringify({ status: "OK", result: objectResult });
  } catch (e) {
    console.error(e);
    response = JSON.stringify({ status: "Failed" });
  }
  res.send(response);
});
