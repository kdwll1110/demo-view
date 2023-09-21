import req from '@/request/index.js'


export const loadAllMenu = () =>{
	return req.get('/menu/queryAllMenu')
}

export const loadMenuByRoleId = (roleId)=>{
	return req.get(`/menu/queryMenuByRoleId/${roleId}`)
}

export const editMenuByRoleId = (roleId,menuIds)=>{
	return req.put(`/menu/updateMenuByRoleId/${roleId}`,menuIds)
}