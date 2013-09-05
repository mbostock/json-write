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
    bufferIndex += buffer.write(chunk, bufferIndex);
    while (Buffer._charsWritten < chunk.length) {
      flush();
      bufferIndex = buffer.write(chunk = chunk.substring(Buffer._charsWritten));
    }
  }

  return transform;
};
