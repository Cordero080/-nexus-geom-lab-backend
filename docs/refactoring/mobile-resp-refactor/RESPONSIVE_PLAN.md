# Mobile Responsiveness Refactoring Plan

**Project**: Nexus-Geom 3D  
**Date Started**: November 5, 2025  
**Goal**: Make app responsive for tablet (768px-1024px) and mobile (<768px) without breaking desktop experience

---

## 🎯 Objectives

### Primary Goals:

1. ✅ **Maintain Desktop Experience** - No changes above 1024px
2. ✅ **Tablet Support** - Full feature parity with desktop, just scaled
3. ✅ **Mobile Support** - Adapted layouts (bottom drawer, simplified parallax)
4. ✅ **No Breaking Changes** - Incremental, testable changes

### Non-Negotiables:

- ❌ **DO NOT** touch Three.js rendering logic
- ❌ **DO NOT** modify animation/rotation code
- ❌ **DO NOT** change desktop styles (only add @media queries)
- ✅ **ONLY** add responsive CSS at the end of files

---

## 📊 Breakpoint Strategy

```
Desktop:     > 1024px     ✅ Untouched
Tablet:      768-1024px   ⚙️ Minor scaling
Mobile Large: 481-768px   ⚙️ Layout adjustments
Mobile Small: < 480px     ⚙️ Bottom drawer, simplified
```

---

## 🗂️ Components to Refactor

### Phase 1: Tablet (768px-1024px) - SAFE

**Status**: 🟡 In Progress

| Component         | File                                               | Changes Needed                          | Risk Level |
| ----------------- | -------------------------------------------------- | --------------------------------------- | ---------- |
| Controls Panel    | `Controls.module.scss`                             | Width: 280px→260px, font: 14px→13px     | 🟢 Low     |
| Save/Exit Buttons | `SaveButton.module.scss`, `ExitButton.module.scss` | Position adjustments                    | 🟢 Low     |
| ShowcaseViewer    | `ShowcaseViewer.css`                               | Character nav, speed slider positioning | 🟢 Low     |
| HomePage Portal   | `HomeIndex.module.scss`                            | Scale parallax layers proportionally    | 🟡 Medium  |
| MyScenesPage Grid | Already responsive (3/2/1 columns)                 | Verify only                             | 🟢 Low     |
| Navigation        | TBD                                                | May need hamburger menu                 | 🟡 Medium  |

### Phase 2: Mobile (<768px) - TEST THOROUGHLY

**Status**: ⚪ Not Started

| Component         | File                                | Changes Needed                     | Risk Level |
| ----------------- | ----------------------------------- | ---------------------------------- | ---------- |
| Controls Panel    | `Controls.module.scss`              | Bottom drawer instead of left side | 🟡 Medium  |
| Save/Exit Buttons | Position in mobile layout           | Bottom-left corner                 | 🟢 Low     |
| HomePage Portal   | Simplified parallax (reduce layers) | May affect visual quality          | 🟡 Medium  |
| ShowcaseViewer    | Stack character nav vertically      | 🟢 Low                             |
| Navigation        | Hamburger menu                      | 🟡 Medium                          |

---

## 🛡️ What's Protected (Won't Change)

### Desktop Experience (>1024px):

- ✅ Quantum Portal parallax (all layers, full effect)
- ✅ Controls panel position (left side, 280px)
- ✅ Save/Exit button positions (bottom-right)
- ✅ All mouse hover interactions
- ✅ 3D object animations and rotations
- ✅ Material color real-time updates
- ✅ Character showcase viewer layout

### Core Functionality (All Breakpoints):

- ✅ Three.js rendering engine
- ✅ OrbitControls (already touch-compatible)
- ✅ Scene saving/loading
- ✅ Authentication flows
- ✅ Material property updates
- ✅ Object factory and caching
- ✅ React hooks and state management

---

## 📝 Implementation Strategy

### Approach:

1. **Additive Only**: Add `@media` queries at end of CSS files
2. **No Deletions**: Don't remove or modify existing desktop styles
3. **Incremental**: Test after each component
4. **Reversible**: Can easily comment out @media blocks to revert

### CSS Pattern:

```scss
// ===== EXISTING DESKTOP STYLES (UNTOUCHED) =====
.controls {
  position: absolute;
  left: 20px;
  width: 280px;
  // ... all existing code ...
}

// ===== NEW RESPONSIVE STYLES (ADDED AT END) =====
@media (max-width: 1024px) and (min-width: 769px) {
  .controls {
    width: 260px; // Only override specific properties
  }
}
```

---

## ✅ Testing Checklist

### After Each Change:

