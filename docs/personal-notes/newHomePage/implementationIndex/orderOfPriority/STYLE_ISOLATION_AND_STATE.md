# Style Isolation and State Management for Quantum Portal

## Style Isolation

### 1. CSS Module Approach
```scss
// quantum-portal.module.scss
.portalContainer {
  // Local scope ensures no external CSS bleeds in
  composes: global(parallax-container);
  
  // Force override any inherited styles
  all: initial;
  * {
    all: unset;
    box-sizing: border-box;
  }
  
  // Establish new stacking context
  isolation: isolate;
  position: relative;
}
```

### 2. Defensive Selectors
```css
/* Prevent external styles from affecting portal layers */
.quantum-portal-layer[data-portal="true"] {
  /* Increases specificity and isolation */
  && {
    position: fixed !important;
    z-index: -3 !important;
  }
}

/* Protect clip-path backgrounds */
.scene-background[data-quantum="true"] {
  && {
    background: var(--scene-bg) !important;
    clip-path: var(--scene-clip) !important;
  }
}
```

### 3. CSS Custom Properties Scope
```css
.quantum-portal-root {
  /* Scoped variables prevent inheritance issues */
  --portal-color-primary: var(--user-color-1, #ff00cc);
  --portal-color-secondary: var(--user-color-2, #00fff7);
  --portal-color-tertiary: var(--user-color-3, #1a003a);
  
  /* Transition timings */
  --portal-transition: 1.2s cubic-bezier(0.4,0,0.2,1);
  
  /* Z-index scope */
  --portal-base-z: -4;
  --portal-quantum-z: -3;
  --portal-scene-z: -2;
  --portal-content-z: -1;
}
```

## State Management

### 1. Portal State Controller
```jsx
function usePortalState(initialState) {
  const [portalState, setPortalState] = useState(initialState);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const updatePortalState = useCallback((newState) => {
    setIsTransitioning(true);
    setPortalState(newState);
    
    // Ensure transition completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200); // Match transition duration
  }, []);
  
  return { portalState, isTransitioning, updatePortalState };
}
```

### 2. Transition Lock Prevention
```jsx
function PortalBackground({ portalState, isTransitioning }) {
  const backgroundStyle = useMemo(() => ({
    background: `
      radial-gradient(ellipse at 30% 50%,
        ${portalState.colors[0]}88 0%,
        ${portalState.colors[1]}66 30%,
        ${portalState.colors[2]}44 60%,
        transparent 100%
      )
    `,
    // Prevent new transition while current one is active
    transition: isTransitioning ? 'none' : 'background 1.2s cubic-bezier(0.4,0,0.2,1)'
  }), [portalState, isTransitioning]);
  
  return <div className="quantum-portal-layer" style={backgroundStyle} />;
}
```

### 3. Scroll-Based State Updates
```jsx
function useScrollBasedPortalUpdate(updatePortalState) {
  useEffect(() => {
    let lastUpdate = 0;
    const THROTTLE_MS = 1200; // Match transition duration
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate < THROTTLE_MS) return;
      
      updatePortalState(quantumCollapse(portalWorlds));
      lastUpdate = now;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updatePortalState]);
}
```

## Integration Example

```jsx
function HomePage() {
  // Initialize with CSS Module
  const styles = useStyles();
  
  // Setup portal state
  const { portalState, isTransitioning, updatePortalState } = usePortalState(
    quantumCollapse(portalWorlds)
  );
  
  // Setup scroll handler
  useScrollBasedPortalUpdate(updatePortalState);
  
  return (
    <div className={styles.portalContainer}>
      {/* Dark Base */}
      <div className={styles.darkBase} />
      
      {/* Portal Layer */}
      <PortalBackground
        portalState={portalState}
        isTransitioning={isTransitioning}
      />
      
      {/* Scene Backgrounds */}
      <div
        className={styles.sceneBackground}
        data-quantum="true"
        style={{
          '--scene-bg': `linear-gradient(120deg,
            rgba(10,15,26,0.92) 0%,
            rgba(10,15,26,0.85) 100%
          )`,
          '--scene-clip': 'polygon(0 0, 100% 0, 100% 80%, 60% 100%, 0 80%)'
        }}
      />
      
      {/* Content */}
      <div className={styles.content}>
        {/* Your content here */}
      </div>
    </div>
  );
}
```

## CSS Reset Safeguard

Add this to your global CSS to prevent any unwanted inheritance:

```css
/* quantum-portal-reset.css */
[data-quantum-portal-root] {
  all: initial;
  
  & * {
    all: unset;
    box-sizing: border-box;
  }
  
  & *::before,
  & *::after {
    all: unset;
  }
}
```

## Testing Steps

1. Verify no external styles affect portal layers
2. Check smooth transitions between states
3. Confirm dark top section remains during transitions
4. Test scroll performance with throttling
5. Validate clip-path reveals maintain consistency
6. Ensure z-index isolation works across viewport sizes

This isolation and state management system should help prevent any external styles from interfering with the quantum portal system while maintaining smooth transitions and proper layering.