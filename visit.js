module.exports = function(listener) {
  var frame = top,
      stack = [],
      queue = [];

  function visit(value) {
    if (typeof value === "object") {
      if (!value) return void listener.primitive("null");
      stack.push(frame);
      if (Array.isArray(value)) {
        listener.arrayStart();
        frame = {values: value, index: -1, end: value.length - 1};
      } else {
        listener.objectStart();
        var keys = Object.keys(value);
        frame = {object: value, keys: keys, index: -1, end: keys.length - 1};
      }
    } else {
      listener.primitive(JSON.stringify(value));
    }
  }

  return {
    push: function(value) {
      queue.push(value);
    },
    pop: function() {
      if (frame.keys) {
        var key = frame.keys[++frame.index];
        if (frame.index > 0) listener.separator();
        listener.key(JSON.stringify(key));
        visit(frame.object[key]);
      } else if (frame.values) {
        var value = frame.values[++frame.index];
        if (frame.index > 0) listener.separator();
        visit(value);
      } else if (queue.length) {
        visit(queue.shift());
      } else {
        return false;
      }
      while (frame.index === frame.end) {
        if (frame.keys) listener.objectEnd();
        else listener.arrayEnd();
        frame = stack.pop();
      }
      return true;
    }
  };
};

var top = {
  index: NaN,
  end: NaN
};
