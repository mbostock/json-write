var visit = require("./visit"),
    readable = require("stream").Readable;

module.exports = function() {
  var reader = new readable,
      end = false;

  reader._read = read;

  function read() {
    if (!visitor.pop() && end) {
      reader.push(null);
    }
  }

  var visitor = visit({
    arrayStart: function() {
      reader.push("[");
    },
    arrayEnd: function() {
      reader.push("]");
    },
    objectStart: function() {
      reader.push("{");
    },
    objectEnd: function() {
      reader.push("}");
    },
    key: function(string) {
      reader.push(string);
      reader.push(":");
    },
    primitive: function(string) {
      reader.push(string);
    },
    separator: function() {
      reader.push(",");
    },
    terminator: function() {
      reader.push("\n");
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
