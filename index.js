var visit = require("./visit"),
    readable = require("stream").Readable;

module.exports = function() {
  var reader = new readable,
      depth = 0,
      end = false;

  reader._read = read;

  function read() {
    if (!visitor.pop() && end) {
      reader.push(null);
    }
  }

  var visitor = visit({
    arrayStart: function() {
      ++depth;
      reader.push("[");
    },
    arrayEnd: function() {
      reader.push("]");
      if (!--depth) reader.push("\n");
    },
    objectStart: function() {
      ++depth;
      reader.push("{");
    },
    objectEnd: function() {
      reader.push("}");
      if (!--depth) reader.push("\n");
    },
    key: function(string) {
      reader.push(string);
      reader.push(":");
    },
    primitive: function(string) {
      reader.push(string);
      if (!depth) reader.push("\n");
    },
    separator: function() {
      reader.push(",");
    }
  });

  var o = {
    write: function(value) {
      visitor.push(value);
      process.nextTick(read);
      return o;
    },
    end: function(value) {
      if (arguments.length) visitor.push(value);
      end = true;
      process.nextTick(read);
      return o;
    },
    pipe: function(writer, options) {
      reader.pipe(writer, options);
      return o;
    }
  };

  return o;
};
