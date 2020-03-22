const Controller = require('egg').Controller;

class User extends Controller {
    async index() {
        // const { ctx } = this;
        // const response = await ctx.service.login.index(ctx.request.body);
        // ctx.body = response;
        // ??
    }
    async getUserInfo() {
        const { ctx } = this;
        if (ctx.request.body.userAccount) {
            const result = await this.ctx.service.register.findUserById(ctx.request.body.userAccount);
            if (result) {
                ctx.body = {
                    success: true,
                    user: result,
                    message: '用户信息',
                }
            } else {
                ctx.body = {
                    success: false,
                    message: '找不到用户信息',
                }
            }
        } else {
            const token = this.ctx.cookies.get('authToken');
            if (token) {
              const { name } = this.app.jwt.verify(token, this.config.jwt.secret);
              const result = await this.ctx.service.register.findUserById(name);
              if (result) {
                ctx.body = {
                    success: true,
                    user: result,
                    message: '用户信息',
                }
              } else {
                ctx.body = {
                    success: false,
                    message: '找不到用户信息',
                }
              }
            }
        }
    }
    //  审核员获取员工列表
    async getAuditUser() {
        const { ctx } = this;
        const queryObj = ctx.query; // 还是对象
        const { page, perPage } = queryObj;
        const { users, total } = await ctx.service.user.getAuditUser();
        // 截取
        const userList = this.rangeOrder(users,page,perPage);
        ctx.body = {
            userList,
            total,
        };
    }
    // 获取范围内的orders
    rangeOrder(userResult,page,perPage) {
        return userResult.slice((page-1)*perPage,page*perPage)
    }
    // 审核员提交审核用户资料意见
    async submitAuditUser() {
        const { ctx } = this;
        const response = await ctx.service.user.submitAuditUser(ctx.request.body);
        if (response) {
            ctx.body = {
                success: true,
                message: '提交成功'
            }
        } else {
            ctx.body = {
                success: false,
                message: '修改失败'
            }
        }
    }
}

module.exports = User;