var through = require("through2"),
  babel = require("@babel/core");
module.exports = function () {
  return through.obj(function (chunk, enc, cb, e, r, n) {
    if (chunk.isNull()) return cb(null, chunk);
    if (chunk.isStream()) return cb(null, chunk);
    if (chunk.isBuffer()) {
      var content = chunk.contents.toString();
      var regex = /<script>([\s\S]*?)<\/script>/g;
      var match = regex.exec(content);
      var before = match[1] || "";
      var after = "";

      before.trim();
      after = babel.transform(before);
      after = "\n" + after.code + "\n";

      chunk.contents = Buffer.from(content.replace(before, after));
      return cb(null, chunk);
    }
    return cb(null, chunk);
  });
};
