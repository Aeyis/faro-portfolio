"use client";

import React, { createContext, useContext, useState } from "react";

type Lang = "fr" | "en";
const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
    lang: "fr",
    setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>("fr");
    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
