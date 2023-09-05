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

// function login(loginInfo) {
	// 	return new Promise((resolve, reject) => {
	// 		axios.post('/user/login', loginInfo.value).then(async res => {
	// 			sessionStorage.setItem('token', res.data.token)
	// 			token.value = res.data.token
	// 			await getMenuAndPermisson()
	// 			resolve()
	// 		}).catch(err => {
	// 			reject(err)
	// 		})
	// 	})
	// }

	// function getMenuAndPermisson  () {
	// 	return new Promise((resolve, reject) => {
	// 		axios.get('/user/queryMenuByToken')
	// 			.then(res => {
	// 				sessionStorage.setItem('menuList', JSON.stringify(res.data.menuList))
	// 				menuList.value = res.data.menuList
	// 				resolve()
	// 			}).catch(err => {
	// 				reject(err)
	// 			})
	// 	})
	// }

