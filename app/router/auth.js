module.exports = app => {
    app.post('/api/login', app.controller.login.index);
    app.post('/api/register', app.controller.register.index);
    app.post('/api/emailVerify', app.controller.register.emailVerify);
    app.get('/api/checkAuth', app.controller.auth.index);
    app.get('/api/getPatientOption', app.controller.order.getPatientOption);
    app.post('/api/uploadFile', app.controller.order.uploadFile);
    app.post('/api/addOrder', app.controller.order.addOrder);
    app.post('/api/auditOrder', app.controller.order.auditOrder);
    app.get('/api/showAuditOrder', app.controller.order.showAuditOrder);
    app.post('/api/downloadZip', app.controller.data.downloadZip);
    app.get('/api/getSTL', app.controller.data.getSTL);
    app.post('/api/postDetailInfo', app.controller.register.registerDetailInfo);
    app.get('/api/getRegisterState', app.controller.register.getRegisterState);
    app.get('/api/confirmAudit', app.controller.register.confirmAudit);
    app.get('/api/getUserInfo', app.controller.user.getUserInfo);
    app.get('/api/getUserOrder', app.controller.order.getUserOrder);
    // 员工操作
    app.get('/api/getAuditOrder', app.controller.order.getAuditOrder);
    app.post('/api/submitAuditOrder', app.controller.order.submitAuditOrder);
    app.get('/api/getAuditUser', app.controller.user.getAuditUser);
    app.post('/api/submitAuditUser', app.controller.user.submitAuditUser);

    
  };