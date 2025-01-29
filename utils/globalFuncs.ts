export const filterPosts = (posts: any[], type: string): any[] => {
  if (type === 'all') {
    return posts;
  }
  return posts.filter((post) => post.type === type);
};
