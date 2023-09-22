<template>
	菜单管理
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
	import {ElMessage} from 'element-plus'
	
</script>

<style scoped>
</style>
