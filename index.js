var stream = require("stream"),
    eol = require("os").EOL;

module.exports = function() {
  var transform = new stream.Transform({objectMode: true});

  transform._transform = function(value, encoding, callback) {
    visit(value);
    transform.push(eol);
    callback();
  };

  function visit(value) {
    if (typeof value === "object") {
      if (!value) return void transform.push("null");
      if (Array.isArray(value)) {
        transform.push("[");
        var i = 0, n = value.length;
        if (n) visit(value[i]);
        while (++i < n) transform.push(","), visit(value[i]);
        transform.push("]");
      } else {
        transform.push("{");
        var separate = false;
        for (var key in value) {
          if (separate) transform.push(",");
          else separate = true;
          transform.push(JSON.stringify(key));
          transform.push(":");
          visit(value[key]);
        }
        transform.push("}");
      }
    } else {
      transform.push(JSON.stringify(value));
    }
  }

  return transform;
};
