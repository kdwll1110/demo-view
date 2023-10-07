<template>
	<div class="box">

		<el-card class="box-card" shadow="always">
			<el-form :model="loginForm" :rules="loginRules" ref="loginRef">
				<el-row>
					<el-col :span="14" :offset="5">
						<el-form-item label="账号" prop="username">
							<el-input v-model="loginForm.username" placeholder="请输入用户名" clearable />
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
					<el-col :span="14" :offset="5">
						<el-form-item label="密码" prop="password">
							<el-input v-model="loginForm.password" type="password" placeholder="请输入密码" clearable />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :offset="10">
						<el-form-item>
							<el-button type="primary" @click="doSubmit(loginRef)">登录</el-button>
						</el-form-item>
					</el-col>
				</el-row>


			</el-form>
		</el-card>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {test,login} from '@/api/user.js'
	
	import {useUserStore} from '@/store/user.js'
	import {useRoute,useRouter} from 'vue-router'
	
	const route = useRoute()
	const router = useRouter()
	
	const userStore = useUserStore()
	
	const loginForm = ref({
		username: '',
		password: ''
	})



	const loginRef = ref()

	const loginRules = ref({
		username: [{
			required: true,
			message: '请输入账号',
			trigger: 'blur'
		}],
		password: [{
			required: true,
			message: '请输入密码',
			trigger: 'blur'
		}]
	})


	const doSubmit = (form) => {
		form.validate(async (valid)=>{
			if(valid){
				const res =await login(loginForm.value)
				router.push(route.query.redirect || '/')
				
			}else{
				console.log(2)
			}
		})
	}

</script>

<style scoped>
	.box {
		width: 400px;
		height: 200px;
		margin: 50px auto 0;
	}
</style>
