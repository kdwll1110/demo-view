
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