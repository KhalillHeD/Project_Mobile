# UI Enhancement Plan for RealJobseekerSwipeScreen.tsx and JobOfferCard.tsx

## RealJobseekerSwipeScreen.tsx
- [ ] Make loading state inline within deck area (keep header visible, add centered spinner in deck).
- [ ] Make error state inline within deck area (keep header visible, add error message and retry button).
- [ ] Make empty state inline within deck area (keep header visible, add friendly copy and call-to-action).
- [ ] Enhance header with better typography, spacing, and subtle glass styling.
- [ ] Add entrance animations for cards (fade-in and slide-up on mount).
- [ ] Improve action buttons with enhanced press feedback (scale and opacity animations).

## JobOfferCard.tsx
- [ ] Replace hardcoded colors with Colors.* tokens where possible.
- [ ] Improve typography, spacing, and add subtle glass overlay (1-2 low-opacity constants).
- [ ] Ensure better contrast and readability for accessibility.

## Followup
- [ ] Test inline states, animations, and accessibility.
- [ ] Confirm no API logic changes.
- [ ] Verify theme token usage and professional palette.
