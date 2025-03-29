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
