```markdown
# Design System: High-End Editorial Guidelines

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

Unlike generic tech platforms that rely on rigid grids and heavy borders, this system treats the interface as a premium editorial canvas. It combines the precision of high-tech AI reporting with the warmth of French intellectual heritage. We break the "template" look by using **intentional asymmetry**, where large display type creates a focal point that pulls the eye through the layout, and **tonal layering** replaces structural lines to create a sense of architectural depth. This is not just an interface; it is a curated experience that feels "smart, accessible, and trustworthy."

---

## 2. Colors & Surface Logic
The palette is rooted in a sophisticated interplay of `primary` (a deep, refined indigo-slate) and a series of soft, warm neutrals.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning or containment. 
Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section should sit directly on a `surface` background. The change in hex value is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine vellum.
- **Base Layer:** `surface` (#f8fafa)
- **Secondary Sections:** `surface-container-low` (#f2f4f4)
- **Primary Content Cards:** `surface-container-lowest` (#ffffff)
- **Call-to-Action / Floating Elements:** `primary` (#26445d)

### The "Glass & Gradient" Rule
To elevate the experience beyond flat design:
- **Glassmorphism:** Use semi-transparent surface colors (e.g., `surface` at 80% opacity) with a `backdrop-blur` of 12px-20px for navigation bars or floating headers.
- **Signature Textures:** For main CTAs or Hero backgrounds, use a subtle linear gradient transitioning from `primary` (#26445d) to `primary-container` (#3e5c76). This provides a "soul" and depth that flat hex codes cannot achieve.

---

## 3. Typography: The Editorial Voice
We use a high-contrast pairing to distinguish between "Technical Insight" and "Human Narrative."

*   **Display & Headlines (Manrope):** A sharp, modern sans-serif. Use `display-lg` to `headline-sm` for authoritative, news-breaking moments. The tight tracking and geometric builds of Manrope signal modern technology.
*   **Body & Titles (Newsreader):** A highly readable, premium serif. This is the "warmth" of the system. `body-lg` and `title-md` provide a literary, trustworthy feel that invites long-form reading.

**Hierarchy Tip:** Always lead with a large `display-md` headline in `on_surface`, followed by a `title-lg` sub-header in `secondary` (#516169) to create a sophisticated, multi-tonal reading experience.

---

## 4. Elevation & Depth
In this system, depth is a feeling, not a decoration.

*   **The Layering Principle:** Achieve lift by "stacking" tiers. Place a `surface-container-lowest` card (Pure White) on a `surface-container-low` background. The subtle 2-3% shift in brightness creates a soft, natural lift.
*   **Ambient Shadows:** When a card must "float" (e.g., a newsletter sign-up modal), use an extra-diffused shadow:
    *   *Blur:* 40px-60px.
    *   *Opacity:* 4%-6%.
    *   *Color:* Use a tinted version of `on_surface` (#191c1d) rather than pure black to mimic natural ambient light.
*   **The "Ghost Border" Fallback:** If a container lacks contrast against a specific background, use a "Ghost Border": `outline-variant` (#c3c7cd) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components & Layout Elements

### Cards & Containers
- **Corner Radius:** Use `xl` (1.5rem / 24px) for main content cards and `lg` (1rem / 16px) for inner nested elements.
- **Separation:** **Forbid the use of divider lines.** Use vertical white space (Spacing scale `8` or `10`) to separate newsletter sections.

### Buttons (The "Jewel" Elements)
- **Primary:** Background `primary`, text `on_primary`. Use a slight 4px vertical offset shadow to make it feel tactile.
- **Secondary:** Background `secondary_container`, text `on_secondary_container`. No shadow.
- **Tertiary:** Ghost style. `title-sm` typography with a `primary` color and a subtle underline that appears on hover.

### Inputs & Fields
- **Styling:** Use `surface_container_highest` for the input background with a `md` (0.75rem) radius. 
- **Active State:** Change background to `surface_container_lowest` and apply a 1px "Ghost Border" of `primary` at 30% opacity.

### Signature Component: The "Editorial Pull-Quote"
A custom component for the newsletter. Use `newsreader` in `title-lg`, italicized, with a thick 4px vertical bar on the left using the `primary_fixed` (#cce5ff) color. No background card—let the typography breathe on the `surface`.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Whitespace:** Use the spacing scale `16` (5.5rem) or `20` (7rem) between major editorial sections.
*   **Mix Type:** Use Manrope for data points and Newsreader for the "Why it matters" analysis.
*   **Tonal Overlap:** Let images or illustrations slightly overlap the boundary of a `surface-container` to break the "boxed-in" feel.

### Don’t:
*   **No Pure Black:** Never use #000000. Use `on_background` (#191c1d) for the deepest tones.
*   **No Heavy Shadows:** If the shadow is immediately obvious, it is too dark. It should be felt, not seen.
*   **No Grid-Lock:** Avoid perfectly symmetrical 3-column grids. Try a 2/3 and 1/3 split to create a more dynamic, editorial rhythm.
*   **No "Default" Borders:** Avoid the `outline` token at full strength. It kills the premium, "soft" aesthetic of the system.