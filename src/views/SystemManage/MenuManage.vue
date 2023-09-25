<template>
	<el-card shadow="never" size="small">
		<template #header>
			<div class="card-header">
				<el-button type="success" @click="openDialog(0)">
					新增顶级菜单
				</el-button>
			</div>
		</template>

		<el-table v-loading="loading" :data="menuList" highlight-current-row :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }" row-key="id" default-expand-all border size="small" @row-click="onRowClick">
			<el-table-column label="菜单名称" min-width="200">
				<template #default="scope">
					<span v-if="scope.row.icon" style="display: inline-block;width: 1em;height: 1em;line-height: 1em;">
						<component :is="scope.row.icon" />
					</span>
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
						@click.stop="openAddDialog(scope.row.id)">
						<el-icon>
							<Plus />
						</el-icon>新增
					</el-button>

					<el-button type="primary" link size="small" @click.stop="openUpDateDialog(scope.row.id)">
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

	<el-dialog v-model="dialog.visible" :title="dialog.title" destroy-on-close append-to-body width="750px"
		@close="closeDialog">
		<el-form ref="menuFormRef" :model="formData" label-width="100px">
			<el-form-item label="父级菜单" prop="parentId">
				<el-input v-model="formData.parentId" placeholder="父级菜单" />
			</el-form-item>

			<el-form-item label="菜单名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入菜单名称" />
			</el-form-item>

			<el-form-item label="菜单类型" prop="type">
				<el-radio-group v-model="formData.type" @change="onMenuTypeChange">
					<el-radio label="1">目录</el-radio>
					<el-radio label="2">菜单</el-radio>
					<el-radio label="3">按钮</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item v-if="
	        formData.type == 1 ||
	        formData.type == 2
	      " label="路由路径" prop="path">
				<el-input v-if="formData.type == 1" v-model="formData.path" placeholder="system" />
				<el-input v-else v-model="formData.path" placeholder="user" />
			</el-form-item>

			<!-- 组件页面完整路径 -->
			<el-form-item v-if="formData.type == 2" label="页面路径" prop="component">
				<el-input v-model="formData.component" placeholder="system/user/index" style="width: 95%">
					<template v-if="formData.type == 2" #prepend>src/views/</template>
					<template v-if="formData.type == 2" #append>.vue</template>
				</el-input>
			</el-form-item>

			<!-- 权限标识 -->
			<el-form-item v-if="formData.type == 3" label="权限标识" prop="perm">
				<el-input v-model="formData.perms" placeholder="sys:user:add" />
			</el-form-item>

			<el-form-item v-if="formData.type !== 3" label="状态">
				<el-radio-group v-model="formData.visible">
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
				<el-button type="primary" @click="submitAddForm">确 定</el-button>
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
		loadRoleListByPage
	} from '@/api/role.js'
	import {
		loadAllMenu,
		loadMenuByRoleId,
		editMenuByRoleId
	} from '@/api/menu.js'
	import {
		ElMessage
	} from 'element-plus'

	const menuList = ref([])
	const parentBorder = ref(false)
	const childBorder = ref(false)
	const loading = ref(false)
	const dialog = ref({
		visible: false,
		title: ''
	})

	const formData = ref({})

	function toLoadAllMenu() {
		loadAllMenu().then(res => {
			menuList.value = res.data
		})
	}



	function openAddDialog(currentMenuId) {
		dialog.value.visible = true
		dialog.value.title = '新增'
		console.log(currentMenuId)

	}

	function submitAddForm() {
		console.log(formData.value)
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
