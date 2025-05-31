import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import UserImageCircle from '../general/UserImageCircle';
import Colors from '@/constants/Colors';
import Row from '../general/Row';
import { CrahUser } from '@/types';

interface UserRankRowprops {
	user: CrahUser;
	isSticky?: boolean | null; // sticky to the screen
}

const UserRankRow: React.FC<UserRankRowprops> = ({ user, isSticky = null }) => {
	const theme = useSystemTheme();

	return (
		<Row
			key={user?.id}
			containerStyle={{
				backgroundColor: isSticky
					? 'rgb(105,15,15)'
					: Colors[theme].container_surface,
				width: Dimensions.get('window').width - 16,
				borderRadius: 22,
				position: isSticky ? 'fixed' : 'relative',
				borderWidth: 5,
				borderColor: isSticky ? Colors[theme].background : 'transparent',
				padding: 8,
			}}
			title={user?.username ?? 'no name'}
			titleStyle={{ fontSize: 20, fontWeight: '400', marginLeft: 6 }}
			avatarUrl={user?.imageUrl}
			showAvatar={false}
			subtitle="Quint Whip Flat"
			subtitleStyle={{
				marginLeft: 6,
				fontSize: 15,
			}}
			customLeftComponent={
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						gap: 12,
						marginLeft: 8,
					}}>
					<ThemedText theme={theme} value={'#1'} style={{ fontSize: 22 }} />

					<Image
						source={{
							uri: user?.imageUrl,
						}}
						style={[styles.avatar]}
						width={46}
						height={46}
					/>
				</View>
			}
			customRightComponent={
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						gap: 12,
						marginRight: 8,
					}}>
					<ThemedText theme={theme} value={'1240'} style={{ fontSize: 20 }} />
				</View>
			}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 80,
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		borderTopWidth: 1,
		borderColor: 'white',
	},
	containerInnerLeft: {
		width: '50%',
		height: '100%',
		flexDirection: 'row',
		gap: 10,
	},
	containerInnerRight: {
		width: '50%',
		height: '100%',
		justifyContent: 'flex-end',
		alignContent: 'flex-end',
		padding: 10,
	},
	containerInnerUserInfo: {
		flexDirection: 'column',
		alignContent: 'center',
		justifyContent: 'center',
	},
	avatar: {
		borderRadius: 23,
	},
});

export default UserRankRow;
