import req from '@/request/index.js'

export const loadAllRole = () =>{
	return req.get('/role/queryAllRole')
}

export const loadRoleListByPage = (current,size,query={}) =>{
	return req.get(`/role/queryAllRoleByPage/${current}/${size}`,{
		params:query
	})
}