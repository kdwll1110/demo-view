<template>
	<el-menu @select="hasSelect" 
	:default-active="activeItem" 
	:router="true" 
	active-text-color="#ffd04b" 
	background-color="#545c64" 
	class="el-menu-vertical-demo"
		text-color="#fff">
		<el-menu-item :index="`/`">
			<template #title>
				<el-icon><House /></el-icon>
				<span>首页</span>
			</template>
		</el-menu-item>
		<template v-for="menu in routes">
			<template v-if="menu.children.length>0">
				<el-sub-menu :index="`${menu.path}`">
					<template #title>
						<component class="com" :is="menu.meta.icon" />
						<span>{{menu.meta.title}}</span>
					</template>
					<sidebar-item :items="menu.children"></sidebar-item>
				</el-sub-menu>
			</template>
			<template v-else>
				<component class="com" :is="menu.meta.icon" />
				<el-menu-item :index="`${menu.path}`">
					{{menu.meta.title}}
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script setup>
	import {
		ref,onMounted
	} from 'vue'
	import SidebarItem from './SidebarItem.vue'
	import {
		useAppStore
	} from '@/store/app.js'
		import {storeToRefs} from 'pinia'
	defineProps({
		routes: Object
	})
	
	const activeItem = ref('')
	const appStore = useAppStore()
	const {isShow,a} = storeToRefs(appStore)
	function hasSelect(index,indexPath,item){
		sessionStorage.setItem("activeMenu",index)
		if(index !== '/'){
			appStore.setIsShow(false)
		}else{
			appStore.setIsShow(true)
		}
	}
	
	function save(){
		let act = sessionStorage.getItem("activeMenu")
		if(act){
			activeItem.value = act
		}
	}
	
	onMounted(()=>{
		save()
	})
	
</script>

<style scoped>
	.com {
		width: 20px;
		height: 20px;
		margin-right: 5px;
	}
	
	.el-menu{
		border-right: none;
	}
</style>
