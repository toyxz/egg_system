const Service = require('egg').Service;

class LoginService extends Service {
  async find(info) {
    const login = await this.app.mysql.get('login');
    return login;
  }
}

module.exports = LoginService;