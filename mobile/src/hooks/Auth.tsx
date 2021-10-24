import React, { createContext, useContext, useEffect, useState } from 'react'
import * as AuthSession from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { api } from '../services/api'

type User = {
	id: string
	avatar_url: string
	name: string
	login: string
}

type AuthContextData = {
	user: User | null
	isSigning: boolean
	signIn: () => Promise<void>
	signOut: () => Promise<void>
}

type AuthProviderProps = {
	children: React.ReactNode
}

type AuthResponse = {
	token: string
	user: User
}

type AuthorizationResponse = {
	params: {
		code?: string
		error?: string
	}
	type?: string
}

export const AuthContext = createContext({} as AuthContextData)

const CLIENT_ID = '0041cd9599cb971c5887'
const USER_STORAGE = '@nlwheat:user'
const TOKEN_STORAGE = '@nlwheat:token'

function AuthProvider({ children }: AuthProviderProps) {
	const [isSigning, setIsSigning] = useState(true)
	const [user, setUser] = useState<User | null>(null)

	async function signIn() {
		try {
			setIsSigning(true)

			const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user`

			const authSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse

			if(authSessionResponse.type === 'success' &&  authSessionResponse.params.error !== 'access_denied') {
				const authResponse = await api.post<AuthResponse>('authenticate', { 
					code: authSessionResponse.params.code,
					platform: 'mobile'
				})

				const { token, user } = authResponse.data

				api.defaults.headers.common.authorization = `Bearer ${token}`

				await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
				await AsyncStorage.setItem(TOKEN_STORAGE, token)

				setUser(user)
			}
		} catch(e) {
			console.log(e)
		} finally {
			setIsSigning(false)
		}
	}

	async function signOut() {
		setUser(null)

		await AsyncStorage.removeItem(USER_STORAGE)
		await AsyncStorage.removeItem(TOKEN_STORAGE)
	}

	useEffect(() => {
		async function loadUserStorageData() {
			const userStorage = await AsyncStorage.getItem(USER_STORAGE)
			const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE)

			if(userStorage && tokenStorage) {
				api.defaults.headers.common.authorization = `Bearer ${tokenStorage}`

				setUser(JSON.parse(userStorage))
			}

			setIsSigning(false)
		}

		loadUserStorageData()
	}, [])

	return (
		<AuthContext.Provider 
			value={{
				signIn,
				signOut,
				user,
				isSigning
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

function useAuth() {
	const context = useContext(AuthContext)

	return context
}

export {
	AuthProvider,
	useAuth
}