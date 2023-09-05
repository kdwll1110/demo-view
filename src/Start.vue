<template>
	<el-config-provider :locale="locale">
		<router-view></router-view>
	</el-config-provider>
	
</template>

<script setup>
	import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
	import {computed,onMounted} from 'vue'
	
	
	
	const locale = computed(()=>{
		return zhCn;
	})
	
</script>

<style scoped>
</style>
