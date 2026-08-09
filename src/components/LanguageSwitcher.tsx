"use client"

import { usePathname, useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu"
import { buttonVariants } from "./ui/button"
import { Languages } from "lucide-react"

const locales = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'Amharic (አማርኛ)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'de', name: 'German (Deutsch - GTB)' },
  { code: 'fr', name: 'French (Français - CFTL)' },
  { code: 'es', name: 'Spanish (Español - SSTB)' },
  { code: 'it', name: 'Italian (Italiano - ITA-STQB)' },
  { code: 'ja', name: 'Japanese (日本語 - JSTQB)' },
  { code: 'ko', name: 'Korean (한국어 - KSTQB)' },
  { code: 'zh', name: 'Chinese (中文 - CSTQB)' },
  { code: 'pt', name: 'Portuguese (Português - BSTQB)' },
  { code: 'pl', name: 'Polish (Polski - PSTQB)' },
  { code: 'ru', name: 'Russian (Русский - RSTQB)' },
  { code: 'tr', name: 'Turkish (Türkçe - TTB)' },
  { code: 'hi', name: 'Hindi (हिन्दी - ITB)' }
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  const currentLocale = locales.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: 'outline', size: 'sm', className: 'gap-2 px-3' })}>
        <Languages className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-bold uppercase">{currentLocale?.code || 'EN'}</span>
        <span className="sr-only">Toggle language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem 
            key={l.code} 
            onClick={() => handleLanguageChange(l.code)}
            className={locale === l.code ? "bg-accent" : ""}
          >
            {l.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
