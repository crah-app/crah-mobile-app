import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { calculateDimensions } from '@/utils/globalFuncs';
import { upload_source_ratio } from '@/types';

export function useDynamicDimensions(width: number, height: number) {
	const [dynamicDimensions, setDynamicDimensions] = useState(() =>
		calculateDimensions(width, height),
	);

	useEffect(() => {
		const updateDimensions = () => {
			setDynamicDimensions(calculateDimensions(width, height));
		};

		// Optional: Handle orientation changes
		const subscription = Dimensions.addEventListener(
			'change',
			updateDimensions,
		);

		return () => subscription?.remove?.();
	}, [width, height]);

	return dynamicDimensions;
}
