module.exports = app => {
    app.post('/api/login', app.controller.login.index);
    app.post('/api/register', app.controller.register.index);
    app.post('/api/emailVerify', app.controller.register.emailVerify);
    app.get('/api/checkAuth', app.controller.auth.index);
    app.get('/api/getPatientOption', app.controller.order.getPatientOption);
    app.post('/api/uploadFile', app.controller.order.uploadFile);
    app.post('/api/addOrder', app.controller.order.addOrder);
    app.get('/api/showUserOrder', app.controller.order.showUserOrder);
    app.post('/api/auditOrder', app.controller.order.auditOrder);
    app.get('/api/showAuditOrder', app.controller.order.showAuditOrder);
    app.post('/api/downloadZip', app.controller.data.downloadZip);
  };