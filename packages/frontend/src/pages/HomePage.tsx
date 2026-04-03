import { useRef, useEffect, useState } from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { AiCoachShowcase } from '../components/landing/AiCoachShowcase';
import { VisualizationShowcase } from '../components/landing/VisualizationShowcase';
import { FriendsShowcase } from '../components/landing/FriendsShowcase';
import { ContestShowcase } from '../components/landing/ContestShowcase';
import { CtaSection } from '../components/landing/CtaSection';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: isVisible ? 'animate-fade-up' : 'opacity-0' };
}

function FadeIn({ children }: { children: React.ReactNode }) {
  const { ref, className } = useFadeIn();
  return <div ref={ref} className={className}>{children}</div>;
}

export function HomePage() {
  return (
    <div className="pb-8">
      <HeroSection />

      <FadeIn>
        <AiCoachShowcase />
      </FadeIn>

      <FadeIn>
        <VisualizationShowcase />
      </FadeIn>

      <FadeIn>
        <FriendsShowcase />
      </FadeIn>

      <FadeIn>
        <ContestShowcase />
      </FadeIn>

      <FadeIn>
        <CtaSection />
      </FadeIn>
    </div>
  );
}
