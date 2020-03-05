const Controller = require('egg').Controller;

class Register extends Controller {
    constructor(props) {
        super(props);
        this.emailObj = {};
    }

    async index() {
        const { ctx } = this;
        ctx.body = "welcome!";
     }

    async emailVerify() {
       const { ctx } = this;
       const { email } = ctx.request.body;
       // 生成一段 6 位的验证码
       const code = Math.floor(100000 + Math.random() * 900000);
       const sendState = await ctx.service.emailVerify.sendMail(email, "验证邮箱", `验证码：${code}`);
       if (sendState.success) this.emailObj[email] = code;
       ctx.body = sendState;
    }

}

module.exports = Register;