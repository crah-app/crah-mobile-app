import React, { ReactNode } from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import ThemedView from './general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import CrahActivityIndicator from './general/CrahActivityIndicator';
import NoDataPlaceholder from './general/NoDataPlaceholder';

interface RenderFetchedDataProps {
	renderComponent: ReactNode;
	errState: boolean | undefined;
	loadedState: boolean | undefined;
	activityIndicatorSize: number;
	activityIndicatorColor: string;
	clientErrorTitle: string;
	clientErrorSubTitle: string;
	ActivityIndicatorStyle: ViewStyle | ViewStyle[];
}

const RenderFetchedData: React.FC<RenderFetchedDataProps> = ({
	renderComponent,
	errState,
	loadedState,
	activityIndicatorSize,
	activityIndicatorColor,
	clientErrorTitle,
	clientErrorSubTitle,
	ActivityIndicatorStyle,
}) => {
	const theme = useSystemTheme();

	return (
		<ThemedView theme={theme} flex={1}>
			{loadedState ? (
				// error occured
				errState ? (
					<NoDataPlaceholder
						containerStyle={[styles.PlaceholderContentContainer]}
						firstTextValue={clientErrorTitle}
						subTextValue={clientErrorSubTitle}
						arrowStyle={{ display: 'none' }}
					/>
				) : (
					// fetching finished without error. render content
					renderComponent
				)
			) : (
				// fetching process not finished but also no error
				<CrahActivityIndicator
					style={ActivityIndicatorStyle}
					size={activityIndicatorSize}
					color={activityIndicatorColor}
				/>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	PlaceholderContentContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 0.5,
	},
});

export default RenderFetchedData;
