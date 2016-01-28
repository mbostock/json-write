var stream = require("stream"),
    eol = require("os").EOL;

module.exports = function() {
  var transform = new stream.Transform({objectMode: true}),
      bufferSize = 16 * 1024,
      bufferIndex = 0,
      buffer = new Buffer(bufferSize);

  transform._transform = function(value, encoding, callback) {
    visit(value);
    flush();
    transform.push(eol);
    callback();
  };

  function visit(value) {
    if (typeof value === "object") {
      if (!value) return void write("null");
      if (Array.isArray(value)) {
        write("[");
        var i = 0, n = value.length;
        if (n) visit(value[i]);
        while (++i < n) write(","), visit(value[i]);
        write("]");
      } else {
        write("{");
        var separate = false;
        for (var key in value) {
          if (separate) write(",");
          else separate = true;
          write(JSON.stringify(key));
          write(":");
          visit(value[key]);
        }
        write("}");
      }
    } else {
      write(JSON.stringify(value));
    }
  }

  function flush() {
    if (bufferIndex) {
      transform.push(buffer.slice(0, bufferIndex));
      buffer = new Buffer(bufferSize);
      bufferIndex = 0;
    }
  }

  function write(chunk) {
    var length = Buffer.byteLength(chunk);

    // Do we need a bigger buffer to fit this chunk?
    if (length > bufferSize) {
      flush();
      while (length > bufferSize) bufferSize *= 2;
      buffer = new Buffer(bufferSize);
    }

    // Or would it fit if we just flush?
    else if (length + bufferIndex > bufferSize) flush();

    bufferIndex += buffer.write(chunk, bufferIndex);
  }

  return transform;
};
