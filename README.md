# JSON Write

A stream-based JSON serializer, useful for serializing very large JSON objects without creating massive strings in memory.

```js
var jsonWrite = require("./");

var writer = jsonWriter();
writer.pipe(process.stdout);
writer.write({type: "Topology", objects: [1,2]});
writer.end({type: "Topology", objects: [1,2]});
```
