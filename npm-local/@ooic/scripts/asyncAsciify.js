const asciify = require("asciify");
module.exports = function asyncAsciify(...args) {
  return new Promise((resolve, reject) => {
    asciify(...args, function (err, res) {
      if (err) {
        reject(err);
      } else {
        console.log(res);
        resolve(res);
      }
    });
  });
};
