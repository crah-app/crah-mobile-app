import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import Column from '@/components/general/Row';

import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '../general/ThemedText';

interface FriendRequestColumnProps {
	id: string | number;
	name: string;
	avatar: string;
	onAccept: (id: string | number) => void;
	onDecline: (id: string | number) => void;
}

const FriendRequestColumn: React.FC<FriendRequestColumnProps> = ({
	id,
	name,
	avatar,
	onAccept,
	onDecline,
}) => {
	const theme = useSystemTheme();

	return (
		<Column
			title={`${name}`}
			subtitle="sent you a friend request"
			customLeftComponent={
				<Image source={{ uri: avatar }} style={styles.avatar} />
			}
			customRightComponent={
				<View style={styles.buttonsContainer}>
					<TouchableOpacity onPress={() => onAccept(id)}>
						<ThemedText
							value={'Accept'}
							theme={theme}
							style={{ color: Colors['default'].green }}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => onDecline(id)}>
						<ThemedText
							value={'Decline'}
							theme={theme}
							style={{ color: Colors[theme].primary }}
						/>
					</TouchableOpacity>
				</View>
			}
			containerStyle={{
				backgroundColor: Colors[theme].background,
				paddingVertical: 10,
			}}
			titleStyle={{
				fontSize: 15,
				color: Colors[theme].textPrimary,
			}}
		/>
	);
};

const styles = StyleSheet.create({
	avatar: {
		width: 42,
		height: 42,
		borderRadius: 50,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 8,
	},
});

export default FriendRequestColumn;
