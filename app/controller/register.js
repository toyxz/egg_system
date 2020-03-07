const Controller = require('egg').Controller;

const emailObj = {};
class Register extends Controller {
    constructor(props) {
        super(props);
    }
    // 注册
    async index() {
        const { ctx } = this;
        const { email, account, password, verificationCode } = ctx.request.body;
        const hasEmail = await ctx.service.emailVerify.findEmail(email);
        const hasAccount = await this.findAccount(account);
        const ifSameCode = this.ifSameCode(email,verificationCode);
        if (hasEmail) {
            ctx.body = {
                success: false,
                message: '该邮箱已经被注册',
            };     
        } else if (hasAccount) {
            ctx.body = {
                success: false,
                message: '该账户名已经存在',
            };     
        } else if(!ifSameCode) {
            ctx.body = {
                success: false,
                message: '验证码验证失效',
            };   
        } else {
            const requestObj = {
                username: account,
                password,
                email,
            }
            await ctx.service.register.saveAccount(requestObj); 
            ctx.body = {
                success: true,
                message: '注册成功',
            };
        }
     }
    // 邮件验证码
    async emailVerify() {
       const { ctx } = this;
       const { email } = ctx.request.body;
       const hasEmail = await ctx.service.emailVerify.findEmail(email);
       if (hasEmail) {
           ctx.body = {
              success: false,
              message: '该邮箱已经被注册',
           };  
       } else {
           const code = Math.floor(100000 + Math.random() * 900000);
           const sendState = await ctx.service.emailVerify.sendMail(email, "验证邮箱", `验证码：${code}`);
           if (sendState.success) {
               emailObj[email] = code;
            }
           ctx.body = sendState;    
       }
    }
    // 查找是否存在相同账户
    async findAccount(account) {
        const result = await this.ctx.service.register.findAccount(account);
        if (result) {
            return true;
        } else {
            return false;
        }
    }
    // 判断验证码是否一致
    ifSameCode(email, code) {
        // email: String,  code: Number
        return emailObj[email] == code;
    }
}

module.exports = Register;