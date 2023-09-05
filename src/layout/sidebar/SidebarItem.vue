<template>
	<template v-for="item in items">
		<template v-if="item.children && item.children.length > 0">
			<el-sub-menu :index="item.path">
				<template #title>
					<component class="com" :is="item.meta.icon"/>
					<span>{{ item.meta.title }}</span>
				</template>
				<!-- 递归 -->
				<sidebar-item :items="item.children"></sidebar-item>
			</el-sub-menu>
		</template>
		<template v-else>
			<el-menu-item :index="item.path">
				<template #title>
					<component class="com" :is="item.meta.icon"/>
					<span>{{ item.meta.title}}</span>
				</template>
			</el-menu-item>
		</template>
	</template>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	
	defineProps({
		items:Object
	})
	
</script>

<style scoped>
	.com{
		width: 20px; height:20px;margin-right: 5px;
	}
</style>
