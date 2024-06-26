import { create } from "zustand";

type LanguageStore = {
  language: string;
  setLanguage: (language: string) => void;
};

const useLanguageStore = create<LanguageStore>((set) => ({
  language: "en",
  setLanguage: (language) => set({ language }),
}));


export default useLanguageStore;