
import req from '@/request/index.js'

export const test = ()=>{
	return req.get('/user/hello')
}

export const login = (data)=>{
	return req.post('/user/login',data)
}

export const loadMenu = ()=>{
	return req.get('/user/queryMenuByToken')
}

export const loadUserListByPage = (current,size,query={}) => { 
	return req.get(`/user/queryAllUserByPage/${current}/${size}`,{
		params:query
	})
}

export const loadUserById = (userId)=>{
	return req.get(`/user/queryUserById/${userId}`)
}

export const addUser = (data) =>{
	return req.post(`/user/addUser`,data)
}

export const editUser = (userId,data) =>{
	return req.put(`/user/updateUser`,data)
}

export const deleteUser = (userIds) =>{
	return req.post(`/user/deleteUser`,userIds)
}