# Wireframe Specification for Nexus-Geom

## App Overview

A full-stack 3D application where users manipulate geometric shapes, save their creations, and share them in a public gallery. Features authentication, scene saving/loading, and an animation unlock system.

---

## 🎯 First-Time Visitor Flow

**The "Aha Moment" Journey:**

1. **Lands on Landing Page** - Sees hero section with app description
2. **Clicks "Enter Playground"** - No auth required (immediate gratification!)
3. **Plays with controls** - Moves sliders, sees 3D object update in real-time
4. **Creates something cool** - Gets invested in their creation
5. **Tries to save** → **Login modal appears** with message: "Login to save your creation"
6. **Signs up** → **Returns to Save Scene modal** with their scene preserved
7. **First save** → **🎉 Animation unlock toast appears!** "New Animation Unlocked: Float!"

**Why This Matters:** Users experience the core value (3D manipulation) BEFORE being asked to sign up. Classic "try before you buy" psychology.

---

## 📱 Responsive Behavior

### Desktop (1200px+)

- **Geometry Lab:** Sidebar left (300px), canvas fills remaining space
- **Galleries:** 3-4 column grid with cards
- **Scene Viewer:** Sidebar right (25% width)

### Tablet (768px - 1199px)

- **Geometry Lab:** Collapsible sidebar (hamburger menu icon), full-width canvas
- **Galleries:** 2 column grid
- **Scene Viewer:** Bottom drawer instead of sidebar

### Mobile (< 768px)

- **Geometry Lab:** Bottom drawer for controls (pull up to reveal)
- **Galleries:** 1 column grid
- **Scene Viewer:** Controls below canvas, stacked vertically
- **Modals:** Full-screen overlays instead of centered modals

---

## 🎬 Animation & Transition Notes

**For Designers:** Include these motion behaviors in wireframes

1. **Page Transitions:** Fade (300ms ease-out)
2. **Modal Entry:** Scale up from center (200ms cubic-bezier) + backdrop fade
3. **Card Hover States:**
   - Lift effect: `transform: translateY(-4px)`
   - Glow border appears
   - Thumbnail starts animating (if video/gif)
4. **Button Clicks:** Material Design ripple effect from click point
5. **Scene Loading:**
   - Spinner in center with "Loading scene..." text
   - Progress bar optional (stretch feature)
6. **Toast Notifications:** Slide in from top-right with bounce
7. **3D Canvas:** Always rendering at 60fps (note for performance testing)
8. **Control Sliders:** Live preview - no "Apply" button needed

---

## 🎨 Design Style Notes

