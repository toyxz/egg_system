const Controller = require('egg').Controller;

class Auth extends Controller {
    async index() {
        const { ctx } = this;
        const hasToken = await ctx.service.login.checkToken();
        const response = {
            success: false,
            message: '',
            hasLogin: false,
        };
        if (hasToken) {
            response.success = true;
            response.hasLogin = true;
            response.message = '进入后台';
        } else {
            response.success = true;
            response.hasLogin = false;
            response.message = '找不到认证信息';
        }
        ctx.body = response;
    }

}

module.exports = Auth;