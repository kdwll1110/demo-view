//1、导入路由初始所需对象
import {
	createRouter,
	createWebHashHistory
} from 'vue-router'

import {
	useUserStore
} from '@/store/user.js'
import {
	loadMenu
} from '@/api/user.js'

//import Index from '@/components/Index.vue'//这是注释2

//2、配置路由数组
let routes = [{
		path: '/',
		redirect: '/index',
		meta: {
			isShow: false
		}
	},
	{
		path: '/index',
		name: 'Index',
		component: () => import('@/layout/Index.vue'),
		meta: {
			isShow: true,
			title: '首页',
		},
		children: [],
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/components/Login.vue'),
		meta: {
			isShow: false
		}
	},
	{
		path: '/:catchAll(.*)',
		//name: '404',//原来去掉name就好了，离谱
		component: () => import('@/components/404.vue'),
		meta: {
			isShow: false,
		}
	}

]

//3、创建路由对象
let router = createRouter({
	history: createWebHashHistory(),
	routes
})


function checkLogin() {
	return sessionStorage.getItem('token')
}

async function loadAsyncMenu(to, next) {
	const userStore = useUserStore()

	//根据用户的角色 查询对应的路由
	const res = await loadMenu()
	if(!res.data){
		return next('/login')
	}
	const asyncRoutes = await asyncRouteHandler(res.data.menuList)
	
	userStore.setUserMenu({
		userMenu: res.data.menuList
	})

	asyncRoutes.forEach(r => {
		/**
		 * 这是第一种方式，需要引入上面指定的出口组件，
		 * 比如Index.vue（也就是上面的注释2），
		 * 并且对应的下面注释1的判断代码
		 */
		//router.addRoute(r) ：

		/**
		 * 这是第二种方式，也就是在addRoute时，
		 * 直接指定添加到具体的某个路由下，比如Index路由，
		 * 因为Index有出口，搭配下面的注释3使用即可
		 */
		router.addRoute("Index", r)

	})


	next({
		...to,
		replace: true
	})
}

let modules =
	import.meta.glob('../views/**/*.vue')


function asyncRouteHandler(routes) {

return routes.filter(route => {
	
		const compPath = route.component
		route.component = modules[`../views/${compPath}.vue`]

		route.meta = {
			icon: route.icon,
			type: route.type,
			parentId: route.parentId,
			title: route.name,
			isShow: true
		}

		if (route.children && route.children.length > 0) {
			route.children = asyncRouteHandler(route.children)
		}
		return route.type!==3
	})

}


//4、配置前置路由守卫
router.beforeEach((to, from, next) => {

	const userStore = useUserStore()
	if (to.path === '/login') {
		sessionStorage.clear()
		userStore.$reset()
		return next()
	}

	if (!checkLogin()) {
		return next({
			name: 'Login',
			query: {
				redirect: to.path
			}
		})
	}

	//登录了 就判断菜单
	if (userStore.userMenu && userStore.userMenu.length > 0) {
		return next()
	}

	//没有，加载菜单
	loadAsyncMenu(to, next)


})


//5、导出
export default router
