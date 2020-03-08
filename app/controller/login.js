const Controller = require('egg').Controller;

class Login extends Controller {
    async index() {
        const { ctx } = this;
        const response = await ctx.service.login.index(ctx.request.body);
        ctx.body = response;
    }
}

module.exports = Login;