var jsonWriter = require("./");

jsonWriter()
    .end({type: "Topology", objects: [1,2]})
    .pipe(process.stdout);
