import api from '../services/api'

interface IUser {
    
	id?: number
	username: string
	password?: string
    
    email: string

	isActive?: boolean
	createdAt?: Date
	updatedAt?: Date
}

class User {

	static readonly route = 'users'
	
	static async find(search?: any) {

		let query = '?'
		if (search)
			query += new URLSearchParams(search).toString()

		const { data } = await api.get<IUser[]>(`/${User.route}${query}`)
		return data
	}
	
	static async create(user: IUser) {

		const { data } = await api.post<IUser>(`/signup`, user)
		return data
	}

	static async verify(username: string) {

		const { data } = await api.get<{ count: number }>(`/verify?username=${username}`)
		return data
	}

	static async delete(id: number) {

		await api.delete(`${User.route}/${id}`)
		return
	}
	// static async login(username: string, password: string) {

	// 	const credentials: Partial<IUser> = {
	// 		username, password
	// 	}

	// 	const result = await api.post<IUser>('/login', credentials)

	// 	return result
	// }
    
}

export default User
export type { IUser }