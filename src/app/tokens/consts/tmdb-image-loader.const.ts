import { ImageLoaderConfig } from '@angular/common';

export const TMDB_IMAGE_LOADER = (config: ImageLoaderConfig) => {
  const type = (config.loaderParams as { type?: string })?.type;
  if (!type) return config.src;

  const baseUrl = 'https://image.tmdb.org/t/p/';
  const widths: { [key: string]: number[] } = {
    backdrop: [300, 780, 1280],
    logo: [45, 92, 154, 185, 300, 500],
    poster: [92, 154, 185, 342, 500, 780],
    profile: [45, 185],
    still: [92, 185, 300],
  };

  const closestWidth = widths[type]?.find(
    (width) => config.width && width >= config.width
  );
  const size = closestWidth ? `w${closestWidth}` : 'original';

  return `${baseUrl}${size}${config.src}`;
};
