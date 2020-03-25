const Service = require('egg').Service;

const officialEmail = 'test@qq.com';
class EmployeeService extends Service {
     async addEmployee(employeeObj) {
         const { name, tel, role: roleName, account: username, passward } = employeeObj;
         const role = await this.app.mysql.get('role', { name: roleName });
         const hashPwd = await this.ctx.genHash(passward);
         const accountObj = {
            username,
            email: officialEmail, // 使用官方邮箱修改
            password: hashPwd,
            if_complete_info: 1,
         };
         const account = await this.app.mysql.insert('account', accountObj);
         const eObj = {
            name,
            account_id: account.insertId,
            role_id: role.id,
            tel,
         };
         const response = await this.app.mysql.insert('employee', eObj);
         if (response.affectedRows === 1) {
             return true;
         } else {
            return false;
         }
     }
     // 获得员工列表
     async getAllEmployee() {
        const employees = await this.app.mysql.select('employee', {
            orders: [['create_time','desc']], // 排序方式
        });
        const accountArray = [];
        const roleArray = [];
        employees.forEach((item) => {
            accountArray.push(item.account_id);
            roleArray.push(item.role_id);
        });
        // 获取员工对应的account
        const accounts = await this.app.mysql.select('account', {
            where: {id: [...accountArray]},
            orders: [['create_time','desc']], // 排序方式
        });
        // 获取员工对应的角色
        const roles = await this.app.mysql.select('role', {
            where: {id: [...roleArray]},
        });
        const roleObj = {};
        roles.forEach(item => {
            roleObj[item.id] = item.name;
        });
        const response = [];
        employees.forEach((item, index) => {
            // let hashPwd = 
            response.push({
                id: item.id,
                name: item.name,
                tel: item.tel,
                account: accounts[index].username,
                password: accounts[index].password,
                roleName: roleObj[item.role_id],
            });
        });
        return {
            employeeList: response,
            total: response.length,
        };
     }

}

module.exports = EmployeeService;

