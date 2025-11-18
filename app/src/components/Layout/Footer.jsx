import React from "react";
import { LaptopMinimalCheck, Code2, Heart, Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 w-full bg-gradient-to-r from-card/98 via-muted/95 to-card/98 backdrop-blur-2xl border-t border-border/50 shadow-2xl z-40">
      <div className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ResolveUp
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Sistema de gestión de tickets y soporte técnico
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs">
              &copy; {currentYear} Todos los derechos reservados
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
              <span>&copy; {currentYear} Todos los derechos reservados</span>
          </div>
        </div>
      </div>
    </footer>
  );
}