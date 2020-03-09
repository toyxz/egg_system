const Service = require('egg').Service;

class AuthService extends Service {
  async index() {

  }
  // 生成订单号
  async generateOrderNumber() {

  }
  // 获取病患部位和器官 (暂时先在服务器设定)
  async getPatientOption() {
      return {
         illPlaces: ["头","喉咙","胸部", "腹部", "大腿", "肩关节", "关节", "心脏", "臀部", "腰"],
         illOrgans: ["关节","食道", "胃", "小肠", "心脏", "脾脏", "大脑"],
      }
  }
}

module.exports = AuthService;