import {
	Trick,
	TrickDifficulty,
	TrickListFilterOptions,
	TrickListGeneralFilterParameter,
	TrickListOrderTypes,
	TrickTypeUI,
} from '@/types';

const difficultyOrder: TrickDifficulty[] = [
	TrickDifficulty.BEGINNER,
	TrickDifficulty.NORMAL,
	TrickDifficulty.INTERMEDIATE,
	TrickDifficulty.ADVANCED,
	TrickDifficulty.HARD,
	TrickDifficulty.VERY_HARD,
	TrickDifficulty.EXPERT,
	TrickDifficulty.IMPOSSIBLE,
	TrickDifficulty.GOATED,
	TrickDifficulty.LEGENDARY,
];

export default function filterTrickList(
	trickList: Trick[] | undefined,
	filter: TrickListFilterOptions,
): Trick[] | undefined {
	return (trickList ?? []).filter(
		(trick) => filter === 'ALL' || trick.TrickType === TrickTypeUI[filter],
	);
}

export function orderTrickList(
	trickList: Trick[] | undefined,
	order: TrickListOrderTypes,
): Trick[] | undefined {
	if (!trickList) return trickList;

	if (order === TrickListOrderTypes.DEFAULT) {
		return [...trickList];
	}

	if (order === TrickListOrderTypes.DIFFICULTY) {
		return [...trickList].sort((a, b) => {
			return b.DefaultPoints - a.DefaultPoints;
		});
	}

	if (order === TrickListOrderTypes.LANDED) {
		return trickList
			.filter((t) => t.UserId !== null && t.UserTrickId !== null)
			.sort((a, b) => {
				const aIndex = difficultyOrder.indexOf(a.Difficulty as TrickDifficulty);
				const bIndex = difficultyOrder.indexOf(b.Difficulty as TrickDifficulty);
				return aIndex - bIndex;
			});
	}

	if (order === TrickListOrderTypes.NOTLANDED) {
		return trickList
			.filter((t) => t.UserId === null || t.UserTrickId === null)
			.sort((a, b) => {
				const aIndex = difficultyOrder.indexOf(a.Difficulty as TrickDifficulty);
				const bIndex = difficultyOrder.indexOf(b.Difficulty as TrickDifficulty);
				return aIndex - bIndex;
			});
	}

	return [...trickList];
}

export function filterTrickListByParameters(
	trickList: Trick[] | undefined,
	parameter: TrickListGeneralFilterParameter,
): Trick[] | undefined {
	if (!trickList || parameter === 'All') return trickList;

	return trickList.filter(
		(trick, idx) =>
			trick.GeneralType === parameter ||
			(trick.Costum && parameter === 'Costum'),
	);
}
