const Controller = require('egg').Controller;

class Login extends Controller {
    async index() {
        const { ctx } = this;
        ctx.body = '22';  // 有body才可以返回200
        ctx.response.message = "welcome!";
        console.log(ctx.service.login.find(ctx.request.body));
    }
}

module.exports = Login;