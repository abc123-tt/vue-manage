import request from '../axios/request'
// 这里是传参不是拼接
// 请求登录用户账号
export const checkLogin = (loginForm) =>{return request.post('/login',loginForm)}
// 请求侧边导航
export const getAsideFun = () => {return request.get('/menus')};
// 请求用户列表
export const getUserListFun = (queryInfoParams) =>{return request.get('/users',{params:queryInfoParams})}
// 修改switch状态
export const changeStateFun = (userInfo) =>{return request.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)}
// 添加用户
export const addUserFun = (addForm) =>{return request.post('/users' ,  addForm)}
// 查询用户信息
export const SelectUserFun = (path,id) => {return request.get(`/${path}/`+id)}
// 修改用户信息
export const EditUserFun = (path , id,obj) => {return request.put(`/${path}/`+id , {...obj})}
// 删除用户
export const DeleteUser = (path , id) => {return request.delete(`/${path}/`+id)}
// 角色管理
export const descributionRole = (id , Rid) => {return request.put('/users/'+ id +'/role' , {rid:Rid})}
// 添加角色
export const addRolesFun = (data)=>{return request.post('/roles' , data)}

// 获取权限列表
export const getRightListFun = (type)=>{return request.get('/rights/'+type)}
// 获取角色列表
export const getRolesListFun = ()=>{return request.get('/roles')}
// 删除用户权限
export const DeleteRight = (role, rightId) => {return request.delete(`roles/${role.id}/rights/${rightId}`)}
// 分配权限
export const allotRights = ( id, str) => {return request.post(`roles/${id}/rights`,{rids:str})}

// 获取商品列表
export const getGoodsListFun = (path , params) => {return request.get(`${path}` , {params:params})}
// 添加分类
export const addCateFun = (path , data) => {return request.post(`${path}` ,data)}

// 根据id查询分类
export const searchCateIdFun = (cateId) => {return request.get(`/categories/${cateId}`)}

// 修改参数
export const editParamsInfo = (path , obj , params) =>{return request.put(`${path}` , obj , {params:params})}
// 删除参数
export const deleteParamsFun = (path) =>{return request.delete(`${path}`)}

// 获取商品分类数据
export const getCateListFun = (path) =>{return request.get(`${path}`)}
