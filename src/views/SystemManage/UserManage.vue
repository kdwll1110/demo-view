<template>
	
	<el-card shadow="always" size="small" style="margin-bottom: 20px;">
		<div>
			<el-row justify="left" align="middle" :gutter="10">
				<el-col :span="2"><span style="opacity: 0.7;">关键字</span></el-col>
				<el-col :span="4">
					<el-input v-model="queryForm.username" clearable placeholder="请输入用户名..." />
				</el-col>
				<el-col :span="4">
					<el-input v-model="queryForm.telephone" clearable placeholder="请输入手机号码..." />
				</el-col>
				<el-col :span="4">
					<el-select v-model="queryForm.status" clearable placeholder="默认查询所有">
					    <el-option label="正常" :value="1"/>
						<el-option label="停用" :value="0"/>
					  </el-select>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" @click="toLoadUserList">
						<el-icon>
							<Search />
						</el-icon>
						搜索
					</el-button>
				</el-col>
				<el-col :span="1">
					<el-button @click="resetQuery">
						<el-icon>
							<Refresh />
						</el-icon>
						重置
					</el-button>
				</el-col>
			</el-row>
	
		</div>
	</el-card>
	
	<el-table :data="userTableData" style="width: 100%;font-size: 12px;" :border="true" :highlight-current-row="true">
		<el-table-column label="用户名">
			<template #default="scope">
				<div style="display: flex; align-items: center">
					<span>{{ scope.row.username }}</span>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="手机号">
			<template #default="scope">
				<span>{{ scope.row.telephone }}</span>
			</template>
		</el-table-column>
		<el-table-column label="邮箱">
			<template #default="scope">
				<span>{{ scope.row.email }}</span>
			</template>
		</el-table-column>
		<el-table-column label="头像">
			<template #default="scope">
				<span>{{ scope.row.avatar?scope.row.avatar:'暂未设置'}}</span>
			</template>
		</el-table-column>
		<el-table-column label="状态">
			<template #default="scope">
				<span>{{ scope.row.status==1?'正常':'停用' }}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作">
			<template #default="scope">
				<el-button size="small" @click="toEdit(scope.row)">编辑</el-button>
				<el-button size="small" type="danger" @click="deleteCurrent(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>

	<div class="demo-pagination-block">
		<el-pagination v-model:current-page="current" :small="true" v-model:page-size="size" :page-sizes="[5,10, 20, 40, 80,200]"
			layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
			@current-change="handleCurrentChange" />
	</div>


	<el-dialog v-model="dialogFormVisible" title="编辑">
		<el-form :model="userForm">
			<el-form-item label="用户名" >
				<el-input v-model="userForm.username" disabled />
			</el-form-item>
			<el-form-item label="手机号" >
				<el-input v-model="userForm.telephone" disabled />
			</el-form-item>
			<el-form-item label="邮箱" >
				<el-input v-model="userForm.email" disabled />
			</el-form-item>
			<el-form-item label="头像" >
				<el-input v-model="userForm.avatar" disabled />
			</el-form-item>
			<el-form-item label="当前角色" >
				<el-select v-model="userForm.roles">
					<el-option 
					:label="role.name" 
					:value="role.id" 
					v-for="role in roleList" 
					:key="role.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="状态" >
				<el-select v-model="userForm.status">
					<el-option label="使用" value="1" />
					<el-option label="停用" value="0" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">返回</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">
					确认
				</el-button>
			</span>
		</template>
	</el-dialog>

</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		loadUserListByPage
	} from '@/api/user.js'
	
	import {loadAllRole} from  '@/api/role.js'

	const queryForm = ref({
		
	})
	const current = ref(1)
	const size = ref(5)
	const total = ref(0)
	const userTableData = ref([])

	const dialogFormVisible = ref(false)
	const userForm = ref({})
	
	
	const roleList = ref([])

	function toLoadUserList() {
		loadUserListByPage(current.value, size.value, queryForm.value).then(res => {
			userTableData.value = res.data.info
			total.value = res.data.total
			current.value = res.data.current
			size.value = res.data.size
		})
	}

	function handleSizeChange(val) {
		size.value = val
		toLoadUserList()
	}

	function handleCurrentChange(val) {
		current.value = val
		toLoadUserList()
	}

	function toEdit(user) {
		dialogFormVisible.value = true
		userForm.value = user
		toLoadRoleList()
	}
	
	function confirmEdit(){
		
	}

	function deleteCurrent(user) {

	}
	
	function resetQuery() {
		queryForm.value.username = undefined;
		queryForm.value.telephone = undefined;
		queryForm.value.status = undefined;
		toLoadUserList()
	}
	
	function toLoadRoleList(){
		loadAllRole().then(res=>{
			roleList.value = res.data
		})
	}


	onMounted(() => {
		toLoadUserList()
	})
</script>

<style scoped>
	.demo-pagination-block {
		margin-top: 20px;
	}
</style>
