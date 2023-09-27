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

export const addMenu = (data)=>{
	return req.post(`/menu/addMenu`,data)
}

export const loadMenuById = (menuId)=>{
	return req.get(`/menu/queryMenuById/${menuId}`)
}

export const editMenu = (menuId,data)=>{
	return req.put(`/menu/updateMenu`,data)
}

export const deleteMenu = (menuId)=>{
	return req.delete(`/menu/deleteMenu/${menuId}`)
}
