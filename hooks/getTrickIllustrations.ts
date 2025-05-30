import briflip_default from '@/assets/illustrations/briflip.png';

const getTrickIllustration = (name: string) => {
	switch (name) {
		case 'Briflip':
			return briflip_default;
	}
};

export default getTrickIllustration;
