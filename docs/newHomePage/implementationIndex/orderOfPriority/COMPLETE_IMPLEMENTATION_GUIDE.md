# Complete Quantum Portal Implementation Guide

## Layer Structure Overview

```
Base → Portal → Clip-Paths → Content → Nav
-4       -3        -2          -1       0
```

## Critical Components Interaction

### 1. Base Dark Layer (z-index: -4)
```css
.base-dark {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(0,0,0,0.98) 0%,
    rgba(10,15,26,0.95) 30%,
    rgba(10,15,26,0.85) 100%
  );
  z-index: -4;
}
```

### 2. Quantum Portal Layer (z-index: -3)
```jsx
<div
  className="quantum-portal-layer"
  style={{
    position: "fixed",
    inset: 0,
    zIndex: -3,
    background: `
      radial-gradient(ellipse at 30% 50%,
        ${portalState.colors[0]}88 0%,
        ${portalState.colors[1]}66 30%,
        ${portalState.colors[2]}44 60%,
        transparent 100%
      )
    `,
    // Critical: Portal colors only visible in middle section
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.1) 80%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.1) 80%, transparent 100%)',
    transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)"
  }}
/>
```

### 3. Clip-Path Scene Backgrounds (z-index: -2)
```css
.scene-background {
  position: absolute;
  inset: 0;
  z-index: -2;
  /* Semi-transparent to reveal portal colors */
  background: linear-gradient(
    120deg,
    rgba(10,15,26,0.92) 0%,
    rgba(10,15,26,0.85) 100%
  );
}

/* Specific clip-paths */
.bg-reality {
  clip-path: polygon(0 0, 100% 0, 100% 80%, 60% 100%, 0 80%);
}

.bg-probability {
  clip-path: polygon(0 10%, 100% 0, 100% 90%, 0 100%);
}

/* ... other clip-paths ... */
```

## Critical CSS Rules to Override

```css
/* These must be added to override any existing styles */
.parallax-container {
  position: relative;
  z-index: -1;
}

/* Ensure content stays above backgrounds */
.scene-content {
  position: relative;
  z-index: 1;
}

/* Keep nav on top */
.quantum-nav {
  position: fixed;
  z-index: 0;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(30px);
}
```

## Essential Mask Gradients

```css
/* Dark top veil */
.dark-top-veil {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg,
    rgba(0,0,0,0.95) 0%,
    rgba(0,0,0,0.9) 10%,
    rgba(0,0,0,0.8) 20%,
    rgba(0,0,0,0) 40%
  );
  pointer-events: none;
}

/* Portal reveal mask */
.portal-reveal-mask {
  position: fixed;
  inset: 0;
  z-index: -2;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(0,0,0,0.1) 20%,
    rgba(0,0,0,1) 40%,
    rgba(0,0,0,1) 60%,
    rgba(0,0,0,0.1) 80%,
    transparent 100%
  );
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

## Transition Timing Functions

All transitions MUST use this timing:
```css
transition: all 1.2s cubic-bezier(0.4,0,0.2,1);
```

## Preventing Common Issues

1. **Conflicting z-index stacks**:
```css
/* Add to any parent containers */
.parent-container {
  position: relative;
  z-index: auto;
  isolation: isolate;
}
```

2. **Background bleed-through**:
```css
/* Add to scene backgrounds */
.scene-background {
  isolation: isolate;
  mix-blend-mode: normal;
}
```

3. **Color intensity control**:
```css
/* Portal color opacity values */
--portal-primary-opacity: 0.88; /* 88 in hex */
--portal-secondary-opacity: 0.66; /* 66 in hex */
--portal-tertiary-opacity: 0.44; /* 44 in hex */
```

## Implementation Order

1. Add base dark layer
2. Add quantum portal layer with mask
3. Add clip-path scenes with transparency
4. Add dark top veil
5. Add portal reveal mask
6. Test scroll behavior
7. Fine-tune opacity values
8. Add transitions
9. Test on different viewports

## Testing Checkpoints

1. ✓ Top of page is dark (not colored)
2. ✓ Middle section shows portal colors through clip-paths
3. ✓ Colors transition smoothly on scroll
4. ✓ No z-index conflicts with content
5. ✓ Nav bar stays on top and readable
6. ✓ Clip-paths create clean edges
7. ✓ Portal colors visible in correct intensity
8. ✓ Dark veil properly fades top section