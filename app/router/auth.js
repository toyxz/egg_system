module.exports = app => {
    app.post('/api/login', app.controller.login.index);
    app.post('/api/register', app.controller.register.index);
    app.post('/api/emailVerify', app.controller.register.emailVerify);
    app.get('/api/checkAuth', app.controller.auth.index);
    app.get('/api/getPatientOption', app.controller.order.getPatientOption);
    app.post('/api/uploadFile', app.controller.order.uploadFile);
    app.post('/api/addOrder', app.controller.order.addOrder);
    // app.post('/api/auditOrder', app.controller.order.auditOrder);
    // app.get('/api/showAuditOrder', app.controller.order.showAuditOrder);
    app.post('/api/downloadZip', app.controller.data.downloadZip);
    app.get('/api/getSTL', app.controller.data.getSTL);
    app.post('/api/postDetailInfo', app.controller.register.registerDetailInfo);
    app.get('/api/getRegisterState', app.controller.register.getRegisterState);
    app.get('/api/confirmAudit', app.controller.register.confirmAudit);
    app.get('/api/getUserInfo', app.controller.user.getUserInfo);
    app.get('/api/getUserOrder', app.controller.order.getUserOrder);
    app.get('/api/getImgData', app.controller.data.getImgData);
    app.get('/api/getClassifyOption', app.controller.data.getClassifyOption);
    app.get('/api/getClassifyValue', app.controller.data.getClassifyValue);
    app.get('/api/getClassfyImgData', app.controller.data.getClassfyImgData);
    app.get('/api/confirmPay', app.controller.order.confirmPay);

    
    // 员工操作
    app.get('/api/getAuditOrder', app.controller.order.getAuditOrder);
    app.get('/api/getProcessOrder', app.controller.order.getProcessOrder);

    app.post('/api/submitAuditOrder', app.controller.order.submitAuditOrder);
    app.get('/api/getAuditUser', app.controller.user.getAuditUser);
    app.post('/api/submitAuditUser', app.controller.user.submitAuditUser);
    app.get('/api/getOrderData', app.controller.data.getOrderData);
    app.post('/api/upLoadImg', app.controller.data.upLoadImg);
    app.post('/api/submitRebuildData', app.controller.data.submitRebuildData);
    app.post('/api/addEmployee', app.controller.employee.addEmployee);
    app.get('/api/getAllEmployee', app.controller.employee.getAllEmployee);
    app.post('/api/submitProcessOrder', app.controller.order.submitProcessOrder);


    
    

    // 权限角色
    app.get('/api/getAllRole', app.controller.role.getAllRole);
    app.get('/api/getAuth', app.controller.auth.getAuth);


    
  };