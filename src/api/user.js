
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