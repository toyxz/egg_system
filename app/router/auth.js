module.exports = app => {
    app.post('/api/login', app.controller.login.index);
    app.post('/api/register', app.controller.register.index);
    app.post('/api/emailVerify', app.controller.register.emailVerify);
  };