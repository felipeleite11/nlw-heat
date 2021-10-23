import React from 'react'
import {
  View
} from 'react-native'

import { Button } from '../../components/Button'

import { useAuth } from '../../hooks/Auth'

import { COLORS } from '../../theme'

import { styles } from './styles'

export function SignInBox(){
	const { signIn, isSigning } = useAuth()

	return (
		<View style={styles.container}>
			<Button
				title="Entrar com Gihub"
				color={COLORS.BLACK_PRIMARY}
				backgroundColor={COLORS.YELLOW}
				icon="github"
				onPress={signIn}
				isLoading={isSigning}
			/>
		</View>
	)
}