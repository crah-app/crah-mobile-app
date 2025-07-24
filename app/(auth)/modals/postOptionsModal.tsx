import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import Modal from 'react-native-modal';
import PostTypeButton from '@/components/PostTypeButton';

interface Props {
	isVisible: boolean;
	setVisibility: (visible: boolean) => void;
	theme: 'light' | 'dark';
	handleShare: () => Promise<void>;
	handlePresentReportModalPress: () => void;
}

const PostOptionsModal: React.FC<Props> = ({
	isVisible,
	setVisibility,
	theme,
	handleShare,
	handlePresentReportModalPress,
}) => {
	const handleReportPost = async () => {
		setVisibility(false);
		handlePresentReportModalPress();
	};

	const handleTricksLandedInPost = () => {};

	return (
		<Modal
			isVisible={isVisible}
			backdropOpacity={0.55}
			onBackdropPress={() => setVisibility(false)}
			statusBarTranslucent={true}
			useNativeDriver={true}
			useNativeDriverForBackdrop={true}
			hideModalContentWhileAnimating={true}
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flex: 1,
			}}>
			<ThemedView
				theme={theme}
				style={[
					{
						backgroundColor: Colors[theme].background,
						padding: 20,
						borderRadius: 12,
						alignItems: 'center',
						justifyContent: 'center',
						gap: 12,
					},
				]}>
				<PostTypeButton
					val="Report"
					click_action={handleReportPost}
					hasIcon
					icon="warning-outline"
				/>
				<PostTypeButton
					val="Share"
					click_action={handleShare}
					hasIcon
					icon="share-outline"
				/>
				<PostTypeButton
					val="Tricks"
					click_action={handleTricksLandedInPost}
					hasIcon
					additionalIconIsSVG
					icon="briflip"
				/>
			</ThemedView>
		</Modal>
	);
};

const styles = StyleSheet.create({});

export default PostOptionsModal;