- [ ] Desktop (1920x1080) - Verify no changes
- [ ] Desktop (1440x900) - Verify no changes
- [ ] Tablet Landscape (1024x768) - Verify new styles apply
- [ ] Tablet Portrait (768x1024) - Verify new styles apply
- [ ] Mobile Landscape (768x480) - Verify new styles apply
- [ ] Mobile Portrait (480x800) - Verify new styles apply

### Specific Features to Test:

- [ ] Quantum Portal parallax (mouse tracking on desktop, simplified on mobile)
- [ ] Object rotation (mouse drag on desktop, touch drag on mobile)
- [ ] Controls panel (left side on desktop, bottom drawer on mobile)
- [ ] Material color updates (real-time on all devices)
- [ ] Save/Load functionality (all devices)
- [ ] Character showcase (navigation, speed slider)
- [ ] Authentication flows (forms, modals)

---

## 🚨 Rollback Plan

If anything breaks:

1. **Immediate Rollback**: Comment out the entire `@media` block
2. **Selective Rollback**: Comment out specific properties inside `@media`
3. **Git Revert**: Revert the commit if needed

Example:

```scss
// @media (max-width: 1024px) {
//   .controls {
//     width: 260px;
//   }
// }
```

---

## 📈 Progress Tracking

### Completed:

- [x] Created documentation folder
- [x] Defined breakpoint strategy
- [x] Audited existing responsive styles
- [x] Added tablet styles to Controls.module.scss

### In Progress:

- [ ] Adding tablet styles to Save/Exit buttons
- [ ] Adding tablet styles to ShowcaseViewer
- [ ] Testing tablet breakpoints

### Not Started:

- [ ] Mobile portrait styles (<480px)
- [ ] Mobile landscape styles (481-768px)
- [ ] Hamburger navigation menu
- [ ] Simplified parallax for mobile
- [ ] Bottom drawer controls for mobile

---

## 📊 Component Inventory

### Desktop Layout (>1024px):

```
┌─────────────────────────────────────────────┐
│  Header/Nav (top)                           │
├──────────┬──────────────────────────────────┤
│ Controls │  3D Canvas (center)              │
│ (left)   │                                  │
│ 280px    │  OrbitControls                   │
│          │                                  │
│          │                                  │
│          │                                  │
│          │                    Save (bottom-right)
│          │                    Exit (bottom-right)
└──────────┴──────────────────────────────────┘
```

### Tablet Layout (768-1024px):

```
┌─────────────────────────────────────────────┐
│  Header/Nav (top)                           │
├──────────┬──────────────────────────────────┤
│Controls  │  3D Canvas (center)              │
│(left)    │                                  │
│260px     │  OrbitControls                   │
│          │                                  │
│          │                                  │
│          │                    Save/Exit     │
└──────────┴──────────────────────────────────┘
```

### Mobile Layout (<768px):

```
┌─────────────────────────────────────────────┐
│  Header/Nav (hamburger)                     │
├─────────────────────────────────────────────┤
│                                             │
│  3D Canvas (full screen)                    │
│                                             │
│  Touch controls                             │
│                                             │
│                            Save (top-right) │
│                            Exit (top-right) │
├─────────────────────────────────────────────┤
│  Controls (bottom drawer - swipe up)        │
│  ▼ Material | Scene ▼                       │
└─────────────────────────────────────────────┘
```

---

## 🎨 Design Considerations

### Quantum Portal Parallax:

**Desktop** (Full Experience):

- 6 parallax layers
- Mouse tracking
- Smooth animations
- Glow effects

**Tablet** (Maintained):

- 6 parallax layers
- Touch/gyro tracking (if available)
- Smooth animations
- Glow effects

**Mobile** (Simplified):

- 3-4 parallax layers (remove deepest layers)
- Reduce glow intensity
- Lighter animations
- Maintain visual identity

### Controls Panel:

**Desktop**: Left sidebar, always visible
**Tablet**: Left sidebar, slightly narrower
**Mobile**: Bottom drawer, collapsible

---

## 🔧 Technical Notes

### CSS Modules:

- Most components use `.module.scss`
- Styles are scoped automatically
- Can safely add `@media` at end without conflicts

### Regular CSS:

- Some components use `.css` (ShowcaseViewer, LoginPage)
- Be careful with global selectors
- Prefer class-based targeting

### Three.js:

- Canvas is inherently responsive (100% width/height)
- OrbitControls already support touch
- No changes needed to rendering code

---

## 📚 Reference Links

- [CSS Breakpoints Best Practices](https://www.freecodecamp.org/news/css-media-queries-breakpoints-media-types-standard-resolutions-and-more/)
- [Three.js Responsive Design](https://threejs.org/manual/#en/responsive)
- [Touch Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

**Last Updated**: November 5, 2025  
**Status**: Phase 1 (Tablet) In Progress  
**Next Review**: After tablet testing complete
