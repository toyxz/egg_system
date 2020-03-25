const Service = require('egg').Service;

class UserService extends Service {
    async getAuditUser() {
        // 注意需要报错机制
        const users = await this.app.mysql.select('user', {
            where: { audit_state: 0},
            orders: [['create_time','desc'], ['id','desc']], // 排序方式
        });
        return {
            users,
            total: users.length,
        }
    }
    // 审核员提交审核用户资料意见
    async submitAuditUser(requestObj) {
        const { userId, passAudit, auditComment } = requestObj;
        const row = {
            audit_state: passAudit? 3: 2,
            audit_reason: auditComment,
        };
        const option = {
            where: {
                id: userId,
            }
        };
       const result = await this.app.mysql.update('user',row, option);
       if (result.affectedRows === 1) {
         return true;
        }
        return false;
    }
    async getNameById(id) {
       const result = await this.app.mysql.get('user',{id});
       return result.name;
    }

}

module.exports = UserService;