import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SupportedLanguage, SUPPORTED_LANGUAGES } from "@/types";
import { ArrowLeft, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const DashboardHeader = ({ selectedLanguage, onLanguageChange }: DashboardHeaderProps) => {
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">CN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm">CrewNexusAI</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right side - Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="w-4 h-4" />
              <span>{currentLang?.nativeName}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={selectedLanguage === lang.code ? 'bg-muted' : ''}
              >
                <span className="mr-2">{lang.nativeName}</span>
                <span className="text-muted-foreground text-xs">({lang.name})</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
