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

    async registerDetailInfo() {
        const { ctx } = this;
        const { formData, userAccount } = ctx.request.body;
        const { name, gender, email, tel, registrationWay, code} = formData;
        // 从登陆信息拿到个人信息（如果不是记住我的话怎么办） 那就从刚开始登陆的state里面拿信息
        const accountResult = await this.ctx.service.register.findAccount(userAccount);
        if (accountResult) {
            const requestObj = {
                name,
                sex: gender,
                email,
                tel,
                account_id: accountResult.id,
                code,
                agent: registrationWay,
            }
            // 存储信息
            await this.ctx.service.register.saveDetailAccount(requestObj);
            // 修改是否注册完成信息状态 if_complete_info
            await this.ctx.service.register.changeUserCompleteInfoState(requestObj.account_id, 1);
            ctx.body = {
                success: true,
                message: '提交成功，注册信息进入审核状态',
            }
        } else {
            ctx.body = {
                success: false,
                message: '账户信息出错',
            }
        }
    }

    async getRegisterState() {
        // todo：如果是记住用户状态的话。 从token里面拿username
        const { ctx } = this;
        if (ctx.request.body.userAccount) {
            const result = await this.ctx.service.register.findUserById(ctx.request.body.userAccount);
            ctx.body = {
                state: result.audit_state,
            };
        } else {
            const token = this.ctx.cookies.get('authToken');
            if (token) {
              const { name } = this.app.jwt.verify(token, this.config.jwt.secret);
              const result = await this.ctx.service.register.findUserById(name);
              if (result) {
                ctx.body = {
                    state: result.audit_state,
                };
              } else {
                ctx.body = {
                    state: 404,
                };             
              }
            } else {
                ctx.response.status = 500;
                ctx.body = {
                    message: '找不到状态',
                }; // 代做统一处理
            }
        }

    }

    async confirmAudit() {
        const { ctx } = this;
        const state = 1;
        if (ctx.request.body.userAccount) {
            const result = await this.ctx.service.register.modifyRegisterState(ctx.request.body.userAccount, state);
            if (result.affectedRows === 1) {
                ctx.body = {
                    state,
                    success: true,
                    message: '审核通过',
                };
            } else {
                ctx.body = {
                    success: false,
                    message: '系统出错',
                };
            }
        } else {
            const token = this.ctx.cookies.get('authToken');
            if (token) {
              const { name } = this.app.jwt.verify(token, this.config.jwt.secret);
              const result = await this.ctx.service.register.modifyRegisterState(name, state);
              if (result.affectedRows === 1) {
                ctx.body = {
                    state,
                    success: true,
                    message: '审核通过',
                };
              } else {
                ctx.body = {
                    success: false,
                    message: '系统出错',
                };
              }
            } else {
                ctx.body = {
                    success: false,
                    message: '系统出错',
                };
            }
        }
    }
}

module.exports = Register;