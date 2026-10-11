export const HOMEPAGE_IMAGE_DEFAULTS = {
  founder: '/founder.jpg',
  story: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=80',
  philosophy: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
};

export type HomepageImageKey = keyof typeof HOMEPAGE_IMAGE_DEFAULTS;
export type HomepageImages = Record<HomepageImageKey, string>;

export const HOMEPAGE_IMAGE_FIELDS: { key: HomepageImageKey; label: string; help: string }[] = [
  {
    key: 'founder',
    label: 'Owner portrait',
    help: 'The photo beside Sacred Wisdom, Bottled.',
  },
  {
    key: 'story',
    label: 'Sacred Olfaction',
    help: 'The photo beside the house story.',
  },
  {
    key: 'philosophy',
    label: 'Brand philosophy',
    help: 'The photo beside Sacred Wisdom, Bottled in the story.',
  },
];
