const  Path = require('path');
module.exports = appInfo => {
	const config = exports = {};
    config.keys = appInfo.name + '_1583142601162_8887';
    config.security= {
        csrf : {
          headerName: 'x-csrf-token',// 自定义请求头
        }
    };
    config.mysql = {
        // 单数据库信息配置
        client: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: 'yao37mac',
        // 数据库名
        database: 'Web3D',
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
    };
    config.bcrypt = {
        saltRounds: 10 // default 10
    };
    config.jwt = {
        secret: "yao37hasasecret" //自己设置的密钥
    };
    config.multipart = {
        mode: 'file',
        fileSize: '50mb',
        whitelist: [
            '.zip','.rar','.jpg','.jpeg','.png', '.gif', '.bmp'
        ],
    };
    config.static = {
        prefix: '/public/',
        dynamic: true,
        dir: Path.join(appInfo.baseDir, 'app/public')
    };
    config.sequence = 0;
	return {
        ...config,
	};
};