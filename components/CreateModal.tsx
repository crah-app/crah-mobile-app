import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Link } from 'expo-router';
import React from 'react';
import {
	Dimensions,
	Modal,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
} from 'react-native';
import ThemedText from './general/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface CreateModalProps {
	theme: 'dark' | 'light';
	visible: boolean;
	setModalVisible: (visible: boolean) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
	theme,
	visible,
	setModalVisible,
}) => {
	return (
		<Modal
			transparent={true}
			animationType="none"
			visible={visible}
			onRequestClose={() => setModalVisible(false)}>
			<View style={styles.modalOverlay}>
				<TouchableOpacity
					onPress={() => setModalVisible(false)}
					style={{
						position: 'absolute',
						width: Dimensions.get('window').width,
						height: Dimensions.get('window').height,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<View
						style={[
							styles.modalContent,
							{
								backgroundColor: Colors[theme].container_surface,
								position: 'absolute',
								bottom: Platform.OS === 'ios' ? 70 + 20 : 70 + 30,
								borderWidth: StyleSheet.hairlineWidth,
								borderColor: 'rgba(0,0,0,1)',
							},
						]}>
						<View
							style={[
								{
									width: '100%',
									paddingBottom: 4,
									borderBottomColor: Colors[theme].textPrimary,
									borderBottomWidth: StyleSheet.hairlineWidth,
									alignItems: 'center',
									justifyContent: 'center',
								},
							]}>
							<View
								style={[
									{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'center',
										width: '90%',
										marginTop: 4,
									},
								]}>
								<Text
									style={[
										styles.modalText,
										{ color: Colors[theme].textPrimary, fontWeight: 700 },
									]}>
									create
								</Text>
							</View>
						</View>

						<View
							style={{
								width: '100%',
							}}>
							<Link
								onPress={() => setModalVisible(false)}
								href={{ pathname: '/(auth)/createPages/createVideo' }}
								style={[
									styles.modalCategory,
									{
										borderBottomColor: 'rgba(255,255,255,0.3)',
										textAlign: 'center',
									},
								]}>
								<ThemedText theme={theme} value={'Video'} />
							</Link>

							<Link
								onPress={() => setModalVisible(false)}
								href={{ pathname: '/(auth)/createPages/createTextPost' }}
								style={[
									styles.modalCategory,
									{
										borderBottomColor: 'rgba(255,255,255,0.3)',
										textAlign: 'center',
									},
								]}>
								<ThemedText theme={theme} value={'Text'} />
							</Link>

							<Link
								onPress={() => setModalVisible(false)}
								href={{ pathname: '/(auth)/createPages/createTextPost' }}
								style={[
									styles.modalCategory,
									{
										borderBottomColor: 'rgba(255,255,255,0.3)',
										textAlign: 'center',
									},
								]}>
								<ThemedText theme={theme} value={'Image'} />
							</Link>

							<Link
								onPress={() => setModalVisible(false)}
								href={{ pathname: '/(auth)/createPages/createArticle' }}
								style={[
									styles.modalCategory,
									{
										borderBottomColor: 'transparent',
										textAlign: 'center',
									},
								]}>
								<ThemedText theme={theme} value={'Article'} />
							</Link>
						</View>

						<Ionicons
							name="caret-down-outline"
							color={Colors[theme].surface}
							size={54}
							style={[{ bottom: -35, position: 'absolute' }]}
						/>
					</View>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		borderRadius: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
		width: 200,
	},
	modalText: {
		fontSize: 18,
	},
	modalCategory: {
		paddingVertical: 10,
		borderBottomWidth: StyleSheet.hairlineWidth,
		width: '100%',
	},
});

export default CreateModal;
