const Service = require('egg').Service;

class LoginService extends Service {
  async index(requestObj) {
    const { password, account, rememberMe } = requestObj;
    const hasToken = await this.checkToken();
    const findAccount = await this.findAccount(account);
    const response = {
      success: false,
      message: '',
      hasLogin: false,
    };
    if(rememberMe) {
      // 签发token
      const token = await this.signToken(account);
      this.ctx.cookies.set('authToken', token);
    }
    // // 跳转登陆页面
    // if (hasToken) {
    //   response.success = true;
    //   response.message = '进入后台';
    //   response.hasLogin = true;
    //   return response; // 设置响应 该响应可以让前端转到后台主页面 直接return response
    // } 
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
  // 签发token
  async signToken(account) {
    let userToken = {
      name: account
    }
    const token = this.app.jwt.sign(userToken, this.app.jwt.secret, {expiresIn: '1h'}); //token签名 有效期为1小时
    return token;
  }
  // 查看cookie中是否有token
  async checkToken() {
    // 获取cookie中的token
    const token = this.ctx.cookies.get('authToken');
    if (token) {
      // this.app.jwt.verify(token, this.config.jwt.secret) : { name: '37', iat: 1583591327 }
      const userAccount = this.app.jwt.verify(token, this.config.jwt.secret).name;
      const find = await this.findAccount(userAccount);
      if (find) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

module.exports = LoginService;