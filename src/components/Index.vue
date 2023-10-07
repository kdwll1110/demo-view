<template>
	<div class="common-layout">
		<!-- <el-container>
			<el-aside>
				<el-scrollbar>
					<Sidebar :routes="routes"></Sidebar>
				</el-scrollbar>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container> -->
		<el-container>
			<el-aside>
				<el-scrollbar>
					<Sidebar :routes="routes"></Sidebar>
				</el-scrollbar>
			</el-aside>
			<el-container>
				<el-header>
					<el-row class="block-col-2" justify="end">
						<el-col :span="24">
							<el-dropdown trigger="click">
								<span class="el-dropdown-link">
									<el-avatar shape="square" :size="50" :src="`/src/assets/dynamic.gif`" />
									<!-- <el-upload ref="uploadRef" class="avatar-uploader"
										:action="`http://localhost:9999/upload/uploadImagesToLocal`" :limit="1" :on-exceed="handleExceed"
										:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="myHeaders" 
										:auto-upload="false"
										list-type="picture-card">
										<template #trigger>
											<img class="el-upload-list__item-thumbnail" :src="userInfo.avatar" alt=""
												width="40" />
										</template>
									</el-upload> -->
									
								</span>
								
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item>修改头像</el-dropdown-item>
										<el-dropdown-item>修改密码</el-dropdown-item>
										<el-dropdown-item>退出登录</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</el-col>
					</el-row>
<el-button @click="submitUpload">上传</el-button>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>


<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'

	import axios from '@/request/index.js'
	import {
		useRouter
	} from 'vue-router'
	import Sidebar from '../layout/sidebar/Sidebar.vue'
	import {
		useUserStore
	} from '@/store/user.js'

	const router = useRouter()
	const routes = computed(() => {
		let rts = router.getRoutes().filter(r => r.meta.isShow && r.meta.parentId == 1)
		return rts;
	})
	
/* 	const uploadRef = ref()
	const userStore =  useUserStore();
	
	const myHeaders = ref({
		authorization:''
	})

	//文件上传成功时的钩子
	function handleAvatarSuccess(response, uploadFile, uploadFiles) {
		//this.applicationInfo.aiHeadPicture = response.data
		//const userStore =  useUserStore();
		console.log(response.data)
		userStore.setAvatar(response.data)
	}
	
	//手动确认上传
	function submitUpload() {
		myHeaders.value.authorization = userStore.token
		console.log(userStore)
		uploadRef.value.submit()
		console.log(1)
	}
	
	//处理超出
	function handleExceed(files, uploadFiles) {
		uploadRef.value.clearFiles()
		const file = files[0]
		file.uid = genFileId()
		uploadRef.value.handleStart(file)
	}
	
	//上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
	function beforeAvatarUpload(rawFile) {
		if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
			if (rawFile.size / 1024 / 1024 > 2) {
				ElMessage.error('上传的文件大小不能超过 2MB!')
				return false
			}
			return true
		}
		ElMessage.error('上传的图片格式有误！')
		return false
	} */
	
	onMounted(() => {
	})
	
</script>
<style scoped>
	.el-container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.el-aside {
		position: fixed;
		overflow: hidden;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1001;
		width: 300px !important;
		height: 100%;
		transition: width 0.28s;
		background-color: #545c64;
	}

	.el-main {
		min-height: 100%;
		margin-left: 300px;
		transition: margin-left 0.28s;
	}

	.el-header {
		height: 80px;
		margin-left: 300px;
		border-bottom: 1px solid gainsboro;
		padding: 0;
	}

	.block-col-2 {
		text-align: end;
		background-color: pink;
	}

	.el-dropdown-link {
		display: inline-block;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		text-align: center;
		border-radius: 5px;
	}
</style>
