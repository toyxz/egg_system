const Controller = require('egg').Controller;
const Path = require('path');
const Fs = require('fs');

let ownFile = null;
class Data extends Controller {
    async index() {
        const { ctx } = this;

    } 
    async downloadZip() {
        const { ctx } = this;
        const { orderNumber, userId } = ctx.request.body;
        const name = await ctx.service.user.getNameById(userId);
        const dirName = `app/public/uploadRowData/${userId}_${name}`;
        const filePath = Path.join(process.cwd(), dirName,orderNumber);
        ctx.attachment(orderNumber);
        ctx.set('Content-Type', 'application/octet-stream');
        const zipSrc = Fs.createReadStream(filePath);
        ctx.type = '.zip';
        ctx.body = zipSrc;
    }
    async getSTL() {
        const { ctx } = this;
        const { orderNumber } = this.ctx.query;
        // 根据订单流水号获取订单
        const order = await  ctx.service.order.getOrderByOrderNumber(orderNumber)
        const result = this.orderToSTL(order)
        // const stlDataPath = Path.join(process.cwd(), 'app/public/stl');
        // const stlDataPath = 'app/public/stl';

        ctx.body = result
    }
    // 根据订单映射stl数据
    orderToSTL(order) {
       let result = null;
       const stlDataPath = 'stl';
       let src = null; // 需根据用户信息
       const srcArray = ['al0','al1','al2','al3','al4','al5'];
       switch(order.patient_part) {
           case '大脑' :
               src=srcArray[5];
               result = [
                {"name":"动脉","filePath":Path.join(stlDataPath, src, '0.stl'),"color":0xff0000,"opacity":1,"visible":true},
                {"name":"骨骼","filePath":Path.join(stlDataPath, src, '1.stl'),"color":0xe9e9ff,"opacity":0.5,"visible":true},
                {"name":"静脉","filePath":Path.join(stlDataPath, src, '2.stl'),"color":0x0000ff,"opacity":1,"visible":true},
                {"name":"脑","filePath":Path.join(stlDataPath, src, '3.stl'),"color":0xd2691e,"opacity":0.5,"visible":true},
                {"name":"皮肤","filePath":Path.join(stlDataPath, src, '4.stl'),"color":0xeee8aa,"opacity":0.25,"visible":true},
                {"name":"占位","filePath":Path.join(stlDataPath, src, '5.stl'),"color":0xffff00,"opacity":1,"visible":true},
            ];  
               break;
           case '喉咙' :
               src=srcArray[4];
               result=[
                    {"name":"动脉血管","filePath":Path.join(stlDataPath, src, '0.stl'),"color":0xff0000,"opacity":1,"visible":true},
                    {"name":"骨骼1","filePath":Path.join(stlDataPath, src, '1.stl'),"color":0xc0c0c0,"opacity":1,"visible":true},
                    {"name":"骨骼2","filePath":Path.join(stlDataPath, src, '2.stl'),"color":0xc0c0c0,"opacity":1,"visible":true},
                    {"name":"喉骨","filePath":Path.join(stlDataPath, src, '3.stl'),"color":0xf0e68c,"opacity":1,"visible":true},
                    {"name":"甲状腺","filePath":Path.join(stlDataPath, src, '4.stl'),"color":0xc0ff00,"opacity":1,"visible":true},
                    {"name":"静脉血管","filePath":Path.join(stlDataPath, src, '5.stl'),"color":0x0000ff,"opacity":1,"visible":true},
                    {"name":"淋巴结","filePath":Path.join(stlDataPath, src, '6.stl'),"color":0xa0ffff,"opacity":1,"visible":true},
                    {"name":"皮肤","filePath":Path.join(stlDataPath, src, '7.stl'),"color":0xffe9e9,"opacity":0.25,"visible":true},
                    {"name":"气管","filePath":Path.join(stlDataPath, src, '8.stl'),"color":0x57ff57,"opacity":1,"visible":true},
                    {"name":"头颈占位","filePath":Path.join(stlDataPath, src, '9.stl'),"color":0xff8c00,"opacity":1,"visible":true},
                ];  
               break;
           case '小肠' :
               src=srcArray[1];
               result=[
                    {"name":"大肠面模型","filePath":Path.join(stlDataPath, src, '0.stl'),"color":0x8080c0,"opacity":0.5,"visible":true},
                    {"name":"动脉","filePath":Path.join(stlDataPath, src, '1.stl'),"color":0xff0000,"opacity":1,"visible":true},
                    {"name":"肝静脉","filePath":Path.join(stlDataPath, src, '2.stl'),"color":0x0000ff,"opacity":1,"visible":true},
                    {"name":"肝脏","filePath":Path.join(stlDataPath, src, '3.stl'),"color":0x8b0000,"opacity":0.5,"visible":true},
                    {"name":"骨骼","filePath":Path.join(stlDataPath, src, '4.stl'),"color":0xc0c0c0,"opacity":1,"visible":true},
                    {"name":"门静脉","filePath":Path.join(stlDataPath, src, '5.stl'),"color":0x00bfff,"opacity":1,"visible":true},
                    {"name":"膀胱","filePath":Path.join(stlDataPath, src, '6.stl'),"color":0x0000a0,"opacity":1,"visible":true},
                    {"name":"皮肤","filePath":Path.join(stlDataPath, src, '7.stl'),"color":0xffd7c4,"opacity":0.25,"visible":true},
                    {"name":"腔静脉","filePath":Path.join(stlDataPath, src, '8.stl'),"color":0x0000ff,"opacity":1,"visible":true},
                    {"name":"肾盂和尿管","filePath":Path.join(stlDataPath, src, '9.stl'),"color":0x808080,"opacity":1,"visible":true},
                    {"name":"右肾","filePath":Path.join(stlDataPath, src, '10.stl'),"color":0xb22222,"opacity":0.5,"visible":true},
                    {"name":"肿瘤","filePath":Path.join(stlDataPath, src, '11.stl'),"color":0xff8c00,"opacity":1,"visible":true},
                    {"name":"左肾","filePath":Path.join(stlDataPath, src, '12.stl'),"color":0xb22222,"opacity":0.25,"visible":true},
                ];  
               break;
           case '肝脏' :
               src=srcArray[2];
               result=[
                    {"name":"胆囊","filePath":Path.join(stlDataPath, src, '0.stl'),"color":0x008000,"opacity":1,"visible":true},
                    {"name":"动脉血管","filePath":Path.join(stlDataPath, src, '1.stl'),"color":0xff0000,"opacity":1,"visible":true},
                    {"name":"肝脏","filePath":Path.join(stlDataPath, src, '2.stl'),"color":0x8c0000,"opacity":0.25,"visible":true},
                    {"name":"静脉","filePath":Path.join(stlDataPath, src, '3.stl'),"color":0x0000ff,"opacity":1,"visible":true},
                    {"name":"门静脉","filePath":Path.join(stlDataPath, src, '4.stl'),"color":0x00bfff,"opacity":1,"visible":true},
                    {"name":"脾脏","filePath":Path.join(stlDataPath, src, '5.stl'),"color":0xffa07a,"opacity":1,"visible":true},
                    {"name":"肾实质","filePath":Path.join(stlDataPath, src, '6.stl'),"color":0x808080,"opacity":1,"visible":true},
                    {"name":"肾脏","filePath":Path.join(stlDataPath, src, '7.stl'),"color":0xb22222,"opacity":0.25,"visible":true},
                    {"name":"胰腺","filePath":Path.join(stlDataPath, src, '8.stl'),"color":0xdaa520,"opacity":1,"visible":true},
                    {"name":"肿瘤","filePath":Path.join(stlDataPath, src, '9.stl'),"color":0xff8c00,"opacity":1,"visible":true},
                ]; 
               break;
           case '子宫' :
               src=srcArray[0];
               result=[
                    {"name":"动脉血管","filePath":Path.join(stlDataPath, src, '0.stl'),"color":0xff0000,"opacity":1,"visible":true},
                    {"name":"肝静脉","filePath":Path.join(stlDataPath, src, '1.stl'),"color":0x0000FF,"opacity":1,"visible":true},
                    {"name":"骨骼","filePath":Path.join(stlDataPath, src, '2.stl'),"color":0xc0c0c0,"opacity":1,"visible":true},
                    {"name":"膀胱","filePath":Path.join(stlDataPath, src, '3.stl'),"color":0xdaa520,"opacity":1,"visible":true},
                    {"name":"肾脏","filePath":Path.join(stlDataPath, src, '4.stl'),"color":0xb22222,"opacity":1,"visible":true},
                    {"name":"占位","filePath":Path.join(stlDataPath, src, '5.stl'),"color":0xff8c00,"opacity":1,"visible":true},
                    {"name":"子宫","filePath":Path.join(stlDataPath, src, '6.stl'),"color":0xff0000,"opacity":1,"visible":true},
                ];
               break;
           case '肾脏' :
               src=srcArray[3];
               result=[
                    {"name":"动脉血管","filePath":Path.join(stlDataPath, src, '0.stl'),"color":0xff0000,"opacity":1,"visible":true},
                    {"name":"骨骼","filePath":Path.join(stlDataPath, src, '1.stl'),"color":0xc0c0c0,"opacity":1,"visible":true},
                    {"name":"静脉血管","filePath":Path.join(stlDataPath, src, '2.stl'),"color":0x0000ff,"opacity":1,"visible":true},
                    {"name":"膀胱","filePath":Path.join(stlDataPath, src, '3.stl'),"color":0xc0ffa0,"opacity":1,"visible":true},
                    {"name":"皮肤","filePath":Path.join(stlDataPath, src, '4.stl'),"color":0xeee8aa,"opacity":0.25,"visible":true},
                    {"name":"输尿管","filePath":Path.join(stlDataPath, src, '5.stl'),"color":0xf0e68c,"opacity":1,"visible":true},
                    {"name":"右肾","filePath":Path.join(stlDataPath, src, '6.stl'),"color":0xb22222,"opacity":0.5,"visible":true},
                    {"name":"肿瘤","filePath":Path.join(stlDataPath, src, '7.stl'),"color":0xff8c00,"opacity":1,"visible":true},
                    {"name":"左肾","filePath":Path.join(stlDataPath, src, '8.stl'),"color":0xb22222,"opacity":0.5,"visible":true},
                ]; 
               break;
       }
       return result;
    }
    async getOrderData() {
        const { ctx } = this;
        const queryObj = ctx.query; // 还是对象
        const { page, perPage } = queryObj;
        const { order, total } = await ctx.service.data.getOrderData();
        const orderList = this.rangeOrder(order,page,perPage);
        ctx.body = {
            orderData: orderList,
            total,
        }
    }
    // 获取范围内的orders
    rangeOrder(orderResult,page,perPage) {
        return orderResult.slice((page-1)*perPage,page*perPage)
    }
    async upLoadImg() {
        const { ctx } = this;
        const file = ctx.request.files[0];
        // 
        ownFile = new Object(file);
        ctx.body = { name: file.filepath };
    }
    // 提交数据
    async submitRebuildData() {
        const { ctx } = this;
        // 储存
        const response = await ctx.service.data.saveDataImg(ctx.request.body);
        if (response) {
            ctx.body = {
                success: true,
                message: '数据修改成功',
            }
        } else {
            ctx.body = {
                success: false,
                message: '数据修改失败',
            }
        }
    }
    // 用户获取数据图片列表
    async getImgData() {
        const { ctx } = this;
        const { userAccount } = ctx.request.body;
        // 获取用户
        let user = null;
        if (userAccount) {
            user = await ctx.service.register.findUserById(userAccount);
        } else {
            const token = ctx.cookies.get('authToken');
            if (token) {
              const { name } = this.app.jwt.verify(token, this.config.jwt.secret);
              user = await ctx.service.register.findUserById(name);
            } 
        }
        // 根据用户获得订单及其对应的数据 返回图片 订单 
        const result  = await ctx.service.data.getImgOrderByUser(user);
        // const { orders, datas } = result;
        ctx.body = result;
    }
    // 获得分类目标项目（由于项目存在不完整性，故这里的数据是）
    async getClassifyOption() {
       const {ctx} = this;
       ctx.body = ['性别','器官','病位'];
    }
    async getClassifyValue() {
        const {ctx} = this;
        let result = [];
        const { classifyOption } = ctx.query;
        switch(classifyOption) {
            case '性别': 
              result=['男','女'];
              break;
            case '器官': 
              result=["喉咙", "小肠", "肝脏", "肾脏", "子宫", "大脑"];
              break;
            case '病位': 
              result=["喉咙", "小肠", "肝脏", "肾脏", "子宫", "大脑"];
              break;
        }
        ctx.body = result;
    }
    async getClassfyImgData() {
        const {ctx} = this;
        const { classifyOption, classifyValue } = ctx.query; 
        const result = await ctx.service.data.getClassfyImgData(classifyOption, classifyValue);
        ctx.body = result;

    }
}

module.exports = Data;