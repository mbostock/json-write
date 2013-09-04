var jsonWriter = require("./");

jsonWriter()
    .write({type: "Topology", objects: [1,2]})
    .end({type: "Topology", objects: [1,2]})
    .pipe(process.stdout);
