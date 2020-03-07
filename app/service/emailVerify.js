const Service = require('egg').Service;

const nodemailer = require('nodemailer');
const user_email = '1575539475@qq.com';
const auth_code = 'vhqmdcqqhsbzjjij';

const transporter = nodemailer.createTransport({
  service: 'qq',
  secureConnection: true,
  port: 465,
  auth: {
    user: user_email, // 账号
    pass: auth_code, // 授权码

  },
});

class EmailVerify extends Service {

  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: user_email, // 发送者,与上面的user一致
      to: email,   // 接收者,可以同时发送多个,以逗号隔开
      subject,   // 标题
      text,   // 文本
      html,
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      if (result.messageId) {
        return {
          success: true,
          message: '注册邮件已发送，请注意查收',
        };        
      } else {
        return {
          success: false,
          message: '邮件发送失败',
        }
      }

    } catch (err) {
      return false;
    }
  }

  async findEmail(email) {
    const result = await this.app.mysql.get('account', {email: email});
    if (result) {
      return true;
    } else {
        return false;
    }
  }

}

module.exports = EmailVerify;

