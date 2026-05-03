---
name: Serene Curation
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style
The design system is built upon a foundation of clarity and intentionality, catering to a sophisticated user base that values information organization as a form of mental clarity. The aesthetic is "Elevated Minimalist," blending the structured precision of Swiss design with the ethereal qualities of Glassmorphism.

The UI evokes a sense of calm through generous whitespace and a restricted color palette, ensuring the user's bookmarks remain the focal point. High-end SaaS characteristics are achieved through smooth micro-interactions, subtle depth layers, and a focus on "Quiet Luxury"—where the interface feels premium not through loudness, but through perfect alignment and refined material properties.

## Colors
The palette is intentionally monochromatic to maintain a professional atmosphere, using "Pure White" for primary backgrounds and "Deep Black" (#0F172A) for high-contrast text and primary iconography. 

Subtle greys (Slate 50 to Slate 300) are utilized for secondary borders and background fills to create soft dimensionality. The primary action color is a sophisticated gradient transition from a soft sky blue to a deep indigo, reserved strictly for high-value interactions like "Add Bookmark" or "Save." This ensures that interactive elements stand out against the neutral canvas without overwhelming the visual field.

## Typography
Inter is the sole typeface for this design system, chosen for its exceptional legibility and utilitarian beauty. The hierarchy relies on substantial weight contrasts—using "Bold" and "Semi-Bold" for headers to anchor the page, while "Regular" is used for body copy to maintain airiness. Tight letter-spacing is applied to larger headings to provide a more editorial, high-end feel. Use "Label-Caps" for metadata like tags or timestamps to create a distinct visual layer from the primary content.

## Layout & Spacing
The layout follows a strict 12-column fixed grid for main dashboard views, ensuring content feels grounded and organized. A "Comfortable" spacing rhythm is prioritized, utilizing a 4px baseline grid. 

Generous margins (48px+) are used between major sections to prevent information density fatigue. For the bookmark feed, a masonry-inspired dynamic grid is recommended, but with fixed horizontal gutters to maintain the system's structured professional feel. Horizontal padding within cards and inputs should be consistently larger than vertical padding (e.g., 2:1 ratio) to emphasize the flow of text.

## Elevation & Depth
Depth is articulated through three distinct layers:
1. **The Canvas (Base):** Pure White (#FFFFFF), flat and static.
2. **The Surface (Mid-layer):** Utilizes Glassmorphism. Floating panels, sidebars, and modals feature a backdrop-blur (20px to 40px) and a semi-transparent white fill (70-80% opacity). A 1px white border with 10% opacity is used to define edges.
3. **The Focus (Top-layer):** Elements being interacted with use "Ambient Shadows"—soft, extremely diffused shadows (e.g., `0 20px 50px rgba(0,0,0,0.05)`). 

Transitions between these layers must be eased using a standard `cubic-bezier(0.4, 0, 0.2, 1)` curve for a high-end, responsive feel.

## Shapes
The shape language is "Softly Geometric." A consistent `0.5rem` (8px) radius is applied to standard UI elements like input fields and buttons to balance approachability with professional rigor. 

For larger containers like bookmark cards or modals, use `rounded-xl` (1.5rem / 24px) to emphasize the "Glass" effect and create a containerized, object-like feel. Icons should follow a consistent 2px stroke weight with slightly rounded terminals to match the typography.

## Components
- **Primary Buttons:** Features the blue-to-indigo gradient with white text. On hover, the gradient should subtly shift in intensity.
- **Glass Cards:** The core component for bookmarks. Includes a 1px soft grey border, a subtle inner glow, and uses `backdrop-filter: blur()`.
- **Search Input:** A large, centered element with a "Soft" roundedness. Use a glass effect instead of a solid border to signify it as a global tool.
- **Tag Chips:** Minimalist, using a light grey background (`#F1F5F9`) and `body-sm` typography. No borders; use 4px roundedness.
- **Navigation Sidebar:** High-contrast text on a blurred glass surface. Active states are indicated by a 2px vertical indigo bar on the left edge.
- **Empty States:** Use thin-line illustrations and `body-lg` text in a medium grey to maintain the "calm" brand personality.
- **Interactive States:** All hoverable elements should exhibit a subtle "lift" (slight Y-axis shift and increased shadow diffusion) to provide tactile feedback.