var fs = require("fs"),
    queue = require("queue-async"),
    jsonWrite = require("../");

process.stdout.write("reading input… ")
var json = JSON.parse(fs.readFileSync("test/data/nyc-buildings.json", "utf8"));
console.log("done.");

process.stdout.write("writing output… ");
var start = process.hrtime();
var writer = jsonWrite();
writer.pipe(fs.createWriteStream("test/data/nyc-buildings-write.json", "utf8"));
writer.end(json, function() {
  console.log("done.");
  var elapsed = process.hrtime(start);
  console.log("elapsed time: " + Math.round(elapsed[0] * 1e3 + elapsed[1] / 1e6) + "ms");
  console.log("memory usage: " + Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + "MB");
});
