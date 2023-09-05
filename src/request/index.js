

import Axios from 'axios'



const req = Axios.create({
	baseURL:'http://127.0.0.1:9999',
	timeout:1000 * 10
})


req.interceptors.request.use((config)=>{
	const token = sessionStorage.getItem('token');
	if(token){
		config.headers.authorization = token
	}
	return config;
})


req.interceptors.response.use((response)=>{
	if(response.data.data.token){
		//保存到本地存储
		sessionStorage.setItem('token',response.data.data.token)
		
	}
	return response.data
	
},(err)=>{
	console.log("响应异常",err)
})







// //4、设置axios请求的拦截器（发起请求，拦截器就会工作）
// axios.interceptors.request.use(config => {
// 	const userStore = useUserStoreHook()
// 	const {token}= storeToRefs(userStore)

// 	let localToken = sessionStorage.getItem("token");
// 	//token存在则将其放进请求头，每次请求都携带token
// 	if (token.value!=null&&localToken!=null) {
// 		config.headers.authorization = token.value
// 	}
// 	return config;
// }, error => {
// 	return Promise.reject(error);
// })

// //5、设置axios响应的拦截器（对服务器返回的数据做处理）
// axios.interceptors.response.use(res => {
// 	const {msg} = res.data
// 	if (res.data.data) {
// 		return res.data
// 	}
// 	ElMessage.error(msg || "系统出错");
// 	return Promise.reject(new Error(msg || "Error"));
// }, error => {
// 	const { success, msg } = error.response.data;
// 	if(!success){
// 		ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
// 		  confirmButtonText: "确定",
// 		  type: "warning",
// 		}).then(() => {
// 		  sessionStorage.clear();
// 		  window.location.href = "/";
// 		});
// 	}else{
// 		ElMessage.error(msg || "系统出错");
// 	}
// 	return Promise.reject(new Error('系统出错!'));
// })

//6、导出axios
export default req;
