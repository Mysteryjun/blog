<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="ruleForm.description" />
      </el-form-item>
     
      <el-form-item label="SEO关键字" prop="seo_keyword">
        <el-input v-model="ruleForm.seo_keyword" />
      </el-form-item>
    
      <el-form-item label="展示" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类" prop="category_id">
        <el-select v-model="ruleForm.category_id" placeholder="请选择分类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort_order">
        <el-input v-model="ruleForm.sort_order" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <mavon-editor
          ref="md"
          v-model="ruleForm.content"
          code-style="atom-one-dark"
          @imgAdd="$imgAdd"
          @imgDel="$imgDel"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >立即更新</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { detail, update } from '@/api/article'
import { list } from '@/api/category'
import { getToken } from '@/api/upload'
import axios from 'axios'

export default {
  name: 'CategoryCreate',
  data() {
    return {
      token: '',
      categoryList: [],
      ruleForm: {
        id: this.$route.query.id,
        title: '',
        description: '',
       
        seo_keyword: '',
        status: 1,
        sort_order: 1,
        admin_id: '',
        category_id: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入文章描述', trigger: 'blur' }
        ],
       
        seo_keyword: [
          { required: true, message: '请输入 SEO 关键字', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入展示状态', trigger: 'blur' }
        ],
        sort_order: [
          { required: true, message: '请输入文章排序', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      adminInfo: (state) => state.admin.adminInfo
    })
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.$axios = axios.create({ withCredentials: false })
      this.getArticleDetail()
      this.getCategoryList()
    },
   
    // 获取文章详情
    async getArticleDetail() {
      try {
        const res = await detail({
          id: this.$route.query.id,
          is_markdown: false
        })
        this.ruleForm.title = res.data.title
        this.ruleForm.description = res.data.description
        
        this.ruleForm.content = res.data.content
        this.ruleForm.seo_keyword = res.data.seo_keyword
        this.ruleForm.status = res.data.status
        this.ruleForm.sort_order = res.data.sort_order
        this.ruleForm.category_id = res.data.category_info.id
        this.ruleForm.content = res.data.content
        this.ruleForm.admin_id =
          (this.adminInfo && this.adminInfo.id) || res.data.adminInfo.id
      } catch (err) {
        console.log(err)
      }
    },
    
    // 获取分类列表
    async getCategoryList() {
      try {
        this.listLoading = true
        const res = await list()
        this.categoryList = res.data.data
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
      }
    },
    // 提交表单
    submitForm(formName) {
      // 发布者id
      if (this.adminInfo) {
        this.ruleForm.admin_id = this.adminInfo.id
      }
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.updateArticle()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 更新文章
    async updateArticle() {
      try {
        const res = await update(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('更新成功，是否退出更新文章页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/article/index')
            })
        }
      } catch (err) {
        this.$message.error(err)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  box-sizing: border-box;
  margin: 24px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
