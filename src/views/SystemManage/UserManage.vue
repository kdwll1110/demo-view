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
						<el-option label="正常" :value="1" />
						<el-option label="停用" :value="0" />
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

	<el-card shadow="never" size="small">
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

		<el-table :data="userTableData" style="width: 100%;font-size: 12px;" :border="true" ref="multipleTableRef"
			:highlight-current-row="true" @selection-change="handleSelectionChange" :row-key="getRowKey">
			<el-table-column type="selection" width="55" :reserve-selection="true" />
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
			<el-table-column label="状态">
				<template #default="scope">
					<span>{{ scope.row.status==1?'正常':'停用' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button size="small" @click="openDialog(scope.row.id)">编辑</el-button>
					<el-button size="small" type="danger" @click="deleteCurrent(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="demo-pagination-block">
			<el-pagination v-model:current-page="current" :small="true" v-model:page-size="size"
				:page-sizes="[5,10, 20, 40, 80,200]" layout="total, sizes, prev, pager, next, jumper" :total="total"
				@size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>

	</el-card>



	<!-- 表单弹窗 -->
	<el-dialog v-model="dialog.status" :title="dialog.title" width="600px" append-to-body @close="closeDialog">
		<el-form ref="userFormRef" :model="formData" :rules="rules" label-width="80px">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="formData.username" :readonly="!!formData.id" placeholder="请输入用户名" />
			</el-form-item>

			<el-form-item label="手机号码" prop="telephone">
				<el-input v-model="formData.telephone" placeholder="请输入手机号码" maxlength="11" />
			</el-form-item>


			<el-form-item label="邮箱" prop="email">
				<el-input v-model="formData.email" placeholder="请输入邮箱" maxlength="50" />
			</el-form-item>

			<el-form-item label="角色" prop="roleIds">
				<el-select v-model="formData.roleIds" multiple placeholder="请选择" collapse-tags collapse-tags-tooltip
					:max-collapse-tags="3">
					<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="formData.status">
					<el-radio label="1">正常</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="handleSubmit">确 定</el-button>
				<el-button @click="closeDialog">取 消</el-button>
			</div>
		</template>
	</el-dialog>

</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		loadUserListByPage,
		loadUserById,
		editUser,
		addUser,
		deleteUser
	} from '@/api/user.js'

	import {
		loadAllRole
	} from '@/api/role.js'

	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'

	const queryForm = ref({})
	const current = ref(1)
	const size = ref(5)
	const total = ref(0)
	const userTableData = ref([])


	const roleList = ref([])
	//************************************************************

	const userFormRef = ref(); // 用户表单

	const dialog = ref({
		status: false,
	});

	const formData = ref({
		status: '1'
	});

	const rules = ref({
		username: [{
			required: true,
			message: "用户名不能为空",
			trigger: "blur"
		}],
		roleIds: [{
			required: true,
			message: "用户角色不能为空",
			trigger: "blur"
		}],
		telephone: [{
			required: true,
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: "请输入正确的手机号码",
			trigger: "blur",
		}],
		status: [{
			required: true,
			message: "请选择状态",
			trigger: "change"
		}],
	});
	const multipleSelection = ref([])
	const needDeleteIds = ref([])
	const multipleTableRef = ref()

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

	function resetQuery() {
		queryForm.value.username = undefined;
		queryForm.value.telephone = undefined;
		queryForm.value.status = undefined;
		toLoadUserList()
	}

	function toLoadRoleList() {
		loadAllRole().then(res => {
			roleList.value = res.data
		})
	}

	/** 打开表单弹窗 */
	async function openDialog(userId) {
		await toLoadRoleList();
		dialog.value.status = true;
		if (userId) {
			dialog.value.title = "修改用户";
			loadUserById(userId).then(res => {
				formData.value = res.data
			});
		} else {
			dialog.value.title = "新增用户";
		}
	}

	/** 表单提交 */
	const handleSubmit = () => {
		userFormRef.value.validate((valid) => {
			if (valid) {
				const userId = formData.value.id;
				if (userId) {
					editUser(userId, formData.value)
						.then((res) => {
							ElMessage.success(res.msg);
							closeDialog();
							resetQuery();
						})
				} else {
					addUser(formData.value)
						.then((res) => {
							ElMessage.success(res.msg);
							closeDialog();
							resetQuery();
						})
				}
			}
		});
	}

	/** 关闭表单弹窗 */
	function closeDialog() {
		dialog.value.status = false;
		resetForm();
	}

	/** 重置表单 */
	function resetForm() {
		userFormRef.value.resetFields();
		userFormRef.value.clearValidate();

		formData.value.id = undefined;
		formData.value.status = '1';
	}

	function handleSelectionChange(val) {
		multipleSelection.value = val
	}

	//保存选中的数据id,row-key就是要指定一个key标识这一行的数据
	function getRowKey(row) {
		return row.id
	}

	//删除角色
	function deleteCurrent(userId) {
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
				if (userId) { //单个删除
					needDeleteIds.value.push(userId)
				} else { //批量删除
					needDeleteIds.value = multipleSelection.value.map(u => u.id)
				}
				deleteUser(needDeleteIds.value).then(res => {
					if (res.success) {
						ElMessage.success(res.msg)
						toLoadUserList()
						multipleTableRef.value.clearSelection()
					} else {
						ElMessage.warning(res.msg)
					}
				})
			})
			.catch(() => ElMessage.info("已取消删除"))
	}

	onMounted(() => {
		toLoadUserList()
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
