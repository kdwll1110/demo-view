import { createApp } from 'vue'
import './style.css'
import Start from './Start.vue'

//*********************
//引入路由对象
import router from '@/router'

//引入axios和vue-axios

import {createPinia} from 'pinia'

//import piniaPluginPersist from 'pinia-plugin-persist'

import axios from '@/request'

import VueAxios from 'vue-axios'


import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import * as ElIcons from '@element-plus/icons-vue'


let app = createApp(Start);

//1、使用路由,
app.use(router)
//2、使用axios,在其他组件中可通过this.$axios
app.use(VueAxios,axios)
//3、使用element-plus
app.use(ElementPlus)
//4、将图标注册为全局组件
Object.keys(ElIcons).forEach(k=>{
	app.component(k,ElIcons[k])
})


//使用store对象.
app.use(createPinia())

app.config.warnHandler = () => null
//最后才挂载
app.mount('#app')


