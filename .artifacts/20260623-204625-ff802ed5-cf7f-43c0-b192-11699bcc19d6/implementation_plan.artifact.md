# Convert Remaining Screens to Match Figma

Ensure that all remaining screens perfectly match the provided Figma source (`figma_Complete_App_Screen_Designs/src/app/App.tsx`). This includes refining existing implementations and completing any stubs.

## User Review Required

> [!NOTE]
> I found a redundant directory `src/screens/account` which contains stubs of screens that are already implemented in `src/screens/profile`. I plan to delete this directory to keep the codebase clean.

## Proposed Changes

### Clean up Redundant Files

#### [DELETE] `src/screens/account`
- Remove the entire directory as it is not used in any navigation or imports.

---

### Search Stack Refinement

#### [FullMapScreen.tsx](file:///home/r/Medicire/src/screens/search/FullMapScreen.tsx)
- Ensure the header and legend chips exactly match the Figma layout.
- Add "Search in this area" placeholder styling.

#### [ReservationConfirmScreen.tsx](file:///home/r/Medicire/src/screens/reservations/ReservationConfirmScreen.tsx)
- Update quantity selector and pickup time chips to match Figma's specific styles and labels.
- Ensure the summary card and total section align with the Figma design.

#### [ReservationStatusScreen.tsx](file:///home/r/Medicire/src/screens/reservations/ReservationStatusScreen.tsx)
- Refine the status hero cards (pending, confirmed, ready, cancelled, completed) to match Figma's color scheme and icons.
- Keep the timeline for better UX but ensure it complements the Figma design.

---

### Prescription (Rx) Stack Refinement

#### [RxCropScreen.tsx](file:///home/r/Medicire/src/screens/prescription/RxCropScreen.tsx)
- Match the tool bar (Crop, Rotate, Enhance) icons and labels precisely.
- Ensure the crop guides and corner markers look exactly like Figma.

#### [RxProgressScreen.tsx](file:///home/r/Medicire/src/screens/prescription/RxProgressScreen.tsx)
- Ensure the circular progress and percentage text match Figma.

#### [RxOcrScreen.tsx](file:///home/r/Medicire/src/screens/prescription/RxOcrScreen.tsx)
- Refine the AI stage cards to match Figma's colors and "done" vs "active" states.

#### [RxReviewScreen.tsx](file:///home/r/Medicire/src/screens/prescription/RxReviewScreen.tsx)
- Match the medicine card layout, confidence bars, and "Add medicine manually" button.

#### [RxResultsScreen.tsx](file:///home/r/Medicire/src/screens/prescription/RxResultsScreen.tsx)
- Refine the gradient "Best match" card and the availability list with stock dots.

---

### Profile & Account Stack Refinement

#### [NotificationsScreen.tsx](file:///home/r/Medicire/src/screens/profile/NotificationsScreen.tsx)
- Refine the notification items to match Figma's layout (icons, colors, unread indicators).
- Ensure the "Mark all read" button is present and styled correctly.

#### [AddressesScreen.tsx](file:///home/r/Medicire/src/screens/profile/AddressesScreen.tsx)
- Match the address card layout, icons (Home, Work), and "Add new address" button.

## Verification Plan

### Automated Tests
- No automated UI tests are available, but I will perform a build check to ensure no syntax errors are introduced.
- `npm run tsc` to verify type safety.

### Manual Verification
- **Visual Comparison**: Manually compare each updated screen against the Figma source (`App.tsx` logic) to ensure pixel-perfect (or as close as possible in React Native) alignment.
- **Navigation Flow**: Verify that the back buttons and navigation actions work as expected across the newly updated screens.
- **State Changes**: Verify that different states (e.g., in-stock vs out-of-stock, different reservation statuses) render correctly.
