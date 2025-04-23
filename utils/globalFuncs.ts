import { SearchCategories } from '@/types';

export const filterPosts = (
	posts: any[],
	type: SearchCategories | string,
): any[] => {
	if (type === SearchCategories.allPosts) {
		return posts;
	}
	return posts.filter((post) => post.type === type);
};

export function getTrickTitle(fetchedTrick?: {
	words?: (string | undefined | null)[];
}): string {
	const words = fetchedTrick?.words?.filter(Boolean);
	if (words && words.length > 0) {
		return words.join(' ');
	}
	return 'Error loading trick';
}
