const logger = function (req, res, next) {
  const time = new Date().toISOString();
  console.log(`${time} : ${req.method}, at : ${req.url}`);
  next();
};

module.exports = logger;
