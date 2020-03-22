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
    async getSTL() {
        // 这里还差搜索功能    // todo
        const { ctx } = this;
        // const stlDataPath = Path.join(process.cwd(), 'app/public/stl');
        // const stlDataPath = 'app/public/stl';
        const stlDataPath = 'stl';
        const src = "al5"; // 需根据用户信息
        ctx.body = [
            {"name":"动脉","filePath":Path.join(stlDataPath, src, '0.stl'),"color":0xff0000,"opacity":1,"visible":true},
            {"name":"骨骼","filePath":Path.join(stlDataPath, src, '1.stl'),"color":0xe9e9ff,"opacity":0.5,"visible":true},
            {"name":"静脉","filePath":Path.join(stlDataPath, src, '2.stl'),"color":0x0000ff,"opacity":1,"visible":true},
            {"name":"脑","filePath":Path.join(stlDataPath, src, '3.stl'),"color":0xd2691e,"opacity":0.5,"visible":true},
            {"name":"皮肤","filePath":Path.join(stlDataPath, src, '4.stl'),"color":0xeee8aa,"opacity":0.25,"visible":true},
            {"name":"占位","filePath":Path.join(stlDataPath, src, '5.stl'),"color":0xffff00,"opacity":1,"visible":true},
        ]
    }
}

module.exports = Data;