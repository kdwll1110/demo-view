import req from '@/request/index.js'

export const loadAllRole = () =>{
	return req.get('/role/queryAllRole')
}

export const loadRoleListByPage = (current,size,query={}) =>{
	return req.get(`/role/queryAllRoleByPage/${current}/${size}`,{
		params:query
	})
}

export const loadRoleById = (roleId) =>{
	return req.get(`/role/queryRoleById/${roleId}`)
}

export const addRole = (data) =>{
	return req.post(`/role/addRole`,data)
}

export const editRole = (roleId,data) =>{
	return req.put(`/role/updateRole`,data)
}

export const deleteRole = (roleIds) =>{
	return req.post(`/role/deleteRole`,roleIds)
}