import { defineStore } from 'pinia'



export const useAppStore = defineStore({
	id:'app',
	state(){
		return {
			isShow:true
		}
	},
	actions:{
		setIsShow(flag){
			this.isShow = flag
		}
	},
	persist: {
	    enabled: true // true 表示开启持久化保存
	}
})
