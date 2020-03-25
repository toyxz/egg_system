const Controller = require('egg').Controller;

class Role extends Controller {
    async index() {

    }
    async getAllRole() {
        const { ctx } = this;
        const response = await ctx.service.role.getAllRole();
        ctx.body = response;
    }

}

module.exports = Role;