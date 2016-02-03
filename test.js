/**
 * Created at 16/2/3.
 * @Author Ling.
 * @Email i@zeroling.com
 */
var mocha = require('mocha');
var fs = require('fs');
try {
    fs.readFileSync('./dist/test-adapter.js');
} catch (e) {
    console.log('WARN! ./dist/index.js does not exist! Pls exec `npm run compile` first.');
    return;
}


describe("Promises/A+ Tests", function () {
    require("promises-aplus-tests").mocha(require('./dist/test-adapter'));
});