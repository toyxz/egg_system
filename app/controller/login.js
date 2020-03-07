const Controller = require('egg').Controller;

class Login extends Controller {
    async index() {
        const { ctx } = this;
        const { password, account } = ctx.request.body;
        const response = await ctx.service.login.index(password, account);
        ctx.body = response;
    }
}

module.exports = Login;