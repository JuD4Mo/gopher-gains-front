---
name: Gopher Gains
description: Gym workout tracking tool — robusta, amena, intuitiva
colors:
  primary: "#E87D2F"
  primary-dark: "#D06B20"
  primary-light: "#F5A623"
  teal: "#2E7D8A"
  teal-dark: "#236570"
  sidebar-bg: "#1C1F26"
  sidebar-hover: "#2A2D35"
  sidebar-muted: "#6B7280"
  surface: "#F5F2ED"
  surface-light: "#FAF8F5"
  card: "#FFFFFF"
  text: "#1C1F26"
  text-muted: "#8E8E93"
  border: "#E5E0D8"
  success: "#3A9D5E"
  danger: "#D1453B"
typography:
  display:
    fontFamily: '"DM Sans", system-ui, sans-serif'
    fontWeight: 700
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontWeight: 400
  mono:
    fontFamily: '"JetBrains Mono", ui-monospace, monospace'
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  sidebar: "220px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
  input-focus:
    backgroundColor: "{colors.card}"
  nav-item:
    textColor: "{colors.sidebar-muted}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  nav-item-hover:
    backgroundColor: "{colors.sidebar-hover}"
    textColor: "#FFFFFF"
  nav-item-active:
    backgroundColor: "{colors.sidebar-hover}"
    textColor: "#FFFFFF"
---

# Design System: Gopher Gains

## 1. Overview

**Creative North Star: "The Iron Journal"**

Gopher Gains looks and feels like a well-worn training notebook — grounded in the gym's physicality (chalk dust, iron, blocky pencil marks) but executed with the precision of a modern tool. The interface is warm without being soft, structured without feeling rigid. Its primary job is to disappear: users log sets between exercises, and the UI should demand less attention than the barbell does.

The visual system is *restrained by default* — a warm chalk-white surface, one burnt orange accent used sparingly (on primary actions, current selection, and nothing decorative), and a dark sidebar that anchors navigation like a clip-on board. Cards carry the lightest possible shadow, just enough to separate surfaces without creating a "layered dashboard" feel. Text hierarchy is flat: one family for display (DM Sans, bold, confident), one for everything else (Inter, efficient, legible). There are no gradients, no decorative illustrations, no gamification flourishes.

The system explicitly rejects: generic SaaS grey/blue dashboards, dark "beast mode" gym aesthetics, glassmorphism, decorative motion, and card-heavy grids where every card looks identical. If a component looks like it belongs in a 2014 admin panel (too much shadow, too much border treatment), it's wrong.

### Key Characteristics:
- **Warm chalk palette** — surfaces lean warm (creamy off-white, not cool grey)
- **One accent, one purpose** — burnt orange on actions and selection only
- **Dark sidebar as anchor** — the only dark surface, frames the tool
- **Minimum shadow, maximum structure** — depth from borders and color, not layers of shadow
- **Two fonts, not three roles** — display type is a distinct weight, not a distinct voice
- **Tactile, confident components** — buttons have weight, inputs have clear boundaries, feedback is immediate

## 2. Colors

The palette draws from the gym's material world: warm chalk surfaces, iron-grey text, a burnt-orange accent that reads as "active" without screaming.

