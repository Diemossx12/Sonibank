import { create } from 'zustand';
import { Language, translations, TranslationKey } from './translations';

interface LangState {
  lang:    Language;
  t:       (key: TranslationKey) => string;
  setLang: (lang: Language) => void;
}

export const useLang = create<LangState>((set, get) => ({
  lang: 'fr',
  t: (key) => translations[get().lang][key] as string,
  setLang: (lang) => set({ lang }),
}));
