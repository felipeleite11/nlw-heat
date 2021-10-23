import axios from 'axios'
import { sign } from 'jsonwebtoken'

import prismaClient from '../prisma'

interface IAccessTokenResponse {
	access_token: string
}

interface IUserResponse {
	avatar_url: string
	name: string
	login: string
	id: number
}

class AuthenticateUserService {
	async execute(code: string) {
		const url = 'https://github.com/login/oauth/access_token'

		const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
			params: {
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code
			},
			headers: {
				Accept: 'application/json'
			}
		})

		const { data: userData } = await axios.get<IUserResponse>('http://api.github.com/user', {
			headers: {
				authorization: `Bearer ${accessTokenResponse.access_token}`
			}
		})

		const { id, avatar_url, login, name } = userData

		let user = await prismaClient.user.findFirst({
			where: {
				github_id: id
			}
		})

		if(!user) {
			user = await prismaClient.user.create({
				data: {
					github_id: id,
					login,
					avatar_url,
					name
				}
			})
		}

		const token = sign({
			user: {
				name: user.name,
				avatar_url: user.avatar_url,
				id: user.id
			}
		}, process.env.JWT_SECRET, {
			expiresIn: '7d',
			subject: user.id
		})

		return {
			token,
			user
		}
	}
}

export { AuthenticateUserService }