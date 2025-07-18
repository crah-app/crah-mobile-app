import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '../general/ThemedView';
import Reactions from '@/constants/Reactions';
import { ReactionType } from '@/types';
import Modal from 'react-native-modal';

interface UserPostReactionsModalProps {
	showReactions: boolean;
	setShowReactions: (boolean: boolean) => void;
	handleReaction: (reaction: ReactionType) => void;
}

const UserPostReactionsModal: React.FC<UserPostReactionsModalProps> = ({
	showReactions,
	setShowReactions,
	handleReaction,
}) => {
	const theme = useSystemTheme();

	return (
		<Modal
			isVisible={showReactions}
			useNativeDriver={true}
			useNativeDriverForBackdrop={true}
			animationIn={'fadeIn'}
			animationOut={'fadeOut'}
			onBackdropPress={() => setShowReactions(false)}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ThemedView
					style={[
						styles.reactionsGrid,
						{
							width: Dimensions.get('window').width / 1.25,
						},
					]}
					theme={theme}>
					{Reactions.map((reaction) => (
						<TouchableOpacity
							key={reaction}
							onPress={() => handleReaction(reaction)}>
							<Text style={{ fontSize: 24 }}>{reaction}</Text>
						</TouchableOpacity>
					))}
				</ThemedView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	iconButton: {
		marginRight: 15,
		alignItems: 'center',
		flexDirection: 'row',
		gap: 5,
	},
	iconCount: {
		fontSize: 13,
		fontWeight: '600',
	},
	reactionCountContainer: {
		fontWeight: 'bold',
		borderRadius: '100%',
		fontSize: 12,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	reactionsGrid: {
		padding: 20,
		borderRadius: 8,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		zIndex: 1,
		gap: 20,
	},
});

export default UserPostReactionsModal;
