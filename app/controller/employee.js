const Controller = require('egg').Controller;

class Employee extends Controller {
    async addEmployee() {
       const { ctx } = this;
       const response = ctx.service.employee.addEmployee(ctx.request.body);
       if (response) {
           ctx.body = {
               success: true,
                message: '提交成功',
           };
       } else {
            ctx.body = {
                success: false,
                message: '提交失败',
            };
       }
    }
    // 获取所有员工列表
    async getAllEmployee() {
        const { ctx } = this;
        const { perPage, page } = ctx.query;
        const response = await ctx.service.employee.getAllEmployee();
        const { employeeList, total } = response;
        ctx.body = {
            employeeList: this.rangeEmployee(employeeList,page,perPage),
            total,
        }
    }
    // 获取范围内的employee
    rangeEmployee(employeeResult,page,perPage) {
        return employeeResult.slice((page-1)*perPage,page*perPage)
    }

}

module.exports = Employee;