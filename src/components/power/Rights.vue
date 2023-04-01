<template>
 <div>
  <el-card>
    <el-table :data="rightsList" border stripe> 
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template v-slot="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
 </div>
</template>

<script>
  import {getRightListFun} from '../../api/request-api'
 export default {
   name: '',
   data () {
     return {
      // 权限列表
      rightsList:[]
     }
   },
   props: {
   },
   components: {

   },
   methods: {
    async getRequest(){
      const res = await getRightListFun('list')
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
    }
   },
   mounted() {
  
   },
   async created(){
    this.getRequest()
   },
   watch: {

   },
   computed: {

   },
   filters: {

   }
 }
</script>

<style scoped lang='  less'>

</style>