<template>
	<el-table :data="roleTableData" style="width: 100%;font-size: 12px;" :border="true" :highlight-current-row="true">
		<el-table-column label="角色名称">
			<template #default="scope">
				<div style="display: flex; align-items: center">
					<span>{{ scope.row.name }}</span>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="状态">
			<template #default="scope">
				<span>{{ scope.row.status==1?'正常':'禁用' }}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作">
			<template #default="scope">
				<el-button size="small" @click="toEdit(scope.row)">编辑</el-button>
				<el-button size="small" type="primary" @click="toSettingPermission(scope.row)">分配权限</el-button>
				<el-button size="small" type="danger" @click="deleteCurrent(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>

	<div class="demo-pagination-block">
		<el-pagination v-model:current-page="current" :small="true" v-model:page-size="size"
			:page-sizes="[2,4,8,10, 20, 40, 80,200]" layout="total, sizes, prev, pager, next, jumper" :total="total"
			@size-change="handleSizeChange" @current-change="handleCurrentChange" />
	</div>


	<el-dialog v-model="dialogFormVisible" title="分配权限" destroy-on-close @closed="closed" width="40%">
		<el-tree ref="treeRef" :data="menuList" show-checkbox default-expand-all node-key="id" highlight-current
			:props="defaultProps" @check-change="checkChangeClick" :default-checked-keys="defaultCheckedKeys"
			@check="add" />
		<div class="buttons">
			<el-button @click="confirmSetting">确认分配</el-button>
		</div>
	</el-dialog>

</template>

<script setup>
	import {
		ref,
		onMounted,
		nextTick 
	} from 'vue'
	import {
		loadRoleListByPage
	} from '@/api/role.js'
	import {
		loadAllMenu,
		loadMenuByRoleId,
		editMenuByRoleId
	} from '@/api/menu.js'
	import {ElMessage} from 'element-plus'

	const queryForm = ref({
		name: ''
	})
	const current = ref(1)
	const size = ref(2)
	const total = ref(0)
	const roleTableData = ref([])

	const dialogFormVisible = ref(false)
	const roleForm = ref({})
	const formLabelWidth = '140px'

	const menuList = ref([])
	const treeRef = ref()
	const defaultCheckedKeys = ref([])

	const defaultProps = {
		children: 'children',
		label: 'name',
	}
	const roleId = ref('')


	function toLoadRoleList() {
		loadRoleListByPage(current.value, size.value, queryForm.value).then(res => {
			roleTableData.value = res.data.info
			total.value = res.data.total
			current.value = res.data.current
			size.value = res.data.size
		})
	}

	function handleSizeChange(val) {
		size.value = val
		toLoadRoleList()
	}

	function handleCurrentChange(val) {
		current.value = val
		toLoadRoleList()
	}

	function toEdit(role) {
		dialogFormVisible.value = true
		roleForm.value = role
		toLoadRoleList()
	}

	function confirmEdit() {
		console.log('222')
	}

	function deleteCurrent(role) {

	}

	async function toSettingPermission(role) {
		roleId.value = role.id
		dialogFormVisible.value = true
		await loadAllMenu().then(res => {
			menuList.value = res.data
		})
		await loadMenuByRoleId(role.id).then(res => {
			//生成ids
			recursiveGenerationIds(res.data)
			const ids = defaultCheckedKeys.value.map(r=>r.id);
			ids.forEach((i,n) => {
			    treeRef.value.setChecked(i, true, false)
			});
			
		})
	}
	
	function recursiveGenerationIds(list) {
		for (let node of list) {
			defaultCheckedKeys.value.push(node)
			if(node.children && node.children.length>0){
				recursiveGenerationIds(node.children)
			}
		}
	}
	



	function closed() {
		defaultCheckedKeys.value = []
	}

	function confirmSetting() {
		const ids = treeRef.value.getCheckedKeys(false)
		treeRef.value.getHalfCheckedKeys().forEach(e => {
			ids.push(e)
		})
		editMenuByRoleId(roleId.value,ids).then(res=>{
			ElMessage.success(res.msg);
			dialogFormVisible.value = false;
		})
	}

	function add(a, b) {
		console.log(a)
		console.log(b)
	}



	onMounted(() => {
		toLoadRoleList()

	})
</script>

<style scoped>
	.demo-pagination-block {
		margin-top: 20px;
	}
</style>
