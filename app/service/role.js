const Service = require('egg').Service;


class RoleService extends Service {
     async getAllRole() {
         const response = await this.app.mysql.select('role'); 
         return response;
     }

}

module.exports = RoleService;