### Primary
- **Burnt Orange** (#E87D2F): The single accent. Used for primary buttons, active navigation indicators, the sidebar logo accent, stat card icons, status badge for "in progress" states. Never applied as background tint or decorative gradient. The `accent-glow` shadow (`0 0 8px rgba(232, 125, 47, 0.3)`) appears only on the active nav item — a subtle, purposeful aura.
- **Deep Burnt Orange** (#D06B20): Hover and active states of primary buttons. Dark enough to create a clear press-down effect.
- **Warm Orange** (#F5A623): Lighter variant, used sparingly as a secondary accent tone.

### Secondary
- **Teal** (#2E7D8A): Secondary accent color. Used for routine type badges (default routines), one of the quick-action icon backgrounds on the dashboard. Purposefully cooler than the primary to provide contrast without competing.
- **Deep Teal** (#236570): Hover state for teal elements.

### Neutral
- **Dark Iron** (#1C1F26): Primary text color AND sidebar background. The darkest tone in the system, reused between text and the nav surface for intentional visual weight. Never used as a full-page background.
- **Warm Chalk** (#F5F2ED): Main page background. A warm off-white that distinguishes the tool from generic grey dashboards. It's the canvas — shouldn't compete with content.
- **Light Chalk** (#FAF8F5): Lighter variant, used for input default backgrounds and subtle hover states on rows and buttons.
- **Pure White** (#FFFFFF): Card surfaces and focused input backgrounds. Reserved for containers that need the highest contrast against the chalk canvas.
- **Silver Mute** (#8E8E93): Secondary text, placeholder text, sidebar inactive icons/text. Sufficient contrast on both warm chalk and dark iron backgrounds.
- **Warm Border** (#E5E0D8): All borders and dividers. Slightly warm tint (not neutral grey) to stay cohesive with the chalk palette.
- **Charcoal Hover** (#2A2D35): Sidebar item hover and active background. One step lighter than the sidebar background itself.
- **Slate Mute** (#6B7280): Sidebar navigation text/icons in their default (inactive) state.

### Semantic
- **Forest Green** (#3A9D5E): Success states — finished session badges, positive indicators.
- **Alert Red** (#D1453B): Danger — delete buttons, error messages, destructive actions.

### Named Rules

**The Single Accent Rule.** Burnt orange (#E87D2F) must appear on ≤10% of any given screen. It is used for primary actions, active selection, and nothing else. If orange appears without a functional reason, remove it. The teal secondary accent exists to handle cases where a second highlight color is genuinely needed (badge differentiation, multi-color dashboard stats) without diluting the primary accent.

## 3. Typography

**Display Font:** DM Sans (with system-ui, sans-serif fallback)
**Body Font:** Inter (with ui-sans-serif, system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** A two-family system where DM Sans provides confident, slightly geometric display weight and Inter handles all UI duty with efficient legibility. The pairing says "serious tool" without saying "corporate software." DM Sans is reserved exclusively for headings, the logo, and stat count numbers — never for body copy, labels, or buttons.

### Hierarchy
- **Display** (DM Sans Bold 700, 1.25rem/1.5rem): Page-level headings ("Exercises", "Routines", "Dashboard"). Used at `text-xl` (1.25rem) for section pages and `text-2xl` (1.5rem) for the dashboard stat numbers. **Never** used at sizes smaller than 1rem.
- **Headline** (Inter Semibold 600, 1rem): Card section titles, modal headers, empty-state titles. The `font-display` class is NOT used here — at this size, DM Sans is too wide; Inter Semibold provides enough weight without increasing horizontal space.
- **Title** (Inter Medium 500, 0.875rem): Table row content, list item labels, form labels. The default for most readable text.
- **Body** (Inter Regular 400, 0.875rem): Descriptions, table cell values, paragraph text. Max line length 65–75ch for prose content (empty state messages, Getting Started card). Data tables may run denser.
- **Label** (Inter Semibold 600, 0.75rem, 0.05em letter-spacing, uppercase): Table column headers, stat card labels. The only uppercase role in the system.

### Named Rules

**The Display-Is-A-Weight Rule.** DM Sans is not a different "voice" — it's a different weight of the same tool. If you need to distinguish a heading at `text-base` or smaller, reach for Inter Semibold instead. DM Sans below 1rem looks unintentionally wide and breaks the system's visual density.

## 4. Elevation

The system uses minimal shadows to separate surfaces, preferring tonal layering (warm chalk surface → white card) as the primary depth cue. Shadows exist only at rest (cards, modals) and as a response to state (hover, active nav). There is no blanket drop-shadow on the sidebar or page chrome.

The default card shadow (`0 1px 3px rgba(28,31,38,0.06), 0 1px 2px rgba(28,31,38,0.04)`) is deliberately subtle — barely perceptible. Its job is to keep the card from floating, not to advertise its separation. The hover shadow (`0 4px 12px rgba(28,31,38,0.08)`) is a soft lift, not a dramatic float.

### Shadow Vocabulary
- **Card Rest** (`0 1px 3px rgba(28,31,38,0.06), 0 1px 2px rgba(28,31,38,0.04)`): Default card containers. Minimal, almost flat.
- **Card Hover** (`0 4px 12px rgba(28,31,38,0.08)`): Hovered/lifted state on interactive cards (dashboard stat cards). Not used on non-interactive cards.
- **Accent Glow** (`0 0 8px rgba(232,125,47,0.3)`): Active sidebar navigation item. A warm glow that reads as "this is where you are."
- **Modal Overlay** (`bg-black/40 backdrop-blur-sm`): The confirm dialog overlay uses a semi-transparent dark backdrop with subtle blur, not a box-shadow. The dialog surface itself uses `shadow-xl`.

## 5. Components

### Buttons

Tactile and confident — buttons have clear boundaries, distinct hover states, and purposeful visual weight. All buttons share a base shape (`rounded-lg` / 8px radius) and a 150ms transition for hover/active/focus.

- **Shape:** 8px border radius (`rounded-lg`), inline-flex with centered content and 8px gap between icon and text.
- **Primary** (`bg-accent text-white`): Filled burnt orange with `shadow-sm`. Used for the single primary action per page (New Exercise, Create Routine, Save). Padding: 8px 16px (`px-4 py-2`), 14px font.
- **Primary Hover / Active:** Transitions to `bg-accent-dark` (#D06B20). Active state uses the same color — no separate press state.
- **Primary Focus:** Uses the global focus ring: 2px solid `accent/30` with 2px offset from the surface color.
- **Primary Disabled:** 50% opacity, `cursor-not-allowed`, no hover effect.
- **Secondary** (`border border-border text-text`): Outlined button for Cancel and secondary actions. Hover fills with `bg-surface-light`.
- **Ghost** (`text-text-muted hover:text-text`): No border, minimal footprint. Used for table row actions (edit, view), Back links. Hover adds `bg-surface-light`.
- **Danger** (`bg-danger text-white`): For destructive actions (confirm-dialog delete). Hover deepens to red-700.

### Chips / Badges

- **Muscle Group Badges:** `rounded-full` (pill shape), 10px 8px padding, `text-xs font-medium`, capitalized. Each muscle group gets its own tinted background:
  - Chest: `bg-red-50 text-red-600`
  - Back: `bg-purple-50 text-purple-600`
  - Legs: `bg-blue-50 text-blue-600`
  - Arms: `bg-orange-50 text-orange-600`
  - Delts: `bg-cyan-50 text-cyan-600`
  - Abs: `bg-emerald-50 text-emerald-600`
- **Status Badges:** Pill shape with a 6px colored dot indicator. Background at 10% opacity of the semantic color (success or accent), text at 100%. No border.
- **Routine Type Badges:** Same pill shape, semitransparent backgrounds — teal/10 for "default", accent/10 for "customized".

### Cards / Containers

- **Corner Style:** 12px radius (`rounded-xl`).
- **Background:** Pure white (`#FFFFFF`).
- **Border:** 1px solid `border` (#E5E0D8).
- **Shadow:** The "Card Rest" shadow — barely perceptible, just enough to lift off the chalk surface.
- **Internal Padding:** 20px (`p-5`) for data content (table cards), 24px (`p-6`) for form layouts.
- **Dashboard Stat Cards:** The entire card is wrapped in an `<a>` tag. On hover, the icon background intensifies (`accent/10` → `accent/20`) and the card shadow shifts to "Card Hover". The link is `block` so the entire surface is clickable.

### Inputs / Fields

- **Default Style:** 1px solid `border`, 8px radius, warm chalk background (`bg-surface-light`), 14px text. Padding: 14px horizontal (`px-3.5`), 10px vertical (`py-2.5`). For search inputs: 12px horizontal padding with 36px left padding to accommodate the search icon.
- **Focus:** Background shifts to white (`bg-card`), border gains a warm tint (`border-accent/30`), and a 2px ring appears at 10% accent opacity (`ring-2 ring-accent/10`). The transition animates all three properties over 150ms.
- **Disabled:** 50% opacity, `cursor-not-allowed`. No focus ring.
- **Select Dropdowns:** Same styling as text inputs. The native `<select>` arrow is preserved (no custom chevron replacement).
- **Textareas:** Same as inputs, with `resize-none` applied by default (resize only where explicitly enabled). Consistent padding and border treatment.
- **Labels:** 14px Inter Medium 500, `mb-1.5` (6px) spacing below. Block-level, always above the input (never floating or inset).

### Tables / Lists

- **Container:** Overflow-x-auto wrapper (`-mx-5` to align with card padding), full width.
- **Headers:** 12px Inter Semibold 600, uppercase, 0.05em tracking, `text-text-muted`. Bottom border only (`border-b border-border`). Padding: 12px 20px.
- **Rows:** 14px text, 50% opacity bottom border (`border-border/50`), hover background of `bg-surface-light`. Padding matches headers.
- **Action Cells:** Right-aligned, contain an icon-only ghost button.
- **Empty state:** Fallback shown when list has zero items. Centered layout with a border-colored icon, headline, and muted description (max-width ~35rem).

### Navigation (Sidebar)

- **Style:** Fixed left, full viewport height, 220px width. Background: `bg-sidebar` (#1C1F26). No shadow — it's the structural anchor, not a floating panel.
- **Logo Area:** 80px tall, gradient overlay on bottom edge (`from-sidebar to-accent/20`). Logo is inline: "Gopher" in bold white DM Sans, "Gains" in light-weight burnt orange. Icon is three stacked dumbbell plates rendered as SVG.
- **Nav Items:** 14px Inter Medium 500, `text-sidebar-muted` at rest, `text-white` on hover/active. 12px horizontal padding, 10px vertical. 8px border radius. **Default:** no background. **Hover:** `bg-sidebar-hover`, white text. **Active:** `bg-sidebar-hover`, white text, 2px solid burnt orange left border, `shadow-accent-glow`.
- **Transition:** 150ms on color, background, and border properties.
- **Footer:** Version label in `text-sidebar-muted/60` at 12px, separated by a `white/5` top border.

### Loading Spinner

- Centered in its container with 64px vertical padding. 8px diameter ring, 2px thick. The ring is `border-border` except the top segment, which is `border-t-accent` for a warm-accent sweep. Uses Tailwind's `animate-spin` for full rotation.
- **Large variant** (`size="lg"`): 48px diameter, 3px thick.

### Error Message

- Background: `danger` at 5% opacity. Border: `danger` at 20% opacity. Text: full `danger` (#D1453B). 16px 12px padding, 8px radius, 14px font.

### Confirm Dialog

- **Backdrop:** Fixed full-screen overlay, `bg-black/40` with `backdrop-blur-sm`.
- **Dialog Surface:** White card, 12px radius, 1px border, `shadow-xl`, 480px max-width, 24px padding.
- **Headline:** Inter Semibold 600 at 16px (`text-base`), 8px bottom margin.
- **Message:** 14px `text-text-muted`, 24px bottom margin.
- **Actions:** Right-aligned flex row with 12px gap. Cancel is secondary (outlined), Confirm is danger (filled red).

### Pagination

- **Layout:** Flex row, justified between "Page X of Y · Z total" left label and page number buttons on the right. 16px top padding.
- **Page Label:** 14px `text-text-muted`.
- **Page Buttons:** 36px minimum width, 14px font, 8px radius. **Current:** filled `bg-accent text-white`. **Other:** `border border-border`, `text-text`, hover adds `bg-surface-light`. **Prev/Next:** ghost style with disabled state at 40% opacity.
- **Ellipsis:** Represented as `text-text-muted` with 8px horizontal padding.

## 6. Do's and Don'ts

### Do
- **Do** use burnt orange (#E87D2F) for the primary action on every page — exactly one per view.
- **Do** use `rounded-lg` (8px) for all interactive elements (buttons, inputs, pagination buttons) to create a consistent, tactile feel.
- **Do** keep the warm chalk background (`bg-surface`, #F5F2ED) as the main canvas — it's the system's defining visual trait.
- **Do** use tonal separation (warm chalk → white card) as the primary depth cue; shadows are secondary.
- **Do** use DM Sans for page headings and stat numbers only — never for body text or labels.
- **Do** show skeleton loading states for content (via the loading spinner pattern) rather than inline spinners.
- **Do** make every interactive element feel tactile with clear hover, focus, and active states.
- **Do** use `text-xs uppercase tracking-wider` for table headers — this is the system's only uppercase role.

### Don't
- **Don't** use burnt orange as a decorative background tint or gradient — it's reserved for actions and selection.
- **Don't** use dark "beast mode" gym aesthetics — no heavy gradients, neon accents, or aggressive typography.
- **Don't** use glassmorphism, heavy shadows, or layered transparency effects. The system is grounded in physical materials.
- **Don't** add decorative motion — transitions must convey state (hover, focus, loading, reveal) and nothing else.
- **Don't** use more than one primary action button per view. If you need multiple calls to action, demote the rest to secondary.
- **Don't** create card-heavy grids where every card looks identical — differentiate through content hierarchy, not card decoration.
- **Don't** use modals as a first resort — exhaust inline and progressive disclosure patterns before reaching for a dialog.
- **Don't** use display fonts (DM Sans) in UI labels, buttons, or data — at sizes below 1rem, it reads as unintentionally wide.
- **Don't** use generic SaaS blue/grey palettes — the warm chalk and burnt orange define the product's identity.
- **Don't** invent custom form controls or scrollbars — native affordances keep the interface predictable and fast.
