const Service = require('egg').Service;

class LoginService extends Service {
  async index(password, account) {
    const findAccount = await this.findAccount(account);
    const response = {
      success: false,
      message: '',
    };
    if (!findAccount) {
      response.success = false;
      response.message = '找不到该账户名称';
    } else {
      const find = await this.checkPassword(account,password);
      if (find) {
        response.success = true;
        response.message = '登陆成功';
      } else {
        response.success = false;
        response.message = '密码错误';
      }
    }
    return response;
  }

  // 查找账号是否存在
  async findAccount(account) {
    const ifFind = await this.app.mysql.get('account', {username: account});
    if (ifFind) {
      return true
    } else {
      return false;
    }
  }
  // 密码是否正确
  async checkPassword(account, password) {
    const user = await this.app.mysql.get('account', {username: account});
    const checked = await this.ctx.compare(password, user.password);
    if (checked ) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = LoginService;