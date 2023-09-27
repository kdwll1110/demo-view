<template>
	
	<el-card shadow="never" size="small" >
		<template #header>
			<div class="card-header">
				<el-button type="success" @click="openDialog(1)">
					<el-icon><Plus/></el-icon>
					新增
				</el-button>
			</div>
		</template>

		<el-table :data="menuList" highlight-current-row :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }" row-key="id" default-expand-all border size="small" @row-click="onRowClick">
			<el-table-column label="菜单名称" min-width="200">
				<template #default="scope">
					<component :is="scope.row.icon"
						style="display: inline-block;width: 12px;position: relative;top: 2px;" />
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>

			<el-table-column label="类型" align="center" width="80">
				<template #default="scope">
					<el-tag v-if="scope.row.type === 1" type="warning">目录</el-tag>
					<el-tag v-if="scope.row.type === 2" type="success">菜单</el-tag>
					<el-tag v-if="scope.row.type === 3" type="danger">按钮</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="路由路径" align="left" width="250" prop="path" />

			<el-table-column label="组件路径" align="left" width="250" prop="component" />

			<el-table-column label="权限标识" align="center" width="200" prop="perms" />

			<el-table-column label="状态" align="center" width="80">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 1" type="success">显示</el-tag>
					<el-tag v-else type="info">隐藏</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="排序" align="center" width="80" prop="sort" />

			<el-table-column fixed="right" align="center" label="操作" width="220">
				<template #default="scope">
					<el-button v-if="scope.row.type == 1 || scope.row.type == 2" type="primary" link size="small"
						@click.stop="openDialog(scope.row.id)">
						<el-icon>
							<Plus />
						</el-icon>新增
					</el-button>

					<el-button type="primary" link size="small" @click.stop="openDialog(undefined, scope.row.id)">
						<el-icon>
							<Edit />
						</el-icon>编辑
					</el-button>

					<el-button type="primary" link size="small" @click.stop="handleDelete(scope.row.id)">
						<el-icon>
							<Delete />
						</el-icon>
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>

	<el-dialog v-model="dialog.status" :title="dialog.title" destroy-on-close append-to-body width="750px"
		@close="closeDialog">
		<el-form ref="menuFormRef" :model="formData" label-width="100px" :rules="rules">
			<el-form-item label="父级菜单" prop="parentId">
				<el-tree-select v-model="formData.parentId" placeholder="选择上级菜单" :data="menuOptions" filterable
					check-strictly :render-after-expand="false" />
			</el-form-item>

			<el-form-item label="菜单名称" prop="name" style="width: 680px">
				<el-input v-model="formData.name" placeholder="请输入菜单名称" />
			</el-form-item>

			<el-form-item label="菜单类型" prop="type">
				<el-radio-group v-model="formData.type" @change="onMenuTypeChange">
					<el-radio :label="1">目录</el-radio>
					<el-radio :label="2">菜单</el-radio>
					<el-radio :label="3">按钮</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item v-if="
	        formData.type == 1||
	        formData.type == 2
	      " label="路由路径" prop="path" style="width: 680px">
				<el-input v-if="formData.type == 1" v-model="formData.path" placeholder="systemmanage" />
				<el-input v-else v-model="formData.path" placeholder="usermanage" />
			</el-form-item>

			<!-- 组件页面完整路径 -->
			<el-form-item v-if="formData.type == 2" label="页面路径" prop="component">
				<el-input v-model="formData.component" placeholder="SystemManage/UserManage" style="width: 95%">
					<template v-if="formData.type == 2" #prepend>src/views/</template>
					<template v-if="formData.type == 2" #append>.vue</template>
				</el-input>
			</el-form-item>

			<!-- 权限标识 -->
			<el-form-item v-if="formData.type == 3" label="权限标识" prop="perms">
				<el-input v-model="formData.perms" placeholder="sys:user:add" />
			</el-form-item>

			<el-form-item v-if="formData.type !== 3" label="图标" style="width: 680px">
				<el-input v-model="formData.icon" placeholder="参考el-icon,手动输入图标,如：User、Delete、Edit..." />
			</el-form-item>


			<el-form-item v-if="formData.type !== 3" label="状态">
				<el-radio-group v-model="formData.status">
					<el-radio :label="1">显示</el-radio>
					<el-radio :label="0">隐藏</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="formData.sort" style="width: 100px" controls-position="right" :min="0" />
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="closeDialog">取 消</el-button>
			</div>
		</template>
	</el-dialog>

