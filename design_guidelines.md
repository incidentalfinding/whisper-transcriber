# Design Guidelines: Audio Transcription Tool

## Design Approach
**Selected Approach:** Design System (Utility-Focused)
**System:** Material Design with modern refinements
**Justification:** This is a single-purpose utility tool requiring clarity, reliability, and intuitive interaction patterns. Users need immediate understanding of recording state and quick access to results.

## Core Design Principles
1. **Clarity First:** Every element communicates its function immediately
2. **State Communication:** Recording status must be unmistakably clear
3. **Efficiency:** Minimize clicks between record → transcribe → copy
4. **Touch-Friendly:** All interactive elements sized for easy activation

## Layout System

**Container Structure:**
- Single-page centered layout with max-width of 600px
- Vertical stack with generous spacing using Tailwind units: 8, 12, 16, 24
- Content padding: p-8 on desktop, p-6 on mobile
- Centered alignment for all primary elements

**Vertical Rhythm:**
- Section spacing: space-y-8 between major components
- Component internal spacing: space-y-4 for related elements
- Consistent use of mb-4, mb-8 for hierarchy

## Typography

**Font Family:**
- Primary: Inter (via Google Fonts)
- Fallback: system-ui, -apple-system, sans-serif

**Hierarchy:**
- Page title: text-3xl, font-semibold
- Status messages: text-lg, font-medium
- Transcription text: text-base, leading-relaxed
- Helper text: text-sm, text-gray-600

## Component Library

### 1. Microphone Button (Primary Interaction)
**Specifications:**
- Size: 160px × 160px circular button
- Two states clearly differentiated:
  - **Idle State:** Static microphone icon, subtle shadow
  - **Recording State:** Pulsing red indicator, animated glow effect
- Icon size: 64px within button
- Drop shadow: medium depth for tactile feel

### 2. Status Indicator
**Position:** Directly below microphone button (mb-4)
**Content:** 
- Idle: "Click to start recording"
- Recording: "Recording... Click to stop" with animated ellipsis
- Processing: "Transcribing audio..."
- Typography: text-lg, font-medium, centered

### 3. Transcription Display Box
**Layout:**
- Full-width within container
- Minimum height: 200px
- Maximum height: 400px with scroll
- Border: subtle 1px border
- Rounded corners: rounded-lg
- Padding: p-6
- Background: slightly off-white for definition
- Typography: text-base, leading-relaxed, font-normal
- Empty state: Gray placeholder text "Your transcription will appear here..."

### 4. Copy Button
**Position:** Aligned to the right, mt-4 from transcription box
**Specifications:**
- Icon + text button: "Copy to Clipboard"
- Disabled state when no transcription exists
- Success feedback: Brief text change to "Copied!" with checkmark icon
- Padding: px-6 py-3
- Rounded: rounded-md

### 5. Error Display (when needed)
**Position:** Below microphone button
**Style:** 
- Light red background with red text
- Padding: p-4
- Rounded: rounded-md
- Icon: Alert/warning icon preceding text

## Visual Feedback States

### Recording Animation
- Pulsing red circle around microphone button
- Scale animation: subtle breathing effect (98% to 102%)
- Duration: 1.5s infinite
- Red accent color for recording indicator

### Processing State
- Subtle spinner or dots animation
- Position: Next to status text
- Indicates backend processing

### Success State
- Brief green highlight on transcription box when text appears
- Fade-in animation for transcription text (duration: 300ms)

## Spacing Architecture
**Tailwind Units Used:** 2, 4, 6, 8, 12, 16, 24
- Button to status: mb-4
- Status to transcription box: mb-8
- Transcription to copy button: mt-4
- Page padding: p-8 (desktop), p-6 (mobile)

## Icon Library
**Source:** Heroicons (via CDN)
**Icons Needed:**
- Microphone (outline and solid variants)
- Stop circle (for recording state)
- Clipboard (copy button)
- Check mark (copy success)
- Exclamation circle (errors)

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support (Space/Enter to record)
- Focus visible states on all buttons
- Semantic HTML structure
- Screen reader announcements for state changes

## Responsive Behavior
**Mobile (< 640px):**
- Microphone button: 140px × 140px
- Container padding: p-6
- Typography scales down one step

**Desktop (≥ 640px):**
- Microphone button: 160px × 160px
- Container max-width: 600px
- Full typography scale

## Images
**No hero images required** - This is a utility tool with a focused single-page interface centered around the microphone button as the hero element.