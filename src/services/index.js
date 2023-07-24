const blog = require('./blog/blog.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(blog);
};
