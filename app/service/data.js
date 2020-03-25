const Service = require('egg').Service;
const Fs = require('fs');
const Path = require('path');


class DataService extends Service {
   async getOrderData() {
    const order = await this.app.mysql.select('order', { 
        where: { 'rebuild_state': 0}, // WHERE 条件
        orders: [['create_time','desc'], ['id','desc']], // 排序方式
      });
      return {
        order,
        total: order.length,
      };
   }
   // 储存重建图片
   async saveDataImg(dataObj) {
    const { orderNumber, img } = dataObj;
    const order = await this.app.mysql.get('order', {'order_number': orderNumber});
    const user = await this.app.mysql.get('user', {'id': order.userid});
    const imgSrc = await this.saveImg(`${user.id}_${user.name}`, orderNumber, img);
    const row = {
        image: imgSrc,
    };
    const options = {
        where: {
          id: order.data_id,
        }
      };
    //  更新data表
     const result = await this.app.mysql.update('data', row, options);
     // 修改重建状态
     await this.app.mysql.update('order', {'rebuild_state': 1}, {where:{'order_number': orderNumber}});
     if (result.affectedRows === 1) {
         return true;
     } else {
         return false;
     }
   }
   // 储存图片文件，返回文件路径
   async saveImg(userPath,orderPath, img) {
    // 文件处理
    const fileData = Fs.readFileSync(img);
    const base64str = Buffer.from(fileData, 'binary').toString('base64');
    const bufferData = Buffer.from(base64str, 'base64');
    const uplaodBasePath = Path.join(process.cwd(), 'app/public/img');
    // 用户身份信息标示: 用户id+用户姓名
    const dirName = userPath;   
    // 文件完整存储路径：用户
    const dir = Path.join(uplaodBasePath, dirName);
    if (!Fs.existsSync(dir)) Fs.mkdirSync(dir);
    // 文件名不使用用户的，改成系统
    const src = Path.join(dir, orderPath+'.img'); // 文件完整存储位置
    // 保存文件
    try {
        await Fs.writeFileSync(src, bufferData); 
    } catch (e) {
      return false;
    }
    return src;
   }

   // 获取用户对应的订单和图片数据
   async getImgOrderByUser(user) {
    // 获取已经重建的订单
    const orders = await this.app.mysql.select('order', {
        where: { rebuild_state: 1},
        orders: [['create_time','desc'], ['id','desc']], // 排序方式
    });
    const dataIds = [];
    if (orders.length) {
        orders.forEach(item => {
            dataIds.push(item.data_id);
        });
        // 根据 order 获取data图片
        const datas = await this.app.mysql.select('data', {
            where: { id: [...dataIds]},
            orders: [['id','desc']], // 排序方式
        });
        return {
            orders,
            datas,
        };
    } else {
        return {
            orders:[],
            datas: [],   
        }
    }
   }
   async getClassfyImgData(classifyOption, classifyValue) {
        let option = null;
        switch(classifyOption) {
          case '性别': 
            option = {patient_sex: classifyValue==='男'? 1: 0};
            break;
          case '器官': 
            option = {patient_org: classifyValue};
            break;
          case '病位':
            option = {patient_part: classifyValue};
            break;
        }
        // 获取已经重建的订单
        const orders = await this.app.mysql.select('order', {
            where: Object.assign(option, {rebuild_state: 1}),
            orders: [['create_time','desc'], ['id','desc']], // 排序方式
        });
        const dataIds = [];
        if (orders.length) {
            orders.forEach(item => {
                dataIds.push(item.data_id);
            });
            // 根据 order 获取data图片
            const datas = await this.app.mysql.select('data', {
                where: { id: [...dataIds]},
                orders: [['id','desc']], // 排序方式
            });
            return {
                orders,
                datas,
            };
        } else {
            return {
                orders:[],
                datas: [],   
            }
        }

   }
}

module.exports = DataService;

