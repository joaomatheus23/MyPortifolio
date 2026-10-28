import { useEffect, useState } from 'react';

export const SECTION_IDS = [
  'home',
  'about',
  'game',
  'experience',
  'cyber',
  'canada',
  'education',
  'projects',
  'skills',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

// Seção que está cruzando o meio da tela
export function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    SECTION_IDS.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}
