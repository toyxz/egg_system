const Service = require('egg').Service;

class AuthService extends Service {
  async index() {

  }
  // 生成订单号
  // * 根据两位业务码字符串,生成一个流水号,格式按照
  // * yyyyMMddhhmmss{bizCode}{3位的自增序列号}
  async generateOrderNumber() {
    const d = new Date();
     const year = d.getFullYear() + '';
     const month = d.getMonth() + 1 < 10 ? '0' + d.getMonth() + 1 : '' + d.getMonth() + 1;
     const date = d.getDate();
     const h = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
     const m = d.getMinutes()< 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
     const s = d.getSeconds()< 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
     const bizCode = '3D';
     let sequence = this.app.config.sequence + '';
     if (sequence.length < 5) {
       let length = sequence.length;
       for (let i = 0; i < 5-length; ++i) {
        sequence = '0' + sequence;
       }
     }
     if (this.app.config.sequence >= 100000) {
      this.app.config.sequence = 0;
     } else {
      this.app.config.sequence += 1;
     }
     
     return  year+month+date+h+m+s+bizCode+sequence;
  }
  // 获取病患部位和器官 (暂时先在服务器设定)
  async getPatientOption() {
      return {
         illPlaces: ["头","喉咙","胸部", "腹部", "大腿", "肩关节", "关节", "心脏", "臀部", "腰"],
         illOrgans: ["关节","食道", "胃", "小肠", "心脏", "脾脏", "大脑"],
      }
  }
  // 创建订单
  async addOrder(requestPbj) {
    return await this.app.mysql.insert('order', requestPbj);   // 这里应该是要有错误处理的
  }
  // 创建数据表，并返回数据
  async insertData(rawDataPath) {
    const requestPbj = {
      raw_data: rawDataPath,
    };
    return await this.app.mysql.insert('data', requestPbj);   // 这里应该是要有错误处理的
  }
  // 创建评估表，并返回数据
  async insertAccess(data) {
    const { organ } = data;
    const requestPbj = {
      organ,
    };
    return await this.app.mysql.insert('access', requestPbj);   // 这里应该是要有错误处理的
  }
  // 获取全部订单
  async getUserOrder(userAccount) {
    // 注意需要报错机制
    const account = await this.app.mysql.get('account', {username: userAccount});
    const user = await this.app.mysql.get('user', {account_id: account.id});
    const orders = await this.app.mysql.select('order', {
      where: { userid: user.id }, // WHERE 条件
      orders: [['create_time','desc'], ['id','desc']], // 排序方式
    });
    const total = orders.length;
    return { 
      orders,
      total,
    }
  }
  // 审核员获取订单
  async getAuditOrder() {
   // 注意需要报错机制
   const orders = await this.app.mysql.select('order', {
     where: { order_state: 0},
     orders: [['create_time','desc'], ['id','desc']], // 排序方式
   });
   return {
     orders,
     total: orders.length,
   }
  }
  // 审核员审核订单
  async submitAuditOrder(requestObj) {
    const {orderNumber, passAudit, auditComment} = requestObj;
    const access = await this.app.mysql.get('order', {order_number: orderNumber});
    const rowAccess = {
      state: passAudit===1 ? 1 : 2,
      can_build: passAudit,
      reason: auditComment,
    };
    const optionsAccess = {
      where: {
        id: access.id
      }
    };
    const rowOrder = {
      order_state: passAudit===1 ? 1 : 2,
    };
    const optionsOrder = {
      where: {
        order_number: orderNumber,
      }
    };
    const result1 = await this.app.mysql.update('access', rowAccess, optionsAccess); // 更新 access 表中的记录
    const result2 = await this.app.mysql.update('order', rowOrder, optionsOrder); // 修改 order 表中的审核状态
    if (result1.affectedRows === 1 && result2.affectedRows === 1) {
      return true;
    }
    return false;
  }
}

module.exports = AuthService;