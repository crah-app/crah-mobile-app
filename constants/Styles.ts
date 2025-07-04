import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
	btn: {
		height: 50,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	primaryBtn: {
		backgroundColor: Colors.default.primary,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontWeight: 'bold',
		padding: 8,
		borderRadius: 5,
	},

	outlinedBtn: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.default.primary,
		color: Colors.default.primary,
		backgroundColor: 'transparent',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontWeight: 'bold',
		padding: 4,
		borderRadius: 5,
	},

	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	pageContainer: {
		flex: 1,
		backgroundColor: Colors.light.primary,
	},
	textInput: {
		padding: 8,
		borderRadius: 8,
		fontSize: 18,
	},
	biggerText: {
		fontSize: 22,
		fontWeight: '700',
	},
	bigText: {
		fontSize: 27,
	},
	biggerOpacityText: {
		fontSize: 22,
		fontWeight: '700',
		opacity: 0.7,
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: 'gray',
	},

	surface_container: {
		borderRadius: 8,
		flexDirection: 'column',
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
});

export const defaultHeaderBtnSize = 32;
