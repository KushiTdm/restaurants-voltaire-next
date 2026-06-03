'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollFx — wires GSAP + ScrollTrigger animations to elements
 * tagged with `data-fx="…"` anywhere in the document.
 *
 *  data-fx="fade-up"     → fade-in + 28px translateY when entering the viewport
 *  data-fx="reveal"      → same as fade-up but with a small stagger if children share it
 *  data-fx="parallax"    → translateY -60px → +60px while the element scrolls past
 *  data-fx="parallax-bg" → same effect on the background-position-y
 *  data-fx="hero-title"  → scale-down + fade while scrolling away from the hero
 *
 *  Extra hooks :
 *    data-fx-stagger   override stagger time (ms) on a parent
 *    data-fx-from-y    override the initial Y translation (px)
 *    data-fx-amount    override parallax amplitude (px)
 *
 *  Respects prefers-reduced-motion: short, distance-free fades only.
 */
export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cleanup: () => void = () => {};
    let cancelled = false;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const triggers: ScrollTrigger[] = [];

      // --- fade-up / reveal --------------------------------------------------
      const fadeNodes = gsap.utils.toArray<HTMLElement>(
        '[data-fx="fade-up"], [data-fx="reveal"]'
      );
      fadeNodes.forEach((el) => {
        const fromY = Number(el.dataset.fxFromY ?? (reduce ? 0 : 28));
        const tween = gsap.fromTo(
          el,
          { opacity: 0, y: fromY },
          {
            opacity: 1,
            y: 0,
            duration: reduce ? 0.4 : 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      // --- staggered children groups ----------------------------------------
      const groups = gsap.utils.toArray<HTMLElement>('[data-fx-group]');
      groups.forEach((parent) => {
        const stag = Number(parent.dataset.fxStagger ?? 90) / 1000;
        const kids = parent.querySelectorAll<HTMLElement>('[data-fx-item]');
        if (!kids.length) return;
        const tween = gsap.fromTo(
          kids,
          { opacity: 0, y: reduce ? 0 : 18 },
          {
            opacity: 1,
            y: 0,
            duration: reduce ? 0.3 : 0.7,
            ease: 'power2.out',
            stagger: reduce ? 0 : stag,
            scrollTrigger: {
              trigger: parent,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      if (!reduce) {
        // --- parallax (translate the whole element while scrolling) ---------
        const parallaxNodes = gsap.utils.toArray<HTMLElement>(
          '[data-fx="parallax"]'
        );
        parallaxNodes.forEach((el) => {
          const amount = Number(el.dataset.fxAmount ?? 70);
          const tween = gsap.fromTo(
            el,
            { y: -amount },
            {
              y: amount,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        });

        // --- parallax background (move background-position instead) ---------
        const parallaxBg = gsap.utils.toArray<HTMLElement>(
          '[data-fx="parallax-bg"]'
        );
        parallaxBg.forEach((el) => {
          const amount = Number(el.dataset.fxAmount ?? 24);
          el.style.backgroundAttachment = 'scroll';
          const tween = gsap.fromTo(
            el,
            { backgroundPositionY: `${-amount}%` },
            {
              backgroundPositionY: `${amount}%`,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        });

        // --- hero title : subtle fade + scale while leaving the viewport ----
        const heroNodes = gsap.utils.toArray<HTMLElement>('[data-fx="hero-title"]');
        heroNodes.forEach((el) => {
          const tween = gsap.fromTo(
            el,
            { y: 0, scale: 1, opacity: 1, letterSpacing: '-0.01em' },
            {
              y: 70,
              scale: 0.94,
              opacity: 0.35,
              letterSpacing: '0em',
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top top+=60',
                end: '+=500',
                scrub: true,
              },
            }
          );
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        });
      }

      // ScrollTrigger needs an explicit refresh when fonts / images load late.
      ScrollTrigger.refresh();
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad);

      cleanup = () => {
        window.removeEventListener('load', onLoad);
        triggers.forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pathname]);

  return null;
}
