# Project Structure BEFORE Refactoring

## Original Flat Component Structure

```
src/
├── App.jsx
├── cursor-override.module.scss
├── home.css
├── index.css
├── initializeScene.test.js
├── main.jsx
├── vite.config.js
├── assets/
│   ├── audio/
│   ├── images/
│   └── models/
├── components/
│   ├── Controls/
│   ├── CustomSelect/
│   ├── Effects/
│   ├── HUD/
│   │   ├── BeamScanButton/
│   │   │   ├── BeamScanButton.jsx
│   │   │   ├── BeamScanButton.module.scss
│   │   │   └── BeamScanButton-OLD.css
│   │   └── index.js
│   ├── InvertedLetterText/
│   ├── Modals/
│   ├── QuantumParticleSuperposition/
│   ├── Scenes/
│   ├── ScrambleButton/
│   └── SuperpositionParticles/
├── context/
│   ├── AuthContext.jsx
│   └── SceneContext.jsx
├── features/
│   └── sceneControls/
├── HomePage/              ❌ Page component in root src/
│   ├── Home.css
│   ├── HomePage.jsx
│   ├── ProgressBar.jsx
│   ├── Quote.jsx
│   └── Scene.jsx
├── nav/                   ❌ Layout component in root src/
│   ├── nav.css
│   ├── NavBar.jsx
│   └── navLabels.jsx
├── pages/                 ❌ Pages in root src/
│   ├── LoginPage/
│   │   ├── LoginPage.css
│   │   └── LoginPage.jsx
│   ├── MyScenesPage/
│   │   ├── MyScenesPage.css
│   │   └── MyScenesPage.jsx
│   └── SignUpPage/
│       ├── SignUpPage.css
│       └── SignUpPage.jsx
├── services/
│   └── sceneApi.jsx
├── Showcase/              ❌ Feature component in root src/
│   ├── index.js
│   ├── ShowcaseGallery.css
│   ├── ShowcaseGallery.jsx
│   ├── backgrounds/
│   ├── components/
│   ├── data/
│   ├── models/
│   └── utils/
├── styles/
│   ├── invertedLetters.module.scss
│   └── shared.module.scss
└── utils/
    ├── coreHelpers.js
    ├── geometryHelpers.js
    └── ...
```

## Problems with Original Structure:

❌ **Mixed component organization**: Pages, layout, and features scattered across root `src/`  
❌ **Inconsistent naming**: Some folders capitalized, others not  
❌ **No clear separation**: Hard to distinguish pages from features from layout components  
❌ **Import complexity**: Inconsistent relative paths throughout the codebase  
❌ **Poor scalability**: Would become unwieldy as project grows

## Key Issues:

- `HomePage/` should be in a pages folder
- `nav/` (NavBar) should be in a layout folder
- `pages/` should be organized under components
- `Showcase/` should be categorized as a feature
- Import paths were inconsistent and hard to maintain
