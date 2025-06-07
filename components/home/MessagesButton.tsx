import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ScooterBar from '../../assets/images/vectors/bar.svg';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '../general/ThemedText';
import GetSVG from '../GetSVG';

const MessagesButton = () => {
	const theme = useSystemTheme();
	const notifications = 0;

	return (
		<View>
			<Link
				asChild
				href={{
					params: {},
					pathname: '/(auth)/(tabs)/homePages/chats',
				}}>
				<TouchableOpacity>
					<GetSVG
						props={{ fill: Colors[theme].textPrimary, width: 24, height: 24 }}
						name={'bar'}
					/>

					<View
						style={[
							styles.notification_container,
							{ display: !notifications ? 'none' : 'flex' },
						]}>
						<ThemedText
							theme={theme}
							value={notifications > 99 ? '99+' : notifications.toString()}
							style={[
								styles.notification_text,
								{ fontSize: notifications <= 9 ? 12 : 8, color: 'white' },
							]}
						/>
					</View>
				</TouchableOpacity>
			</Link>
		</View>
	);
};

const styles = StyleSheet.create({
	notification_container: {
		padding: 0,
		backgroundColor: Colors['default'].primary,
		position: 'absolute',
		borderRadius: 100,
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
		top: 12,
		left: 7,
	},
	notification_text: {
		fontWeight: 600,
		fontSize: 12,
	},
});

export default MessagesButton;
