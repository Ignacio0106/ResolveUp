import React from "react";
import { ArrowRightSquareIcon, ClipboardListIcon, BellIcon, TrendingUpIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();
  const caracteristicas = [
    {
      icon: ClipboardListIcon,
      title: t("home.features.incidentTracking.title"),
      description: t("home.features.incidentTracking.description")
    },
    {
      icon: BellIcon,
      title: t("home.features.realtimeNotifications.title"),
      description: t("home.features.realtimeNotifications.description")
    },
    {
      icon: TrendingUpIcon,
      title: t("home.features.analyticsReports.title"),
      description: t("home.features.analyticsReports.description")
    }
  ];

  return (
    <div className="w-full min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4 py-16 bg-accent">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground drop-shadow-lg">
            {t("home.title")}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 mb-8 drop-shadow max-w-2xl mx-auto">
              {t("home.subtitle")}
          </p>
          
            <Link
              to="/usuario/Login"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50"
              aria-label={t("home.loginCtaAriaLabel")}
            >
              <span>{t("home.loginCta")}</span>
              <ArrowRightSquareIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
        </div>
      </section>
      <section className="px-4 py-16 bg-foreground/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {t("home.featuresTitle")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {caracteristicas.map((caracteristica, index) => (
              <div
                key={index}
                className="group flex flex-col bg-card items-start p-6 lg:p-8 rounded-2xl border border-border hover:border-accent/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-14 h-14 group-hover:scale-110 transition-all duration-300">
                  <caracteristica.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" aria-hidden="true" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {caracteristica.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                  {caracteristica.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}