</template>

<script setup>
	import {
		ref,
		onMounted,
		reactive
	} from 'vue'
	import {
		loadRoleListByPage
	} from '@/api/role.js'
	import {
		loadAllMenu,
		addMenu,
		editMenu,
		loadMenuById,
		deleteMenu
	} from '@/api/menu.js'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'

	const rules = reactive({
		parentId: [{
			required: true,
			message: "请选择顶级菜单",
			trigger: "blur"
		}],
		name: [{
			required: true,
			message: "请输入菜单名称",
			trigger: "blur"
		}],
		type: [{
			required: true,
			message: "请选择菜单类型",
			trigger: "blur"
		}],
		path: [{
			required: true,
			message: "请输入路由路径",
			trigger: "blur"
		}],
		component: [{
			required: true,
			message: "请输入组件完整路径",
			trigger: "blur"
		}]
	});

	const menuList = ref([])
	const parentBorder = ref(false)
	const childBorder = ref(false)
	const dialog = ref({
		status: false,
		title: ''
	})
	const menuCacheData = ref({
		type: "",
		path: "",
	});

	const formData = ref({
		parentId: 1,
		status: 1,
		sort: 1,
		type: 2,
	})
	const menuFormRef = ref()
	const menuOptions = ref([])

	//列表加载
	function toLoadAllMenu() {
		loadAllMenu().then(res => {
			menuList.value = res.data
		})
	}

	/* 打开弹窗*/
	function openDialog(parentId, menuId) {
		console.log(parentId, menuId)

		loadAllMenu()
			.then(res => {
				menuOptions.value = [{
					value: 1,
					label: '顶级菜单',
					children: dataFormat(res.data, 1)
				}]
			})
			.then(() => {
				dialog.value.status = true
				if (menuId) {
					dialog.value.title = "编辑菜单";
					loadMenuById(menuId).then(({
						data
					}) => {
						console.log(data)
						//Object.assign(formData, data);
						formData.value = data
						console.log(formData.value)
						menuCacheData.value.type = data.type;
						menuCacheData.value.path = data.path ?? ""; //空值合并运算符
					});
				} else {
					dialog.value.title = "新增菜单";
					formData.value.parentId = parentId;
				}
			})
	}
	//格式数据
	function dataFormat(list, parentId) {
		let arr = []
		list.forEach(m => {
			if (m.parentId == parentId) {
				const obj = {
					label: m.name,
					value: m.id,
					children: dataFormat(m.children, m.id)
				}
				arr.push(obj)
			}
		})
		return arr
	}

	/** 菜单类型切换事件处理 */
	function onMenuTypeChange() {
		// 切换清空
		formData.value.path = ""
		formData.value.component = ""
		formData.value.perms = ""
	}

	/** 菜单保存提交 */
	function submitForm() {
		menuFormRef.value.validate((isValid) => {
			if (isValid) {
				const menuId = formData.value.id;
				if (menuId) {
					editMenu(menuId, formData.value).then((res) => {
						ElMessage.success("修改成功");
						closeDialog();
						toLoadAllMenu()
					});
				} else {
					addMenu(formData.value).then((res) => {
						ElMessage.success("新增成功");
						closeDialog();
						toLoadAllMenu()
					});
				}
			}
		});
	}

	/** 删除菜单 */
	function handleDelete(menuId) {
		if (!menuId) {
			ElMessage.warning("请勾选删除项");
			return false;
		}

		ElMessageBox.confirm(
				'确认删除已选中的数据项?',
				'警告', {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}
			)
			.then(() => {
				deleteMenu(menuId).then((res) => {
					if (!res.success) {
						return ElMessage.success(res.msg);
					}
					ElMessage.success(res.msg);
					toLoadAllMenu()
				});
			})
			.catch(() => ElMessage.info("已取消删除"))


	}


	/** 关闭弹窗 */
	function closeDialog() {
		dialog.value.status = false;
		resetForm();
	}

	/** 重置表单 */
	function resetForm() {
		menuFormRef.value.resetFields();
		menuFormRef.value.clearValidate();

		formData.value.id = undefined;
		formData.value.parentId = 1;
		formData.value.status = 1;
		formData.value.sort = 1;
		formData.value.perms = undefined;
		formData.value.component = undefined;
		formData.value.path = undefined;
	}

	onMounted(() => {
		toLoadAllMenu()
	})
</script>

<style scoped>
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

</style>
