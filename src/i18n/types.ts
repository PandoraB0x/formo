export type Lang = 'et' | 'en' | 'ru';

export const LANGS: { code: Lang; label: string; short: string; flag: string }[] = [
  { code: 'et', label: 'Eesti', short: 'ET', flag: '🇪🇪' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
];

export const DEFAULT_LANG: Lang = 'et';
