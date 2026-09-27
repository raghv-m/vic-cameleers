# Verdict: REDESIGN

The site's facts, copy honesty and technical base are sound, but at 15/30 it reads as a generic
template that repeats itself, hides the price below the fold, fails AA contrast on its own CTA, and
shows the business's one memorable idea (the cameleers) only as text, so it needs a redesign built
around purpose, not a restyle.

Top moves:

1. #2 Useful: put the live price calculator and phone number in the first mobile screen.
   Evidence: `pricing-teaser.tsx` is section 4 of 12 (`page.tsx`).
2. #10 Less but better: merge How it works + timeline into one route of 3 stops, and trust strip +
   why-us + review trust cards into one proof strip plus crew. Evidence: 01 Structural.
3. #8 Thorough: deepen terracotta so CTA text passes 4.5:1, never fade content from opacity 0,
   add `error.tsx`, link field errors with aria-describedby. Evidence: 01 Visual contrast list.
4. #1/#7 Identity: one idea (the caravan route), stencil/slab type, kraft texture, hard 2px borders,
   labelled photo slots at final aspect ratios. Evidence: Oswald + Inter, zero images.
5. #9 Weight: keep animation JS local and small (LazyMotion + GSAP only where used).
   Evidence: 271 KB JS on home.
