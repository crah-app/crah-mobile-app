export enum AuthStrategy {
  Google = 'oauth_google',
}

export const PostTypes = {
  all: 'Show all posts',
  videoLandscape: 'Landscape Videos',
  videoPortrait: 'Portrait Videos',
  text: 'Text',
  article: 'Articles',
  image: 'Images',
} as const;

export type PostType = keyof typeof PostTypes;
