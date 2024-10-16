type SiteConfig = {
  name: string;
  description: string;
  url: string;
};

interface Config {
  site: SiteConfig;
}

export const config: Config = {
  site: {
    name: 'Vulse',
    description: 'Quickly share your favorites',
    url: 'https://vulse.vercel.app',
  },
};
