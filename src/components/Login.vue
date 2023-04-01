<template>
  <div class="body-bg">
    <div class="container">
      <!-- 注册 -->
      <div class="form-container sign-up-container">
        <el-form :model="registerForm" :rules="registerFormRules" ref="registerFormRef">
          <h1>注册</h1>
          <div class="social-container">
            <a href="#" class="social"><i class="fa fa-qq" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-weixin" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-weibo" aria-hidden="true"></i></a>
          </div>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" type="text" placeholder="Username..." prefix-icon="iconfont el-icon-s-custom"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="Password..." prefix-icon="iconfont el-icon-s-goods"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" type="email" placeholder="Email..." prefix-icon="iconfont el-icon-s-promotion"></el-input>
          </el-form-item>
          <el-form-item prop="mobile">
            <el-input v-model="registerForm.mobile" type="text" placeholder="Mobile..." prefix-icon="iconfont el-icon-mobile-phone"></el-input>
          </el-form-item>
          <el-button class="resgister-btn btn" @click="signUp">注册</el-button>
        </el-form>
      </div>
      <!-- 登录 -->
      <div class="form-container sign-in-container">
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <h1>登录</h1>
          <div class="social-container">
            <a href="#" class="social"><i class="fa fa-qq" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-weixin" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-weibo" aria-hidden="true"></i></a>
          </div>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" prefix-icon="iconfont el-icon-s-custom"
              placeholder="Username..."></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont el-icon-s-goods"
              placeholder="Password..."></el-input>
          </el-form-item>
          <a href="#">忘记密码？</a>
          <el-button class="login-btn btn" @click="signIn">登录</el-button>
        </el-form>
      </div>
      <!-- 覆盖容器 -->
      <div class="overlay-container">
        <div class="overlay">
          <!-- 左边覆盖 -->
          <div class="overlay-panel overlay-left">
            <h1>已有账号？</h1>
            <p>请使用您的账号进行登录</p>
            <button class="btn ologin-btn" @click="changeSignIn">登录</button>
          </div>
          <!-- 右边覆盖 -->
          <div class="overlay-panel overlay-right">
            <h1>没有账号？</h1>
            <p>立即注册加入我们，和我们一起开始旅程吧。</p>
            <el-button class="btn oregister-btn" @click="changeSignUp">
              注册
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkLogin,addUserFun} from "../api/request-api";
export default {
  name: "Login",
  data() {
    // 验证邮箱规则
    let checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      // 不合法
      callback(new Error('请输入合法邮箱'))
    }

    // 验证手机号规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      // 登录表单数据绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 登录表单的验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },

      // 注册表单数据绑定
      registerForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // // 注册表单的验证规则
      registerFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // validator:校验是否输入了邮箱
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          // validator:校验是否输入了邮箱
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 切换卡片的函数
    changeSignUp() {
      const container = document.querySelector(".container");
      container.classList.add("active");
    },
    changeSignIn() {
      const container = document.querySelector(".container");
      container.classList.remove("active");
    },

    signIn() {
      // 判断是否符合规定
      this.$refs.loginFormRef.validate(async (valid) => {
        // 不符合停止
        if (!valid) return;
        // 符合发送数据请求
        const res = await checkLogin(this.loginForm);
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg);
          // 将登录成功之后的token,保存到客户端的sessionStorage中
          // 项目中除了登录之外的其他API接口，必须在登录之后才能访问
          //  token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          sessionStorage.setItem("token", res.data.token)
          // 通过编程式导航跳转到后台主页，路由地址是/home
          this.$router.push('/home')
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    signUp() {
      // 表单预验证
      this.$refs.registerFormRef.validate(async valid => {
        // validate返回一个boolean类型的值 表示验证成功或失败
        if (!valid) return
        console.log(valid)
        // 通过
        const res = await addUserFun(this.registerForm)
        if(res.meta.status !== 201){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg+'，正在为您跳转...')
        setTimeout(()=>{
          location.reload()
        },1000)
      })
    }
  },
};
</script>

<style lang="less" scoped>
@import url("../assets/css/login.less");
</style>