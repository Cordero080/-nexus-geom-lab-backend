# HomePage CSS Organization Guide

## File Structure

```
HomePage/
  ├── HomeIndex.module.scss (1715 lines - MAIN STYLESHEET)
  └── styles/
      ├── homepage.css (imported in index.css - basic component styles)
      └── titles.css (imported in index.css - shared title effects)
```

## HomeIndex.module.scss Organization

### Why It's So Large (1715 lines)

This file intentionally contains ALL HomePage-specific styles in ONE place because:
- **Load order guarantee**: CSS Modules ensures proper loading with the component
- **Animation dependencies**: Global classes reference keyframes in the same file
- **SCSS features**: Uses `@extend`, nesting, and other SCSS features
- **Scoped + Global together**: Module classes and their related global styles are colocated

### File Sections

```scss
/* SECTION 1: MODULE-SCOPED CLASSES (lines 15-480) */
// Used via: styles.className
.parallaxContainer { }
.bgReality { }
.baseDark { }
// ... background layers, layout, parallax

/* SECTION 2: ANIMATIONS (lines 480-575) */
@keyframes particleArrivalTopLeft { }
@keyframes titleFloatLayer1 { }
// ... title entrance animations

/* SECTION 3: GLOBAL - Title Animations (lines 575-670) */
:global {
  .title-word[data-word='N3XUS'] { }
  // ... HomePage-specific title animations
}

/* SECTION 4: GLOBAL - Components (lines 670-end) */
:global {
  .quantum-nav { }
  .logo-text { }
  .quantum-scene { }
  // ... navigation, scenes, UI elements
}
```

## Module Classes Usage

### ✅ USED (10 classes)
These are imported and used via `styles.className`:

```jsx
// HomePage.jsx
<div className={styles.parallaxContainer}>
<div className={styles.bgReality}>
<h1 className={styles.quantumTitle}>

// BackgroundLayers.jsx
<div className={styles.baseDark}>
<div className={styles.quantumPortalLayer}>
<div className={styles.quantumVeil}>
<div className={styles.darkTopVeil}>
<div className={styles.parallaxBgLayer}>
<div className={styles.parallaxFgLayer}>
```

### ❌ UNUSED (23 classes)
**Safe to remove** - not referenced anywhere:

```scss
.portalContainer
.sceneBackground
.bgProbability
.bgEntanglement  
.bgSuperposition
.pageTop
.sceneContent
.sceneTitle
.sceneDescription
.parallaxHolo
.scrambleTitle
.quantumScene
.floatingCode
.quantumConsole
.consoleLine
.homeEnterGeomLabBtn
.scrambleButton
.quantum-title  // duplicate in :global
.dimensionalRift
// ... and ~4 more
```

## Global Styles (in :global blocks)

### What They Do
Global styles are wrapped in `:global { }` to:
1. **Avoid CSS Modules hashing** - class names stay as-is
2. **Keep load order** - loads with component, not globally
3. **Use SCSS features** - can use `&`, nesting, etc.

### Examples

```scss
:global {
  .quantum-nav {
    // Used directly in QuantumNav component
    // No styles.quantumNav needed
  }
  
  .logo-text {
    &::before { /* SCSS nesting */ }
    &::after { /* SCSS nesting */ }
  }
}
```

## Why We DON'T Split This File

### ❌ Bad Approach: Split into module + global files
```
❌ homepage-scoped.module.scss
❌ homepage-global.css
```

**Problems:**
- Breaks animation references (global classes can't find @keyframes)
- Changes CSS specificity (`:global{}` in module ≠ plain .css file)
- Breaks load order (module files load differently than regular CSS)
- Loses SCSS features in global styles (no nesting, no `&`)

### ✅ Better Approach: Organize within the file
```
✅ Add clear section comments
✅ Remove unused module classes
✅ Document what's used vs unused
✅ Keep everything in one file
```

## Cleanup Strategy

### Phase 1: Remove Unused Module Classes ✅ Ready
Remove these 23 unused classes:
- `.portalContainer` through `.dimensionalRift`
- Saves ~200-300 lines
- Zero impact on functionality

### Phase 2: Consolidate Duplicate Styles (Future)
Some styles exist in both:
- `HomeIndex.module.scss`
- `styles/homepage.css`
- `styles/titles.css`

Identify overlaps and remove duplicates.

### Phase 3: Extract True Global Styles (Future)
Move styles that are used by MULTIPLE pages:
- Keep in `HomeIndex.module.scss`: HomePage-specific only
- Move to `index.css` imports: Shared across pages

## Related Files

- `/src/index.css` - Imports `homepage.css` and `titles.css`
- `/src/components/pages/HomePage/styles/homepage.css` - Basic component styles
- `/src/components/pages/HomePage/styles/titles.css` - Shared title effects

## Key Takeaways

1. **Large file ≠ bad file** - colocation ensures correctness
2. **:global{} is correct** - not a hack, it's the right pattern
3. **Remove unused, not split** - organization via comments + cleanup
4. **Test incrementally** - change one class at a time
