interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0A0F1C] text-white px-4 pt-16 pb-16 md:pt-20 md:pb-20">
      <div className="absolute inset-0 mesh-bg opacity-30 mix-blend-screen" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div className="container-custom relative z-10 text-center">
        <h1 className="heading-xl text-3xl sm:text-4xl md:text-5xl mb-4">{title}</h1>
        {subtitle ? (
          <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
