import React from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';

import IronBadge from '../../assets/images/vectors/bar.svg';
import BronzeBadge from '../../assets/images/vectors/bar.svg';
import SilverBadge from '../../assets/images/vectors/bar.svg';
import GoldBadge from '../../assets/images/vectors/bar.svg';
import PlatinumBadge from '../../assets/images/vectors/bar.svg';
import DiamondBadge from '../../assets/images/vectors/bar.svg';
import { Rank } from '@/types';
import Row from '@/components/general/Row';

interface RankRowProps {
	currentRank: Rank;
	previousRank?: Rank;
	onPress?: () => void;
}

const rankIcons: Record<string, string> = {
	Iron: IronBadge,
	Bronze: BronzeBadge,
	Silver: SilverBadge,
	Gold: GoldBadge,
	Platinum: PlatinumBadge,
	Diamond: DiamondBadge,
};

const RankRow: React.FC<RankRowProps> = ({
	currentRank,
	previousRank,
	onPress,
}) => {
	const theme = useSystemTheme();
	const RankIcon = rankIcons[currentRank];

	const rankChange = previousRank
		? currentRank === previousRank
			? 'No change in rank'
			: currentRank > previousRank
			? 'You ranked up! 🎉'
			: 'You ranked down 😢'
		: 'Welcome to your first rank!';

	return (
		<Row
			title={`Your new rank: ${currentRank}`}
			subtitle={rankChange}
			onPress={onPress}
			showAvatar={true}
			avatarUrl={rankIcons[currentRank]}
			avatarIsSVG={true}
			containerStyle={{
				backgroundColor: Colors[theme].background,
				paddingVertical: 12,
			}}
			titleStyle={{ fontWeight: '600', fontSize: 16 }}
		/>
	);
};

export default RankRow;