- **Theme:** Dark mode with cosmic/space aesthetic
- **UI Style:** Glassmorphic elements (frosted glass effect with backdrop-blur)
- **Colors:**
  - Primary: Neon cyan (#00ffff)
  - Secondary: Magenta (#ff00ff)
  - Accent: Purple/orange gradients
  - Background: Deep space blacks/dark blues (#0a0a1f, #1a1a2e)
  - Text: Off-white (#e0e0e0) for primary, gray (#a0a0a0) for secondary
- **Typography:** Futura font family (or similar geometric sans-serif)
- **Gradients:** Background gradients change based on environment type
  - Nebula: Purple → Pink
  - Cosmos: Deep blue → Cyan
  - Void: Black → Dark purple
- **Visual Effects:**
  - Glowing edges on cards (box-shadow with primary color)
  - Subtle particle effects in background (optional)
  - Smooth animations/transitions (all 200-300ms)

---

## 📄 User Journey & Pages

### 1. LANDING PAGE (Public - No Auth Required)

**Purpose:** Convert visitors → users by showing value immediately

**Layout:**

- **Hero Section:**
  - Large heading: "Nexus-Geom"
  - Subheading: "Create geometric consciousness art in 3D space"
  - Animated 3D preview (rotating geometry in background)
- **Two Main CTAs:**

  - **"Enter Playground"** (primary button, large, glowing)
    - Goes directly to Geometry Lab (no auth required)
  - **"View Gallery"** (secondary button)
    - Goes to Public Gallery

- **Top Navbar:**
  - Logo/App Name (left)
  - "Playground" | "Gallery" | "Transcendence Chamber" (center)
  - "Login" | "Sign Up" buttons (right)

**Empty State Considerations:** None - this is the entry point

---

### 2. GEOMETRY LAB (Main Feature - Works Without Auth)

**Purpose:** Core creative workspace where users manipulate 3D shapes

**Layout:**

#### Top Navbar (always visible, sticky):

- **Left:** Logo/App Name (clickable, returns to Landing)
- **Center:** Navigation links
  - "Playground" (current page, highlighted)
  - "My Scenes" (grayed out if not logged in, shows lock icon)
  - "Gallery"
  - "Transcendence Chamber"
- **Right:**
  - If logged in: Username dropdown (Profile | Logout)
  - If not logged in: "Login" | "Sign Up" buttons

#### Left Sidebar - Control Panel (300px width):

**Object Settings:**

- Object Type dropdown: Sphere | Icosahedron | Tetrahedron | Octahedron | Box | Torus | TorusKnot
- Animation Style dropdown: Rotate | Float | Spiral | Chaos | Alien | Magnetic
- Scale slider (0.5 - 3.0)

**Material Properties** (collapsible section):

- Metalness slider (0 - 1) with value display
- Emissive Intensity slider (0 - 2)
- Base Color picker (color swatch + hex input)
- Wireframe Intensity slider (0 - 100)

**Hyperframe Controls** (collapsible):

- Hyperframe Color picker
- Hyperframe Line Color picker

**Environment Settings** (collapsible):

- Environment Type dropdown: Nebula | Cosmos | Void | Sunset | Matrix
- Environment Hue slider (0 - 360°) with live preview

**Lighting Controls** (collapsible):

- Ambient Light:
  - Color picker
  - Intensity slider (0 - 2)
- Directional Light:
  - Color picker
  - Intensity slider (0 - 3)
  - Position sliders: X, Y, Z (-20 to 20)

**Camera & Scene:**

- Camera View dropdown: Free | Front | Top | Side | Orbit | Cinematic
- Object Count slider (1 - 10)

#### Bottom of Sidebar:

**Context-Aware Save Button** (see Button States section)

#### Center Area (fills remaining width):

- **Large 3D Canvas** showing geometry in real-time
- Responds instantly to all control changes
- Orbital controls enabled (click-drag to rotate, scroll to zoom)

---

### 3. BUTTON STATES (Context-Aware Save System)

**Critical UX Decision:** Button text and behavior changes based on scene context

#### Scenario A: Fresh Creation (no scene loaded)

- **Button Text:** "Save Scene"
- **Button Style:** Primary (cyan glow)
- **Click Behavior:** Opens Save Scene Modal
- **If Not Logged In:** Shows tooltip "Login to save" → Opens Login Modal

#### Scenario B: Editing Your Own Scene (loaded from "My Scenes")

- **Two Buttons Appear:**
  1. **"Transmute"** (primary, larger)
     - Overwrites the original scene immediately
     - No modal, shows success toast
  2. **"Save As New"** (secondary, smaller)
     - Opens Save Scene Modal
     - Pre-filled with "[Original Name] - Copy"
     - Creates new scene, preserves original

#### Scenario C: Remixing Someone Else's Scene

- **Button Text:** "Save Scene"
- **Button Style:** Primary with "Remix" label somewhere
- **Click Behavior:** Opens Save Scene Modal
- **Note Displayed:** "Remixed from @[original_creator]"
- **Creates:** NEW scene (you can't overwrite someone else's work)

#### Scenario D: Loading Public Scene (Not Logged In)

- **Button Text:** "Save Scene" (grayed out/disabled)
- **Hover:** Tooltip appears: "Login to save scenes"
- **Click:** Opens Login Modal
- **After Login:** Returns to Geometry Lab with scene loaded, button becomes active

---

### 4. SAVE SCENE MODAL

**Triggered By:**

- "Save Scene" button (fresh creation)
- "Save As New" button (editing your own)
- "Save Scene" button (remixing public scene)

**Modal Layout:**

- **Modal Title:** "Save Scene"
- **Scene Name:** Text input (required, placeholder: "My Awesome Scene")
- **Description:** Textarea (optional, placeholder: "Describe your creation...")
- **Public/Private Toggle:**
  - Toggle switch with labels
  - **Public:** "Share with community" (appears in Public Gallery)
  - **Private:** "Only visible to you" (only in My Scenes)
  - Default: Public ON
- **Action Buttons:**
  - "Save" (primary, right)
  - "Cancel" (secondary, left)

**Validation:**

- Scene name: 3-50 characters, required
- Description: 0-300 characters, optional
- Show character count below inputs

**If Not Logged In:**

- Shows centered message: "Please log in to save scenes"
- Two buttons: "Login" | "Sign Up"
- After auth: Returns to this modal with form preserved

**Success State:**

- Modal closes
- Toast notification: "Scene saved successfully!"
- If animation unlocked: Shows unlock toast immediately after

---

### 5. MY SCENES PAGE (Private - Auth Required)

**Purpose:** Personal dashboard showing ALL your saved scenes (public + private)

**Auth Guard:** If not logged in → Redirect to Login Modal → Return here after auth

**Page Layout:**

#### Header:

- **Page Title:** "My Scenes" (large, left)
- **Filter/Sort Controls** (right):
  - Sort dropdown: "Newest" | "Oldest" | "Most Viewed" | "Name (A-Z)"
  - Filter dropdown: "All Scenes" | "Public Only" | "Private Only"
  - Search bar (optional stretch): "Search your scenes..."

#### Scene Grid:

- Responsive grid (4 cols desktop, 2 tablet, 1 mobile)
- **Each Scene Card Contains:**
  - **Thumbnail:** 3D preview screenshot OR placeholder gradient
  - **Public/Private Badge:**
    - Public: Green pill badge "Public" with globe icon
    - Private: Gray pill badge "Private" with lock icon
  - **Scene Name:** Bold, 1-2 lines max
  - **Metadata Row:**
    - Created date ("3 days ago")
    - View count (only for public scenes): "142 views"
  - **Action Buttons:**
    - "Load" (primary) → Opens Geometry Lab with scene loaded
    - "Delete" (destructive, red outline) → Opens Delete Confirmation Modal

**Card Hover State:**

- Lift effect (translateY -4px)
- Glow border appears
- Thumbnail animates (if possible)

**Empty State** (no scenes saved yet):

- Centered illustration/icon (geometric shapes floating)
- Heading: "No scenes yet"
- Subtext: "Create your first scene in the Playground!"
- "Go to Playground" button (primary, large)

**CRUD Operations Available:**

- **CREATE:** Via "Save Scene" in Geometry Lab
- **READ:** View all your scenes here
- **UPDATE:** Load → Make changes → "Transmute" or "Save As New"
- **DELETE:** Click "Delete" → Confirmation → Remove from database

---

### 6. PUBLIC GALLERY (Public - No Auth Required)

**Purpose:** Community showcase showing ONLY public scenes from all users

**Layout:**

#### Header:

- **Page Title:** "Community Gallery"
- **Sort Controls:**
  - Sort dropdown: "Newest" | "Most Viewed" | "Most Liked"
  - Optional: User filter "By @username"

#### Scene Grid:

- Same responsive grid as My Scenes
- **Each Scene Card Contains:**
  - **Thumbnail:** 3D preview
  - **Scene Name:** Bold
  - **Creator Attribution:**
    - "@username" (clickable to filter by that user)
    - Avatar icon (optional)
  - **Engagement Metrics:**
    - View count: "1.2k views"
    - Like count (optional stretch): "47 likes" with heart icon
  - **"View" Button:** Primary button → Opens Scene Viewer

**Differences from My Scenes:**

- ❌ No "Delete" button (can't delete others' work)
- ❌ No "Load" button (use "Remix This" in viewer instead)
- ✅ Shows creator attribution
- ✅ Shows engagement metrics

---

### 7. SCENE VIEWER (Full-Screen Overlay)

**Triggered By:** Clicking "View" on any scene in Public Gallery

**Layout:**

- **Full-screen dark overlay** (backdrop: rgba(0,0,0,0.9))
- **Close Button:** X icon, top-right corner, always visible

#### Main Canvas Area (75% width):

- **3D Canvas** showing the scene with saved settings
- **Orbital Camera Controls** enabled (user can rotate/zoom freely)
- Scene renders exactly as creator saved it

#### Right Sidebar (25% width):

- **Scene Name:** Large heading
- **Creator:**
  - "@username" with avatar
  - "Created 2 weeks ago"
- **Description:** Scrollable text area
- **Engagement Stats:**
  - View count
  - Like button (optional):
    - If logged in: Heart icon (clickable)
    - If not logged in: Grayed out, tooltip "Login to like"
- **Primary CTA:** "Remix This" button (large, cyan glow)
  - Loads scene into Geometry Lab
  - Becomes YOUR scene (fresh creation)
  - Shows "Save Scene" button (Scenario C)
  - Note displays: "Remixed from @[creator]"

**Keyboard Shortcut:** ESC key closes viewer

---

### 8. TRANSCENDENCE CHAMBER (Public - No Auth Required)

**Purpose:** Curated gallery of animated 3D characters (separate from user scenes)

**Naming Decision:** Changed from "Showcase Gallery" to avoid confusion with user gallery

**Layout:**

#### Header:

- **Page Title:** "Transcendence Chamber"
- **Subtitle:** "A curated collection of animated beings"

#### Character Grid:

- Responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- **Each Character Card Contains:**
  - **Animated Preview:**
    - 3D character inside rotating transparent cube
    - Cube has interior lighting (cyan/magenta)
    - Character animates (walk, dance, flip, etc.)
  - **Character Name:** Below card ("Cosmic Cat", "Nebula Dancer")
  - **Animation Type:** Small badge ("Dance" | "Walk" | "Flip")

**Click Behavior:**

- Click anywhere on card → Opens Character Viewer (full-screen)

#### Character Viewer (Full-Screen):

- Similar layout to Scene Viewer
- **Main Canvas:** Larger rotating cube with character
- **Sidebar Info:**
  - Character name
  - Animation type
  - Description (lore/story)
  - No remix feature (these are curated, not remixable)
- **Navigation:**
  - Previous/Next arrows to cycle through characters
  - Close button (X)

**Note:** This is separate from the main geometry system - uses FBX models with Mixamo animations

---

### 9. LOGIN/SIGNUP MODALS

#### Login Modal:

**Modal Layout:**

- **Modal Title:** "Welcome Back"
- **Email Field:** Input, type="email", placeholder="you@example.com"
- **Password Field:** Input, type="password", placeholder="••••••••"
- **"Login" Button:** Primary, full width
- **Forgot Password Link:** Small text below button (optional stretch)
- **Divider:** Horizontal line with "or" text
- **"Don't have an account? Sign up"** Link (opens Signup Modal)
- **Close Button:** X icon, top-right

**Validation:**

- Email: Valid email format required
- Password: Min 6 characters
- Show error messages below fields (red text)

**After Successful Login:**

- Modal closes
- Navbar updates (shows username + profile dropdown)
- If user was trying to save a scene: Returns to Save Scene Modal
- Toast notification: "Welcome back, [username]!"

#### Signup Modal:

**Modal Layout:**

- **Modal Title:** "Create Account"
- **Username Field:** Input, placeholder="johndoe", 3-30 chars
- **Email Field:** Input, type="email"
- **Password Field:** Input, type="password", min 6 chars
  - Show password strength indicator (optional stretch)
- **"Sign Up" Button:** Primary, full width
- **Terms Agreement:** Small checkbox + text: "I agree to Terms of Service"
- **Divider:** "or"
- **"Already have an account? Login"** Link (opens Login Modal)
- **Close Button:** X

**Validation:**

- Username: 3-30 chars, alphanumeric + underscore only
- Email: Valid format, unique check (backend)
- Password: Min 6 chars, show strength meter
- All fields required

**After Successful Signup:**

- Modal closes
- Navbar updates
- If saving a scene: Returns to Save Scene Modal
- Toast: "Welcome to Nexus-Geom, [username]!"

---

### 10. DELETE CONFIRMATION MODAL

**Triggered By:** Clicking "Delete" on any scene card in My Scenes

**Modal Layout:**

- **Warning Icon:** ⚠️ Red triangle with exclamation
- **Modal Title:** "Delete Scene?"
- **Scene Name:** Display the scene name in quotes
- **Warning Message:**
  - "This action cannot be undone."
  - "The scene will be permanently deleted."
- **Action Buttons:**
  - "Cancel" (secondary, left) → Closes modal
  - "Delete" (destructive red, right) → Deletes scene

**After Deletion:**

- Modal closes
- Scene card fades out and removes from grid
- Toast notification: "Scene deleted"

---

### 11. ANIMATION UNLOCK NOTIFICATION

**Gamification System:** Reward users for creating and saving scenes

**Unlock Triggers:**

- 1st scene saved → "Float" animation unlocked
- 3rd scene saved → "Spiral" animation unlocked
- 5th scene saved → "Chaos" animation unlocked
- 10th scene saved → "Alien" animation unlocked

**Toast Design:**

- **Position:** Top-right corner
- **Style:** Glassmorphic card with gradient border
- **Content:**
  - 🎉 Emoji or star icon
  - Heading: "New Animation Unlocked!"
  - Animation name: Large text with glow effect
  - Preview: Small animated icon of the new animation
- **Behavior:**
  - Slides in from right with bounce
  - Auto-dismisses after 5 seconds
  - User can dismiss early with X button
  - Celebratory particle effect (optional)

**Multiple Unlocks:**

- If multiple animations unlock at once, queue them
- Show one at a time with 1-second delay between

---

## 🗂️ Complete Navigation Flow Diagram

```
LANDING PAGE
├── "Enter Playground" → GEOMETRY LAB (no auth required)
├── "View Gallery" → PUBLIC GALLERY
└── "Login"/"Sign Up" → AUTH MODALS

NAVBAR (Always Available):
│
├── Playground → GEOMETRY LAB
│   ├── Fresh creation → "Save Scene" button
│   │   └── Click → SAVE SCENE MODAL
│   ├── Loaded your scene → "Transmute" + "Save As New"
│   │   ├── Transmute → Overwrites immediately
│   │   └── Save As New → SAVE SCENE MODAL
│   └── Loaded public scene → "Save Scene" (remix)
│       └── Click → SAVE SCENE MODAL (creates new)
│
├── My Scenes (auth required) → MY SCENES PAGE
│   ├── View your scenes (public + private)
│   ├── Load → GEOMETRY LAB (shows Transmute/Save As New)
│   └── Delete → DELETE CONFIRMATION MODAL
│
├── Gallery → PUBLIC GALLERY
│   └── View Scene → SCENE VIEWER (full-screen)
│       └── "Remix This" → GEOMETRY LAB (fresh remix)
│
└── Transcendence Chamber → CHARACTER GALLERY
    └── Click Character → CHARACTER VIEWER (full-screen)
```

---

## 🎯 Key Interactions to Demonstrate

**For Designers:** Show these specific interaction states

### 1. Slider Changes = Live Preview

- **Before State:** Object at metalness 0.2 (dull)
- **User Action:** Drags metalness slider to 0.9
- **After State:** Object becomes chrome-like immediately
- **No "Apply" button needed!**

### 2. Scene Card Hover States

- **Default:** Static thumbnail, normal elevation
- **Hover:**
  - Card lifts 4px
  - Glow border appears (cyan)
  - Action buttons fade in from bottom
  - Thumbnail starts subtle animation

### 3. Modal Flow Transitions

- Show full 3-step flow:
  1. User clicks "Save Scene" (not logged in)
  2. Login Modal appears
  3. After login → Save Scene Modal appears
- Indicate modal stacking vs replacing

### 4. Empty → Populated States

- **My Scenes - Empty:**
  - Illustration, "No scenes yet" message
- **My Scenes - Populated:**
  - Grid with 10+ scene cards showing variety

### 5. Error States

- **Login Failed:** Red error text below email field
- **Save Failed:** Toast notification with retry button
- **Network Error:** Full-page overlay with "Connection lost" message
- **Scene Not Found (404):** Sad geometry icon + "Scene not found"

---

## 🎨 Key UI Components to Show in Wireframes

### 1. Responsive Navbar

- Desktop: Full horizontal layout
- Mobile: Hamburger menu (collapsed state + expanded state)
- Show logged-in vs logged-out states

### 2. Modal System

- Login Modal
- Signup Modal
- Save Scene Modal
- Delete Confirmation Modal
- **Show backdrop overlay** behind modals

### 3. 3D Canvas Areas

- Geometry Lab (main workspace with controls)
- Scene Viewer (full-screen with sidebar)
- Character Viewer (full-screen)
- Scene card thumbnails (small previews)

### 4. Control Panel (Geometry Lab)

- Show collapsible sections (collapsed + expanded)
- Label all sliders with value displays
- Color pickers with hex input
- Dropdown menus with current selection

### 5. Context-Aware Buttons

- "Save Scene" (default state)
- "Transmute" + "Save As New" (side-by-side)
- "Remix This" (in viewers)
- Show disabled states with tooltips

### 6. Card Grids

- My Scenes cards (with Load + Delete buttons)
- Public Gallery cards (with View button + creator info)
- Character cards (animated previews)

### 7. Public/Private Indicators

- Badge design for My Scenes cards
- Toggle switch design for Save Scene modal

### 8. Empty States

- My Scenes empty (illustration + CTA)
- Gallery empty (shouldn't happen, but include)

### 9. Loading States

- Spinner for scene loading
- Skeleton cards while fetching gallery
- Progress indicators for save/delete operations

### 10. Toast Notifications

- Success toast (green accent)
- Error toast (red accent)
- Animation unlock toast (special gradient)

---

## 📊 Public vs Private Scene Behavior

| Scene Type  | In "My Scenes" | In "Public Gallery" | Who Can View | Can Be Remixed |
| ----------- | -------------- | ------------------- | ------------ | -------------- |
| **Public**  | ✅ Yes         | ✅ Yes              | Everyone     | ✅ Yes         |
| **Private** | ✅ Yes         | ❌ No               | Only you     | ❌ No          |

**Think of it like Instagram:**

- **Public** = Instagram post (visible on your profile + explore page)
- **Private** = Draft (only you can see it)

---

## 🔧 Edge Cases & Error Handling

**For Designers:** Include these scenarios

### 1. Offline/Network Error

- **Trigger:** User loses internet connection
- **UI Response:**
  - Full-page overlay with cloud icon
  - Message: "Connection lost. Retrying..."
  - Retry button

### 2. Scene Load Failure

- **Trigger:** Scene ID not found or deleted
- **UI Response:**
  - Modal with error icon
  - Message: "Scene not found. It may have been deleted."
  - "Return to Gallery" button

### 3. Save Conflict

- **Trigger:** Two devices editing same scene simultaneously
- **UI Response:**
  - Warning modal: "This scene was updated elsewhere"
  - Options: "Overwrite" | "Save As New" | "Cancel"

### 4. Maximum Scenes Reached

- **Trigger:** User has 100+ scenes (optional limit)
- **UI Response:**
  - Error toast: "Maximum scenes reached. Delete old scenes to save new ones."
  - Link to My Scenes page

### 5. Invalid Scene Data

- **Trigger:** Corrupted scene config in database
- **UI Response:**
  - Scene card shows "Error" badge
  - Load button disabled
  - Delete button still available

---

## 📋 Wireframe Checklist

Before sending to designers, ensure wireframes include:

**Screens to Create:**

- [ ] Landing Page (hero + CTAs)
- [ ] Geometry Lab (desktop + mobile)
- [ ] My Scenes Gallery (empty + populated states)
- [ ] Public Gallery
- [ ] Scene Viewer (full-screen overlay)
- [ ] Transcendence Chamber (character grid)
- [ ] Character Viewer (full-screen)
- [ ] Login Modal
- [ ] Signup Modal
- [ ] Save Scene Modal
- [ ] Delete Confirmation Modal

**Annotations to Include:**

- [ ] User flow arrows between screens
- [ ] CRUD operation labels (Create, Read, Update, Delete)
- [ ] Auth requirements marked (lock icons for protected pages)
- [ ] Context-aware button states documented
- [ ] Modal overlays shown on top of base pages
- [ ] Hover states illustrated
- [ ] Loading states included
- [ ] Error states included
- [ ] Empty states included
- [ ] Responsive breakpoints indicated

**Special Notes:**

- [ ] Show slider → live preview connection
- [ ] Indicate which elements are clickable (cursor icons)
- [ ] Mark collapsible sections
- [ ] Show character count limits on inputs
- [ ] Indicate toast notification positions

---

## 🎨 Design Assets Needed

**Icons:**

- 🔒 Lock (for protected pages)
- 🌍 Globe (for public scenes)
- 👁️ Eye (for view count)
- ❤️ Heart (for likes)
- ⚙️ Settings/controls
- ❌ Close/delete
- ✏️ Edit/pencil
- 🎉 Celebration (for unlocks)
- ⚠️ Warning (for delete confirmation)
- 🔄 Loading spinner

**Illustrations:**

- Empty state for My Scenes (geometric shapes floating)
- 404/Scene not found (sad geometry)
- Network error (disconnected icon)

**3D Assets (for mockups):**

- Sample geometry renders (sphere, icosahedron)
- Sample character inside cube
- Transparent cube with interior lighting

---

## 🚀 Development Priority Order

**Phase 1 - MVP (Weeks 1-2):**

1. Landing Page
2. Geometry Lab (with all controls working)
3. Login/Signup Modals
4. Save Scene Modal
5. My Scenes Page (basic grid)

**Phase 2 - Core Features (Week 2):** 6. Public Gallery 7. Scene Viewer 8. Context-aware save buttons 9. Public/Private toggle

**Phase 3 - Polish (Week 3):** 10. Transcendence Chamber 11. Animation unlock toasts 12. Empty states 13. Error handling 14. Loading states 15. Responsive breakpoints

---

## 📝 Notes for Designer

**Key Principles:**

1. **Dark Mode First** - All designs should prioritize dark theme
2. **Glassmorphism** - Use frosted glass effect for cards and modals
3. **Real-Time Feedback** - Every control change should feel immediate
4. **Clear Hierarchy** - Primary CTAs should be obvious (cyan glow)
5. **Consistent Spacing** - Use 8px grid system
6. **Accessibility** - Ensure contrast ratios meet WCAG AA standards

**Performance Considerations:**

- 3D canvas should be 60fps at all times
- Thumbnails can be lower quality for faster loading
- Lazy load gallery images as user scrolls

**Browser Support:**

- Chrome (primary)
- Firefox, Safari (secondary)
- No IE11 support needed (WebGL required)

---

**Ready for wireframing!** This spec provides complete context for designers to create high-fidelity wireframes. 🎨✨
