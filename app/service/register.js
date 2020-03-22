const Service = require('egg').Service;

class RegisterService extends Service {
    // 保存账户信息
    async saveAccount(requestPbj) {
       const accountObj = requestPbj;
       accountObj.password = await this.ctx.genHash(requestPbj.password);
       await this.app.mysql.insert('account', accountObj);   // 这里应该是要有错误处理的
    }
    // 查找是否存在相同用户
    async findAccount(account) {
        return this.app.mysql.get('account', {username: account});
    }
    // 保存用户具体信息
    async saveDetailAccount(requestPbj) {
        await this.app.mysql.insert('user', requestPbj);   // 这里应该是要有错误处理的
    }
    // 查找用户
    async findUserById(name) {
        const user = await this.app.mysql.get('account', {username: name});
        return this.app.mysql.get('user', { account_id: user.id });
    }
    // 修改用户注册状态
    async modifyRegisterState(name, state) {
        const user = await this.app.mysql.get('account', {username: name});
        const row = {
          audit_state: state,
        };
        const options = {
            where: {
                account_id: user.id,
            },
        };
        const result = await this.app.mysql.update('user', row, options); 
        return result;
    }
}

module.exports = RegisterService;