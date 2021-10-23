import React from 'react'
import {
  View, Text, TouchableOpacity
} from 'react-native'

import { Avatar } from '../Avatar'

import Logo from '../../assets/logo.svg'

import { styles } from './styles'

import { useAuth } from '../../hooks/Auth'

export function Header() {
	const { user, signOut } = useAuth()

  return (
	<View style={styles.container}>
		<Logo />

		<View style={styles.logoutButton}>
			{user && (
				<TouchableOpacity onPress={signOut}>
					<Text style={styles.logoutText}>Sair</Text>
				</TouchableOpacity>
			)}

			<Avatar imageUri={user?.avatar_url} />
		</View>
	</View>
  )
}