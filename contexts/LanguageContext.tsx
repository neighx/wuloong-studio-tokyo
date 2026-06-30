"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Lang = "ja" | "en"

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ja",
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja")

  useEffect(() => {
    const saved = localStorage.getItem("wuloong-lang") as Lang | null
    if (saved === "en") setLangState("en")
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("wuloong-lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
