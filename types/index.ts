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

export const PostTypeIonicons = {
  all: 'albums-outline',
  videoLandscape: 'phone-landscape-outline',
  videoPortrait: 'phone-portrait-outline',
  text: 'chatbox-ellipses-outline',
  article: 'book-outline',
  image: 'images-outline',
} as const;
