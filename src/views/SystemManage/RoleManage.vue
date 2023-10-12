<template>
	<el-card shadow="always" size="small" style="margin-bottom: 20px;">
		<div>
			<el-row justify="left" align="middle">
				<el-col :span="2"><span style="opacity: 0.7;">关键字</span></el-col>
				<el-col :span="4">
					<el-input v-model="queryForm.name" clearable placeholder="请输入角色名称..." />
				</el-col>
				<el-col :span="2">
					<el-button type="primary" @click="toLoadRoleList">
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

	<el-card shadow="always" size="small">
		<template #header>
			<div class="card-header">
				<el-button type="success" @click="openDialog()">
					<el-icon>
						<Plus />
					</el-icon>
					新增
				</el-button>
				<el-button type="danger" @click="deleteCurrent()">批量删除</el-button>
			</div>
		</template>


		<el-table :data="roleTableData" style="width: 100%;font-size: 12px;" :border="true" ref="multipleTableRef"
			:highlight-current-row="true" @selection-change="handleSelectionChange" :row-key="getRowKey">
			<el-table-column type="selection" width="55" :reserve-selection="true" />
			<el-table-column label="角色名称">
				<template #default="scope">
					<div style="display: flex; align-items: center">
						<span>{{ scope.row.name }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="角色编码">
				<template #default="scope">
					<div style="display: flex; align-items: center">
						<span>{{ scope.row.roleKey }}</span>
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
					<el-button size="small" @click="openDialog(scope.row.id)">编辑</el-button>
					<el-button size="small" type="primary" @click="toSettingPermission(scope.row)">分配权限</el-button>
					<el-button size="small" type="danger" @click="deleteCurrent(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
	<div class="demo-pagination-block">
		<el-pagination v-model:current-page="current" :small="true" v-model:page-size="size"
			:page-sizes="[2,4,8,10, 20, 40, 80,200]" layout="total, sizes, prev, pager, next, jumper" :total="total"
			@size-change="handleSizeChange" @current-change="handleCurrentChange" />
	</div>

	<el-dialog v-model="dialog.status" :title="dialog.title" width="500px" @close="closeDialog">
		<el-form ref="roleFormRef" :model="formData" :rules="rules" label-width="100px">
			<el-form-item label="角色名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入角色名称" clearable />
			</el-form-item>

			<el-form-item label="角色编码" prop="roleKey">
				<el-input v-model="formData.roleKey" placeholder="请输入角色编码" clearable />
			</el-form-item>

			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="formData.status">
					<el-radio :label="1">正常</el-radio>
					<el-radio :label="0">停用</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="handleSubmit">确 认</el-button>
				<el-button @click="closeDialog">取 消</el-button>
			</div>
		</template>
	</el-dialog>

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
		loadRoleListByPage,
		loadRoleById,
		addRole,
		editRole,
		deleteRole
	} from '@/api/role.js'
	import {
		loadAllMenu,
		loadMenuByRoleId,
		editMenuByRoleId
	} from '@/api/menu.js'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'

	const queryForm = ref({
		name: ''
	})
	const current = ref(1)
	const size = ref(2)
	const total = ref(0)
	const roleTableData = ref([])

	const dialogFormVisible = ref(false)
	const roleForm = ref({})

	const menuList = ref([])
	const treeRef = ref()
	const defaultCheckedKeys = ref([])

	const defaultProps = {
		children: 'children',
		label: 'name',
	}
	const roleId = ref('')

	const roleNameKeyword = ref(undefined)

	const rules = ref({
		name: [{
			required: true,
			message: "请输入角色名称",
			trigger: "blur"
		}],
		roleKey: [{
			required: true,
			message: "请输入角色编码",
			trigger: "blur"
		}],
		status: [{
			required: true,
			message: "请选择状态",
			trigger: "blur"
		}],
	});

	const multipleSelection = ref([])
	
	const multipleTableRef = ref()

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

	const dialog = ref({
		visible: false,
	});
	const formData = ref({
		status: 1,
		roleKey: "",
		name: "",
	});
	const roleFormRef = ref()

	const needDeleteIds = ref([])

	/** 打开角色表单弹窗 */
	function openDialog(roleId) {
		dialog.value.status = true;
		if (roleId) {
			dialog.value.title = "修改角色";
			loadRoleById(roleId).then(({
				data
			}) => {
				Object.assign(formData.value, data);
			});
		} else {
			dialog.value.title = "新增角色";
		}
	}

	/** 关闭表单弹窗 */
	function closeDialog() {
		dialog.value.status = false;
		resetForm();
	}

	/** 重置表单 */
	function resetForm() {
		roleFormRef.value.resetFields();
		roleFormRef.value.clearValidate();

		formData.value.id = undefined;
		formData.value.status = 1;
	}

	/** 角色保存提交 */
	function handleSubmit() {
		roleFormRef.value.validate((valid) => {
			if (valid) {
				const roleId = formData.value.id;
				if (roleId) {
					editRole(roleId, formData.value)
						.then((res) => {
							ElMessage.success(res.msg);
							closeDialog();
							resetQuery();
						})
				} else {
					addRole(formData.value)
						.then((res) => {
							ElMessage.success(res.msg);
							closeDialog();
							resetQuery();
						})
				}
			}
		});
	}

	function handleSelectionChange(val) {
		multipleSelection.value = val
	}

	//保存选中的数据id,row-key就是要指定一个key标识这一行的数据
	function getRowKey(row) {
		return row.id
	}

	//删除角色
	function deleteCurrent(roleId) {
		ElMessageBox.confirm(
				'确认删除已选中的数据项?',
				'警告', {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}
			)
			.then(() => {
				needDeleteIds.value = []
				if (roleId) { //单个删除
					needDeleteIds.value.push(roleId)
				} else { //批量删除
					needDeleteIds.value = multipleSelection.value.map(m => m.id)
				}
				deleteRole(needDeleteIds.value).then(res => {
					if (res.success) {
						ElMessage.success(res.msg)
						toLoadRoleList()
						multipleTableRef.value.clearSelection()
					} else {
						ElMessage.warning(res.msg)
					}
				})
			})
			.catch(() => ElMessage.info("已取消删除"))
	}

	async function toSettingPermission(role) {
		roleId.value = role.id
		dialogFormVisible.value = true
		await loadAllMenu().then(res => {
			menuList.value = res.data
		})
		await loadMenuByRoleId(role.id).then(res => {
			//生成ids
			let list = res.data;
			if (list && list.length > 0) {
				recursiveGenerationIds(res.data)
				const ids = defaultCheckedKeys.value.map(r => r.id);
				ids.forEach((i, n) => {
					treeRef.value.setChecked(i, true, false)
				});
			}
		})
	}

	function recursiveGenerationIds(list) {
		for (let node of list) {
			defaultCheckedKeys.value.push(node)
			if (node.children && node.children.length > 0) {
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
		editMenuByRoleId(roleId.value, ids).then(res => {
			ElMessage.success(res.msg);
			dialogFormVisible.value = false;
		})
	}


	function resetQuery() {
		queryForm.value.name = undefined;
		toLoadRoleList()
	}



	onMounted(() => {
		toLoadRoleList()

	})
</script>

<style scoped>
	.demo-pagination-block {
		margin-top: 20px;
	}

	.card-header {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
