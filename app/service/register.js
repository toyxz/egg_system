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
    // async saveDetailAccount(requestPbj) {
    //     // todo
    // }
}

module.exports = RegisterService;