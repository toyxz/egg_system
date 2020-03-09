const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
class Order extends Controller {
    async index() {

    }
    // 用户上传原始数据（压缩件）
    async uploadFile() {
       const { ctx } = this;
       const file = ctx.request.files[0];
       const data = Fs.readFileSync(file.filepath);
       const base64str = Buffer.from(data, 'binary').toString('base64');
       const bufferData = Buffer.from(base64str, 'base64');
       const uplaodBasePath = Path.join(process.cwd(), 'app/public/uploadRowData');
       if (!Fs.existsSync(uplaodBasePath)) Fs.mkdirSync(uplaodBasePath);
       const dirName = 'test_by_yaoxz__'+ 'zip';   // 用户身份信息标示。。
       const dir = Path.join(uplaodBasePath, dirName);
       if (!Fs.existsSync(dir)) Fs.mkdirSync(dir);
       const src = Path.join(dir, file.filename); // 文件完整存储位置
       try {
           // 这里不应该写入 而是存在内存中 等表单完整填后再存储 
           // 现在先测试下载功能
            await Fs.writeFileSync(src, bufferData); 
            ctx.body = { name: file.filename };
            ctx.status = 200;
        } catch (e) {
            ctx.body = {
                success: false,
                message: '上传文件失败',
            }
            ctx.status = 400; // ？？
        }
    }
    // 工作人员上传图片
    async uploadImage() {

    }
    // 用户提交订单
    async addOrder() {

    }
    // 展示用户订单列表
    async showUserOrder() {

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
}

module.exports = Order;