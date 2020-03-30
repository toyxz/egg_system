const Service = require('egg').Service;
// 父级都是页面级别的
const permissionObjWrapper = {
    userInfo: {
        auth: false,
        children: {},
    },
    userData: {
        auth: false,
        children: {},
    },
    userOrder: {
        auth: false,
        children: {},
    },
    auditInfo: {
        auth: false,
        children: {},
    },
    auditOrder: {
        auth: false,
        children: {},
    },
    handleOrder: {
        auth: false,
        children: {},     
    },
    handleEmployee: {
        auth: false,
        children: {},         
    },
    rebuildData: {
        auth: false,
        children: {},      
    },
    handlePermission: {
        auth: false,
        children: {},        
    }
}
class AuthService extends Service {
   async getAuth(requestObj) {
       if (requestObj.userAccount) {
          // 返回login
          return {
              state: false,
              auth: {},
          }
       } else {
        const token = this.ctx.cookies.get('authToken');
        if (token) {
            const userAccount = await this.app.jwt.verify(token, this.config.jwt.secret).name;
            // console.log('????????????', userAccount)
            // 查看角色
            const account = await this.app.mysql.get('account', {username: userAccount});
            const user = await this.app.mysql.get('user', {account_id: account.id});
            const employee = await this.app.mysql.get('employee', {account_id: account.id});
            let auth = [];
            // 如果能在 user 表找到，就是用户，否则就是 就查employee
            if (user) {
                // console.log('---',user)
                auth = await this.getUserAuth(user);
                return {
                    state: true,
                    auth,
                }
            } else if (employee) {
                auth = await this.getEmployeeAuth(employee);
                // console.log('????????????', auth)
                return {
                    state: true,
                    auth,
                }
            } else {
                return {
                    state: false,
                    auth: {}
                }
            }
        } else {
            return {
                state: false,
                auth: {}
            }    
        }
       }
       return 'hwhe'
   }
   // 获取用户权限
   async getUserAuth(user) {
    //  const role = await this.app.mysql.get('role', {id: employee.role_id})
    const rolePermission = await this.app.mysql.select('role_perission', {
        where: { role_id: 4},
        orders: [['id','desc']], // 排序方式
     }); 
     const permissionIds = [];
     rolePermission.forEach((item, index) => {
        permissionIds.push(item.permission_id);
     });
     // 获取权限
     const permission = await this.app.mysql.select('permission', {
        where: { id: [...permissionIds]},
        orders: [['create_time','desc']], // 排序方式
     }); 
     return  this.handlePermissionToObj(permission);
   }
   // 获取员工权限
   async getEmployeeAuth(employee) {
    //  const role = await this.app.mysql.get('role', {id: employee.role_id})
     const rolePermission = await this.app.mysql.select('role_perission', {
        where: { role_id: employee.role_id},
        orders: [['id','desc']], // 排序方式
     }); 
     const permissionIds = [];
     rolePermission.forEach((item, index) => {
        permissionIds.push(item.permission_id);
     });
     // 获取权限
     const permission = await this.app.mysql.select('permission', {
        where: { id: [...permissionIds]},
        orders: [['create_time','desc']], // 排序方式
     }); 
     return  this.handlePermissionToObj(permission);
   }
   // 讲权限转换为对象数据
   async handlePermissionToObj(permission) {
       const permissionName = [];
       permission.forEach(item => {
          permissionName.push(item.name)
       });
       let permissionObj = JSON.parse(JSON.stringify(permissionObjWrapper));
       // permissionObj 暂时只有两层结构
       permissionName.forEach(item => {
          switch(item) {
            case '查看个人信息': permissionObj.userInfo.auth = true;break;
            case '查看个人数据': permissionObj.userData.auth = true;break;
            case '查看个人订单': permissionObj.userOrder.auth = true;break;
            case '审核注册信息': permissionObj.auditInfo.auth = true;break;
            case '审核订单': permissionObj.auditOrder.auth = true;break;
            case '订单管理': permissionObj.handleOrder.auth = true;break;
            case '员工管理': permissionObj.handleEmployee.auth = true;break;
            case '重建数据': permissionObj.rebuildData.auth = true;break;
            case '权限管理': permissionObj.handlePermission.auth = true;break;
          }
       });
       return permissionObj;
   }

}

module.exports = AuthService;

