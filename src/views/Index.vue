<template>
	<div class="common-layout">
		views下面的首页 
	</div>
</template>


<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'

	import {
		useRouter
	} from 'vue-router'

	import {
		useAppStore
	} from '@/store/app.js'
	import {
		storeToRefs
	} from 'pinia'
	
	onMounted(() => {})
</script>
<style scoped></style>
