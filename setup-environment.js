const fs = require("node:fs");

const content = `export const environment = { tmdbApiKey: '${process.argv[2]}' }`;

try {
  fs.writeFileSync("./src/environment.ts", content);
} catch (err) {
  console.error(err);
}
