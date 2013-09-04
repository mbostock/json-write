# JSON Write

A stream-based JSON serializer, useful for serializing very large JSON objects without creating massive strings in memory.

```js
var jsonWrite = require("./");

jsonWrite()
    .write({0: [1, 2]})
    .end()
    .pipe(process.stdout);
```
