# json-write

This module implements a stream-based JSON serializer. Whereas JSON.stringify tends to run out memory, this serializer can handle very large objects without creating massive strings in memory.

```js
var jsonWrite = require("json-write");

var writer = jsonWrite();
writer.pipe(process.stdout);
writer.write({type: "Topology", objects: [1,2]});
writer.end({type: "Topology", objects: [1,2]});
```

Each object you *writer*.write is separated by a new line.
