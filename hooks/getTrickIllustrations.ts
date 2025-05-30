import briflip_default from '@/assets/illustrations/briflip.png';
import { Image, ImageSourcePropType } from 'react-native';

const getTrickIllustration = (name: string) => {
	console.log(name);
	switch (name) {
		case 'Bri flip':
			return Image.resolveAssetSource(briflip_default as ImageSourcePropType)
				.uri;
	}
};

export default getTrickIllustration;
