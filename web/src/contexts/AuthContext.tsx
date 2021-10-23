import { createContext, ReactNode, useEffect, useState } from 'react'

import { api } from '../services/api'

type User = {
	id: string
	name: string
	login: string
	avatar_url: string
}

type AuthContextData = {
	 user: User | null
	 signInUrl: string
	 signOut: () => void
}

type AuthProvider = {
	children: ReactNode
}

type AuthResponse = {
	token: string
	user: {
		id: string
		avatar_url: string
		name: string
		login: string
	}
}

export const AuthContext = createContext({} as AuthContextData)

const CLIENT_ID = 'ac3b4151897d7507d617'

export function AuthProvider({ children }: AuthProvider) {
	const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${CLIENT_ID}`

	const [user, setUser] = useState<User | null>(null)

	async function signin(githubCode: string) {
		const { data } = await api.post<AuthResponse>('authenticate', {
			code: githubCode
		})

		const { token, user } = data

		localStorage.setItem('nlw_heat_token', token)

		api.defaults.headers.common.authorization = `Bearer ${token}`

		setUser(user)
	}

	function signOut() {
		setUser(null)

		localStorage.removeItem('nlw_heat_token')
	}

	async function loadAuthenticatedUserData(token: string) {
		api.defaults.headers.common.authorization = `Bearer ${token}`

		const { data } = await api.get<User>('profile')

		setUser(data)
	}

	useEffect(() => {
		const token = localStorage.getItem('nlw_heat_token')

		if(token) {
			loadAuthenticatedUserData(token)
		}
	}, [])

	useEffect(() => {
		const url = window.location.href
		const hasGithubCode = url.includes('?code=')

		if(hasGithubCode) {
			const [urlWithoutCode, githubCode] = url.split('?code=')

			window.history.pushState({}, '', urlWithoutCode)

			signin(githubCode)
		}
	}, [])
	
	return (
		<AuthContext.Provider value={{
			signInUrl,
			user,
			signOut
		}}>
			{children}
		</AuthContext.Provider>
	)
}