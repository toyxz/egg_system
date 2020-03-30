const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');


let ownFile = null;
class Order extends Controller {
    async index() {

    }
    // 用户上传原始数据（压缩件）
    async uploadFile() {
       const { ctx } = this;
       const file = ctx.request.files[0];
       ownFile = new Object(file);
       ctx.body = { name: file.filename };
       ctx.status = 200;
    }
    // 用户提交订单
    async addOrder() {
        const { ctx } = this;
        // 生成订单流水号
        const orderNumber = await ctx.service.order.generateOrderNumber();
        const { 
            formData: {name, sex, height, weight, illPlace, illOrgan},
            userAccount,
        } = ctx.request.body;
        // 获取用户数据
        let result = null;
        if (userAccount) {
            result = await this.ctx.service.register.findUserById(userAccount);
        } else {
            const token = this.ctx.cookies.get('authToken');
            if (token) {
              const { name } = this.app.jwt.verify(token, this.config.jwt.secret);
              result = await this.ctx.service.register.findUserById(name);
            } 
        }
        // 如果找不到对应的用户 
        if (!result) {
            ctx.request.status = 400;
            ctx.body = {
                success: false,
                message: '提交失败',
            }
            return ;
        }
        // 文件处理
        const fileData = Fs.readFileSync(ownFile.filepath);
        const base64str = Buffer.from(fileData, 'binary').toString('base64');
        const bufferData = Buffer.from(base64str, 'base64');
        const uplaodBasePath = Path.join(process.cwd(), 'app/public/uploadRowData');
        // 用户身份信息标示: 用户id+用户姓名
        const dirName = result.id + '_' + result.name;   
        // 文件完整存储路径：用户
        const dir = Path.join(uplaodBasePath, dirName);
        if (!Fs.existsSync(dir)) Fs.mkdirSync(dir);
        // 文件名不使用用户的，改成系统
        const src = Path.join(dir, orderNumber); // 文件完整存储位置
        // 保存文件
        try {
            await Fs.writeFileSync(src, bufferData); 
        } catch (e) {
            ctx.body = {
                success: false,
                message: '上传文件失败',
            };
            ctx.response.status = 404; 
        }
        // 创建data表
        const data = await ctx.service.order.insertData(src);
        const access = await ctx.service.order.insertAccess({organ: illOrgan});
        if (!data || !access) {
            ctx.body = {
                success: false,
                message: '提交失败',
            };
            ctx.response.status = 404;    
            return;
        }
        const order = {
            userid: result.id,
            patient_name: name,
            patient_height: height,
            patient_weight: weight,
            patient_sex: sex,
            patient_part: illPlace,
            patient_org: illOrgan,
            data_id: data.insertId,
            access_id: access.insertId,
            order_number: orderNumber,
        }
        const orderResult = await ctx.service.order.addOrder(order);
        if (orderResult) {
            ctx.body = {
                success: true,
                message: '提交成功',
            };
        } else {
            ctx.body = {
                success: false,
                message: '提交失败',
            };
            ctx.response.status = 404;   
        }
    }

    // 展示用户订单列表
    async getUserOrder() {
        const { ctx } = this; 
        let userAccount = null;
        const queryObj = this.ctx.query; // 还是对象
        const { page, perPage } = queryObj;
        // 只有post请求才有request.body
        if (queryObj.userAccount) {
            userAccount = queryObj.userAccount;
        } else {
            const token = this.ctx.cookies.get('authToken');
            if (token) {
              const { name } = this.app.jwt.verify(token, this.config.jwt.secret);
              userAccount = name;
            }
        }
        const { orders, total } = await ctx.service.order.getUserOrder(userAccount);
        // 截取
        let orderList = this.rangeOrder(orders,page,perPage);
        // 获取订单对应的图片
        const imgIdArray = [];
        orderList.forEach(item => {
            imgIdArray.push(item.data_id);
        });
        orderList =  await ctx.service.order.getUserOrderImage(orderList, imgIdArray);
        ctx.body = {
            orderList: orderList,
            total,
        };
    }
    // 获取范围内的orders
    rangeOrder(orderResult,page,perPage) {
       return orderResult.slice((page-1)*perPage,page*perPage)
    }
    // 工作人员上传图片
    async uploadImage() {

    }
    // 
    async auditOrder() {

    }
    async showAuditOrder() {

    }
    // 获取病患部位和器官 (暂时先在服务器设定)
    async getPatientOption() {
        const { ctx } = this;
        const response = await this.ctx.service.order.getPatientOption();
        ctx.body = response;
    }
    // 审核员获得订单
    async getAuditOrder() {
        const queryObj = this.ctx.query; // 还是对象
        const { page, perPage } = queryObj;

        const { ctx } = this;
        const { orders, total } = await ctx.service.order.getAuditOrder();
        // 截取
        const orderList = this.rangeOrder(orders,page,perPage);
        ctx.body = {
            orderList,
            total,
        };
    }
    // 审核员审核订单
    async submitAuditOrder() {
        const { ctx } = this;
        const response = await ctx.service.order.submitAuditOrder(ctx.request.body);
        if (response) {
            ctx.body = {
                success: true,
                message: '修改成功'
            };
        } else {
            ctx.body = {
                success: false,
                message: '修改失败'
            };
        }
    }
    // 订单处理员处理订单
    async getProcessOrder() {
        const { ctx } = this;
        const { userAccount, perPage, page } = ctx.query;
        const response = await ctx.service.order.getProcessOrder(userAccount, perPage, page);
        ctx.body = response;
    }
    // 订单员提交订单
    async submitProcessOrder() {
        const { ctx } = this;
        const response = await ctx.service.order.submitProcessOrder(ctx.request.body);
        if (response) {
            ctx.body = {
               success: true,
               message: '提交成功',
            }
        } else {
            ctx.body = {
                success: false,
                message: '提交失败',
            }           
        }
    }
    // 用户确认支付（测试接口）
    async confirmPay() {
        const { ctx } = this;
        const { orderNumber } = ctx.query;
        const response = await ctx.service.order.confirmPay(orderNumber);
        if (response) {
          ctx.body = {
              success: true,
              message: '支付成功',
          }
        } else {
            ctx.body = {
                success: false,
                message: '支付失败',
            } 
        }
    }
}

module.exports = Order;