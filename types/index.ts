export enum AuthStrategy {
  Google = 'oauth_google',
}

// All post types including "all" option for user interaction
export const PostTypes = {
  all: 'Show all posts',
  videoLandscape: 'Landscape Videos',
  videoPortrait: 'Portrait Videos',
  text: 'Text',
  article: 'Articles',
  image: 'Images',
} as const;

// All post types but generalised
export const GeneralPostTypes = {
  all: 'All posts',
  videos_and_images: 'Clips',
  articles: 'Articles',
  text: 'Text',
} as const;

// ALl types of stuff the user can search for includign non-post stuff like the "rider" type and the "tricks" type
export const SearchTypes = {
  all: 'All posts',
  videos_and_images: 'Clips',
  articles: 'Articles',
  text: 'Text',
  riders: 'Riders',
  tricks: 'Tricks',
} as const;

// All icons for all post/search types
export const PostTypeIonicons = {
  all: 'albums-outline',
  videoLandscape: 'phone-landscape-outline',
  videoPortrait: 'phone-portrait-outline',
  text: 'chatbox-ellipses-outline',
  article: 'book-outline',
  image: 'images-outline',
} as const;

// explore post order types
export const ExplorePostOrder = {
  toOldest: 'Latest to oldest',
  toLatest: 'Oldest to latest',
};

export const ContentFilterTypes = ['explore', 'friends', 'rank'];

export type PostType = keyof typeof PostTypes;
