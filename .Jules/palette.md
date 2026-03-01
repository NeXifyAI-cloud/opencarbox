## 2024-12-05 - [Loading States & Icon Accessibility]
**Learning:** Icon-only buttons (wishlist, details) frequently miss ARIA labels, making them inaccessible to screen readers. Asynchronous actions like "Add to Cart" benefit greatly from a `loading` state in the `Button` component to prevent duplicate clicks and provide clear feedback.
**Action:** Always include `aria-label` for icon-only components. Use a standard `loading` prop in the `Button` component that handles `disabled` state and displays an accessible spinner automatically.
