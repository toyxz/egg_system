const Controller = require('egg').Controller;
const Path = require('path');
const Fs = require('fs');
class Data extends Controller {
    async index() {
        const { ctx } = this;

    } 
    async downloadZip() {
        const { ctx } = this;
        // 注意 这里之后要根据 用户信息来找文件的！！！
        // 还要注意 最具体的文件名要计算！！
        const filePath = Path.join(process.cwd(), 'app/public/uploadRowData','test_by_yaoxz__zip','phpMyAdmin-5.0.1-all-languages.zip');
        ctx.attachment('phpMyAdmin-5.0.1-all-languages.zip');
        ctx.set('Content-Type', 'application/octet-stream');
        const zipSrc = Fs.createReadStream(filePath);
        ctx.type = '.zip';
        ctx.body = zipSrc;
    }

}

module.exports = Data;