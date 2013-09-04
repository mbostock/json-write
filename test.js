var jsonWrite = require("./");

var writer = jsonWrite();
writer.pipe(process.stdout);
writer.write({type: "Topology", objects: [1,2]});
writer.end({type: "Topology", objects: [1,2]});
