<template>
	<div class="common-layout">
		<el-container>
			<el-aside>
				<el-scrollbar>
					<Sidebar :routes="routes"></Sidebar>
				</el-scrollbar>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
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
	import {useRouter} from 'vue-router'
	import Sidebar from '../layout/sidebar/Sidebar.vue'



	const router = useRouter()
	//console.log(router.getRoutes())
	const routes = computed(() => {
		let rts = router.getRoutes().filter(r => r.meta.isShow && r.meta.parentId == 1)
		
		return rts;
	})
	
	onMounted(() => {
		
	})
</script>
<style scoped>
	
	.el-container{
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.el-aside{
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

	.el-main{
		min-height: 100%;
		margin-left: 300px;
		transition: margin-left 0.28s;
	}

</style>
