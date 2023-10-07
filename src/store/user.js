import { defineStore } from 'pinia'


import req from '@/request'


export const useUserStore = defineStore({
	id:'user',
	state(){
		return {
			token:'',
			userInfo:{},
			userMenu:[]
		}
	},
	actions:{
		setUserInfo(user){
			this.userInfo = user
		},
		//{userMenu:值}
		setUserMenu(patchData){
			this.$patch(patchData)
		}
	}
})


