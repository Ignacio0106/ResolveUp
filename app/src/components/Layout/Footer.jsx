import React from "react";
import { LaptopMinimalCheck, Code2, Heart, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 w-full bg-chart-4  backdrop-blur-2xl border-t-2 border-border shadow-2xl z-40">
      <div className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold leading-tight text-foreground/90">
                  ResolveUp
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("footer.description")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs">
              &copy; {currentYear} {t("footer.rights")}
            </span>
          </div>
        </div>

        {/* Para telefono */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <LaptopMinimalCheck className="h-4 w-4 text-primary-foreground" />
              </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ResolveUp
                  </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
              &copy; {currentYear} {t("footer.rights")}
          </div>
        </div>
      </div>
    </footer>
  );
}