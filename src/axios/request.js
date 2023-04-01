import axios from 'axios'

const instance = axios.create({
    baseURL:'https://lianghj.top:8888/api/private/v1/',
    timeout:5000
})

// 请求拦截器
instance.interceptors.request.use(config=>{
    // console.log('每一次发起请求前，都会先执行这里的代码');
    // console.log(config) // 本次请求的配置信息
    // 解决无效token
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
},err=>{
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(res=>{
    // console.log("每一次收到响应，都会先执行这里的代码");
    return res.data
},err=>{
    return Promise.reject(err)
})


// requests.interceptors.request.use(()=>{
//     // config:配置对象，header请求头
//     // 在请求拦截器里面开始进度条
//     nprogress.start();
//     return config;
// });
 
// // 响应拦截器,服务端响应数据回来以后，响应拦截器可以检测到，可以做一些事情
// requests.interceptors.response.use((res)=>{
//     // 进度条结束
//     nprogress.done();
//     return res.data()    ;
// },(error)=>{
// // 响应失败的回调函数
// return Promise.reject(new Error('faile'));
// });
export default instance