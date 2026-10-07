# Improve top menu bar UX

## Plan
- [x] Audit current top-bar/navigation behavior across interview, docs, and plan pages
- [x] Build a reusable hide-on-scroll top bar with immediate upward re-show, jitter tolerance, reduced-motion support, focus/menu visibility locks, and measured safe-area-aware offsets
- [x] Redesign navigation UX with a one-action Hub/Home control, sensible parent Back control, and clearer current-location labeling
- [x] Wire the new bar into the long-form pages (interview, docs, plan home/day/resource)
- [x] Ensure content is not covered, including docs deep links and anchor offsets
- [x] Build and manually verify desktop + mobile behavior in a browser
- [x] Capture before/after screenshots and walkthrough artifacts
- [ ] Commit, push, and open PR

## Notes
- Parker preferred hide-on-scroll-down / show-on-scroll-up instead of a permanently sticky bar.
- Docs required special handling because its main content scrolls inside an internal pane instead of the window.
- Window-scrolled pages needed suppression of the browser's scroll-anchoring bounce when the reserved header spacer collapses.

## Review
- Added a reusable `AppTopBar` component plus `useHideOnScrollBar` composable.
- The bar now provides a direct Hub/Home action and a logical Back action where a parent route exists.
- Verified in browser:
  - Desktop `/plan/day/3`: hide/show on scroll, Back to `/plan`, Home to `/`
  - Desktop `/docs/en/nuxt?from=plan#61-what-is-nuxtjs`: heading lands below the bar, hide/show works inside docs scroll pane, Back to `/plan`, Home to `/`
  - Mobile `/interview`: unlock with local passcode `123456`, hide/show works, content stays visible below the bar
- Final verification: `npm run build` passes.
