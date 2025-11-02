# CRITICAL: How to Apply Color Shifts Between Clip-Paths

## ❌ Common Mistake

Applying `portalState.colors` to the **parallax SVG layers** at the top:

```jsx
// WRONG - This only changes the top decorative SVGs
<svg style={{
  background: `linear-gradient(120deg,
    ${portalState.colors[0]} 0%,
    ${portalState.colors[1]} 60%,
    ${portalState.colors[2]} 100%)`
}}>
```

**Problem**: The clip-path scene backgrounds (`.bg-reality`, `.bg-probability`, etc.) remain **static gray**, so you only see color at the very top, not between scenes.

---

## ✅ Correct Implementation

### 1. Make Scene Backgrounds Dynamic

**Instead of static CSS:**

```css
/* DON'T DO THIS */
.bg-reality {
  background: linear-gradient(120deg, #0a0f1a 60%, #1a2a3a 100%);
}
```

**Use inline styles with portalState:**

```jsx
<div
  className="scene-background bg-reality"
  style={{
    background: `linear-gradient(120deg, 
      ${portalState.colors[0]}33 0%, 
      ${portalState.colors[1]}22 60%, 
      ${portalState.colors[2]} 100%),
      repeating-linear-gradient(-30deg, 
        ${portalState.colors[1]}22 0 2px, 
        transparent 2px 40px)`,
    transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)",
  }}
/>
```

### 2. Apply to ALL Scene Backgrounds

**Scene 1 (Reality):**

```jsx
<div
  className="scene-background bg-reality"
  style={{
    background: `linear-gradient(120deg, 
      #0a0f1a 0%, 
      ${portalState.colors[0]}44 40%,
      ${portalState.colors[1]}33 70%, 
      ${portalState.colors[2]}22 100%)`,
    transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)",
  }}
/>
```

**Scene 2 (Probability):**

```jsx
<div
  className="scene-background bg-probability"
  style={{
    background: `linear-gradient(135deg, 
      #0a0f1a 0%, 
      ${portalState.colors[1]}55 50%,
      ${portalState.colors[2]}33 100%)`,
    transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)",
  }}
/>
```

**Scene 3 (Entanglement):**

```jsx
<div
  className="scene-background bg-entanglement"
  style={{
    background: `linear-gradient(110deg, 
      #0a0f1a 0%, 
      ${portalState.colors[0]}66 40%,
      ${portalState.colors[1]}44 70%,
      ${portalState.colors[2]}22 100%)`,
    transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)",
  }}
/>
```

**Scene 4 (Superposition):**

```jsx
<div
  className="scene-background bg-superposition"
  style={{
    background: `linear-gradient(160deg, 
      #0a0f1a 0%, 
      ${portalState.colors[2]}77 30%,
      ${portalState.colors[1]}55 60%,
      ${portalState.colors[0]}33 100%)`,
    transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)",
  }}
/>
```

---

## 🎯 Key Points

### 1. Keep Clip-Paths in CSS

```css
.bg-reality {
  clip-path: polygon(0 0, 100% 0, 100% 80%, 60% 100%, 0 80%);
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  /* Remove static background colors */
}
```

### 2. Use Alpha Values for Layering

- Start dark: `#0a0f1a` (base navy)
- Add portal colors with alpha: `${portalState.colors[0]}44` (44 = ~27% opacity)
- Higher alpha at edges for visibility: `66`, `77`
- Lower alpha in middle: `22`, `33`

### 3. Transition is CRITICAL

```jsx
transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)";
```

Without this, colors will snap instantly instead of smooth shifting.

### 4. Alpha Hex Values Reference

- `22` = 13% opacity
- `33` = 20% opacity
- `44` = 27% opacity
- `55` = 33% opacity
- `66` = 40% opacity
- `77` = 47% opacity
- `88` = 53% opacity

---

## 🔍 Why This Works

1. **Clip-paths create the shapes** (CSS)
2. **Scene backgrounds receive portal colors** (inline styles)
3. **Colors shift as user scrolls** (scroll event triggers quantumCollapse)
4. **Smooth transitions between states** (CSS transition)
5. **Dark base prevents washout** (start with `#0a0f1a`)
6. **Alpha blending shows color edges** (40-50% opacity at clip-path edges)

---

## 🚨 What NOT to Do

### ❌ Don't only color the top SVG

```jsx
// This only affects decorative top layer, not scene backgrounds
<svg style={{ background: `linear-gradient(...)` }}>
```

### ❌ Don't use 100% opaque colors

```jsx
// This washes out the dark theme
background: `linear-gradient(120deg, 
  ${portalState.colors[0]} 0%,  // TOO BRIGHT
  ${portalState.colors[1]} 100%)`;
```

### ❌ Don't forget transitions

```jsx
// Colors will snap, not smoothly shift
<div style={{ background: `...` }} /> // Missing transition!
```

---

## 📋 Implementation Checklist

- [ ] Remove static `background:` from `.bg-*` CSS classes (keep clip-path)
- [ ] Add inline `style` prop to each scene background div
- [ ] Use `portalState.colors[0/1/2]` in gradients
- [ ] Add alpha values (22-77) to portal colors
- [ ] Keep `#0a0f1a` as base dark color
- [ ] Include `transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)'`
- [ ] Test scroll to verify color shifts between clip-paths
- [ ] Verify clip-path edges are clearly defined by color contrast

---

## 🎨 Visual Result

When implemented correctly:

- Dark navy base (`#0a0f1a`) throughout
- Portal colors **glow from the clip-path edges** as you scroll
- Each scene background **visibly shifts colors** on scroll
- Clip-path boundaries are **clearly defined by color contrast**
- **NOT** just a color change at the very top of the page

---

## 💡 Example: Full Scene with Dynamic Background

```jsx
<section
  className={`quantum-scene${activeScene === 0 ? " active" : ""}`}
  id="reality"
>
  <div
    className="scene-background bg-reality"
    style={{
      background: `
        linear-gradient(120deg, 
          #0a0f1a 0%, 
          ${portalState.colors[0]}44 40%,
          ${portalState.colors[1]}33 70%, 
          ${portalState.colors[2]}22 100%
        ),
        repeating-linear-gradient(-30deg, 
          ${portalState.colors[1]}22 0 2px, 
          transparent 2px 40px
        )
      `,
      transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)",
    }}
  />
  <div className="scene-content">{/* Your content */}</div>
</section>
```

CSS keeps the shape:

```css
.bg-reality {
  clip-path: polygon(0 0, 100% 0, 100% 80%, 60% 100%, 0 80%);
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  /* NO background property here */
}
```
