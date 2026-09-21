# AI Bathroom Designer & Planner

An interactive 3D bathroom design assistant that converts a user's **room dimensions, budget, style preferences, and functional constraints** into optimized bathroom product bundles.

The system combines an **exhaustive recommendation engine**, a **3D bathroom visualization**, and **natural-language refinement** so users can generate, compare, and iteratively customize bathroom designs.

---

## ✨ Overview

Designing a bathroom involves balancing multiple constraints at once:

* Available room space
* Budget
* Preferred aesthetic
* Product compatibility
* Functional requirements
* Product quality
* Different possible combinations

The **AI Bathroom Designer** automates this process.

A user provides their bathroom requirements, and the system evaluates possible combinations of:

* 🚽 Toilets
* 🚿 Showers / Bathtubs
* 🪵 Vanities
* 🚰 Faucets

It then generates multiple optimized solutions and visualizes the selected combination inside an interactive **3D bathroom environment**.

Users can further refine the generated design using plain-English instructions such as:

> "Make it more luxurious"

> "Cheaper"

> "Add a tub"

> "Go industrial"

> "Increase budget by 20%"

---

# 🎯 Core Features

## 1. Room & Budget Configuration

Users can specify:

* Room width
* Room depth
* Budget
* Bathtub requirement
* Power availability

The room dimensions are used by the recommendation engine and the 3D scene.

---

## 2. Multiple Design Themes

The application currently supports seven design themes:

* **Minimalist Modern**
* **Classic Luxury**
* **Japanese Zen**
* **Scandinavian Spa**
* **Industrial Loft**
* **Art Deco Glam**
* **Coastal Casual**

Each theme influences product compatibility and the appearance of the 3D bathroom.

---

## 3. Intelligent Product Recommendation

The recommendation engine searches combinations across four product categories:

```text
Toilet
   +
Shower / Bath
   +
Vanity
   +
Faucet
   ↓
Optimized Bathroom Bundle
```

The current catalog contains **30 products** with attributes such as:

* Price
* Width
* Depth
* Height
* Theme compatibility
* Quality score
* Material appearance
* Power requirements
* Tub/shower type

The catalog is structured so that it can later be replaced with a real product feed or API.

---

# 🧠 Recommendation Engine

The core recommendation system is implemented in:

```text
src/engine/optimize.js
```

Rather than selecting products greedily, the system performs an **exhaustive search** across valid product combinations.

For every combination, the engine considers:

* Theme compatibility
* Product quality
* Total price
* Budget relationship
* Room footprint
* Functional compatibility
* Luxury/value preference

A simplified representation of the scoring process is:

```text
Final Score =
    Theme Fit
  + Quality × Luxury Weight
  - Value / Cost Penalty
  - Budget Overrun Penalty
  - Space Penalty
```

### Compatibility constraints

Some constraints are applied before the search.

For example:

* Smart toilets requiring electricity are excluded when power is unavailable.
* Bathtubs are included only when the user allows a tub.
* Shower-only configurations can be enforced through the user's preferences.

### Soft constraints

Budget and space are handled as scoring penalties rather than simply eliminating every option.

This allows the application to still return the best available configuration when a perfect solution does not exist.

The interface also explicitly indicates whether the selected bundle is:

* **Within budget / Over budget**
* **Fits room / Tight fit**

---

# 🏆 Three Optimization Profiles

The application generates three independently optimized configurations:

### Value

Prioritizes economical choices.

### Balanced

Balances product quality, theme compatibility, and cost.

### Luxury-leaning

Places greater weight on product quality and premium choices.

These are not simply different labels applied to the same bundle.

Each profile runs the optimization engine again with a different objective weighting.

Users can switch between the generated solutions and immediately see the corresponding products in the 3D scene.

---

# 🏠 Interactive 3D Bathroom

The visualization is implemented using:

* **Three.js**
* **React Three Fiber**
* **@react-three/drei**

The 3D scene includes representations of:

* Bathroom room
* Toilet
* Vanity
* Faucet
* Shower / bathtub
* Mirror
* Lighting
* Contact shadows

The selected products are reflected directly in the scene.

The room appearance also changes according to the selected design theme.

---

## 🎥 3D Controls

Users can interact with the bathroom using orbit controls.

The application also provides predefined camera views:

* **Wide**
* **Vanity**
* **Shower**

These make it easier to present the generated design during a demonstration.

---

## 📸 Snapshot

The current 3D view can be exported as a PNG using the built-in **Save snapshot** functionality.

---

# 💬 Natural-Language Refinement

The refinement system is implemented in:

```text
src/engine/nlEdit.js
```

Users do not have to return to the original configuration screens for every change.

Instead, they can describe changes naturally.

Examples include:

| User instruction         | Result                           |
| ------------------------ | -------------------------------- |
| `more luxurious`         | Increases luxury weighting       |
| `cheaper`                | Moves optimization toward value  |
| `add a tub`              | Allows bathtub products          |
| `shower only`            | Removes bathtub options          |
| `go industrial`          | Switches to Industrial Loft      |
| `make it zen`            | Switches to Japanese Zen         |
| `increase budget by 20%` | Raises the current budget        |
| `cut cost by 15%`        | Reduces the budget               |
| `don't cross ₹2L`        | Sets a budget cap                |
| `no power`               | Excludes power-dependent toilets |
| `money is no object`     | Maximizes luxury weighting       |

The system also keeps a visible history of refinement instructions and explains what change was applied.

---

# 🤖 AI / Intelligence Approach

The current version uses a **transparent rule-based natural-language parser** rather than making an external LLM/API call.

This was a deliberate implementation choice for the current prototype because it provides:

* Predictable behavior
* Instant responses
* No API dependency
* No API key requirement
* Easy debugging
* Auditable transformations

The parser converts natural-language requests into structured parameters that are passed back into the recommendation engine.

For example:

```text
"make it more luxurious but don't cross ₹2.5L"
```

is converted into changes to parameters such as:

```text
luxuryWeight
budget
theme
wantTub
hasPower
```

The optimizer then generates a new solution using those parameters.

### Future AI upgrade

The current parser has been designed with an upgrade path toward an LLM-backed interpretation layer.

An LLM could eventually convert more complex free-form requests into the same structured parameter format without requiring changes to the downstream optimization or visualization system.

---

# 🧩 Application Flow

The application follows a simple three-step workflow:

```text
┌─────────────────────────┐
│  1. Define Your Space   │
│                         │
│  Dimensions             │
│  Budget                 │
│  Tub                    │
│  Power availability     │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  2. Choose Your Style   │
│                         │
│  7 design themes        │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  3. Generate Bathroom   │
│                         │
│  Optimization Engine    │
│          ↓              │
│  3 optimized bundles    │
│          ↓              │
│  Interactive 3D Scene   │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  Refine with a Sentence │
│                         │
│  Natural-language edits │
└─────────────────────────┘
```

---

# 🖥️ Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS

### 3D Visualization

* Three.js
* React Three Fiber
* @react-three/drei

### State Management

* Zustand

### Icons

* Lucide React

### Recommendation Engine

* JavaScript
* Exhaustive combinatorial optimization
* Rule-based natural-language parsing

---

# 📁 Project Structure

```text
kohler-ai-bathroom/
│
├── src/
│   ├── data/
│   │   └── catalog.js
│   │
│   ├── engine/
│   │   ├── optimize.js
│   │   └── nlEdit.js
│   │
│   ├── scene/
│   │   ├── CameraRig.jsx
│   │   ├── Faucet.jsx
│   │   ├── Fixtures.jsx
│   │   ├── Mirror.jsx
│   │   ├── Room.jsx
│   │   ├── SceneLighting.jsx
│   │   ├── ShowerOrTub.jsx
│   │   ├── Toilet.jsx
│   │   └── Vanity.jsx
│   │
│   ├── store/
│   │   └── useConfigStore.js
│   │
│   ├── ui/
│   │   ├── BundleSummary.jsx
│   │   ├── RefineBar.jsx
│   │   ├── ResultsStep.jsx
│   │   ├── SolutionPicker.jsx
│   │   ├── SpaceForm.jsx
│   │   ├── StepNav.jsx
│   │   └── StyleForm.jsx
│   │
│   ├── utils/
│   │   └── format.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* **Node.js 18+**
* npm

Check your versions:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd kohler-ai-bathroom
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Run the Application

Start the Vite development server:

```bash
npm run dev
```

Vite will display a local URL in the terminal, typically:

```text
http://localhost:5173
```

Open that address in a browser.

---

# 🏗️ Production Build

To verify that the application builds successfully:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

# 📊 Performance / Transparency

The results screen displays the number of combinations evaluated and the approximate optimization time for the current solve.

This provides visibility into what the recommendation engine actually evaluated instead of presenting a fabricated performance number.

---

# 🛠️ Current Product Catalog

The prototype currently uses a local catalog defined in:

```text
src/data/catalog.js
```

The catalog contains **30 representative products**.

Each product contains structured information used by both the recommendation engine and 3D visualization.

Example attributes include:

```text
id
name
price
width
depth
height
themes
quality
material / appearance
compatibility flags
```

The catalog is intentionally separated from the optimization logic so that it can later be replaced with a larger product dataset or a live product API.

---

# 🔮 Future Scope

The current prototype provides the core recommendation + visualization workflow. Potential production extensions include:

### Real KOHLER Product Integration

Replace the prototype catalog with an official product database/API containing:

* Live product availability
* Real prices
* Product SKUs
* Technical specifications
* Product images
* Regional availability

### Advanced Spatial Planning

Upgrade the current placement approach to support:

* True collision detection
* Door and window positions
* Plumbing locations
* Minimum clearance requirements
* Fixture accessibility
* Building-code constraints
* More complex room layouts

### Image / Floor-Plan Input

Allow users to upload a bathroom image or floor plan and automatically extract:

* Room dimensions
* Walls
* Doors
* Windows
* Existing fixtures
* Available installation areas

### LLM-Powered Design Assistant

Replace or augment the current rule-based parser with an LLM capable of understanding more complex design instructions.

For example:

> "Keep the Japanese Zen feeling but make the vanity more premium and give me a bathtub without making the room feel cramped."

### Advanced 3D Visualization

Future versions could include:

* More detailed product models
* Realistic materials
* Better lighting
* Photorealistic rendering
* AR visualization
* First-person walkthroughs

### Personalized Recommendations

A future system could learn from user interactions and preferences to improve recommendations over time.

---

# ⚠️ Current Limitations

This is a prototype implementation and has several known limitations.

### Product Data

The current catalog contains representative product data rather than a live KOHLER product feed.

### Spatial Placement

The current 3D fixture placement uses a heuristic positioning approach. It is not a full architectural CAD/collision-detection system.

### Natural Language

The current natural-language interface uses a transparent rule-based parser and therefore supports a defined set of expressions rather than unrestricted conversational understanding.

### Recommendation Model

The optimizer is an exact combinatorial search over the current catalog rather than a trained machine-learning model.

This makes the current system deterministic and explainable, while a larger production catalog would require additional optimization techniques for scalability.

---

# 💡 Design Philosophy

The prototype focuses on three principles:

### 1. Constraint-aware

Recommendations should consider the user's actual space, budget, and functional requirements.

### 2. Explainable

The system should be able to show what was selected and why, rather than behaving as an entirely opaque recommendation model.

### 3. Interactive

Design is iterative. Users should be able to generate a design, compare alternatives, visualize the result, and refine it using natural language.

---

# 📌 Project Status

**Prototype / Case Study Implementation**

The current version demonstrates the complete core workflow:

```text
User Requirements
       ↓
Constraint Processing
       ↓
Product Combination Search
       ↓
Multiple Optimized Bundles
       ↓
Interactive 3D Visualization
       ↓
Natural-Language Refinement
       ↓
Updated Bathroom Design
```

The architecture is designed so that the prototype can be extended with real product data, advanced spatial reasoning, image-based room analysis, and an LLM-backed design assistant.

---

## 👩‍💻 Author

**Prachi Dadlani**

KOHLER AI Bathroom Designer & Planner
Phase 2 Case Study Challenge
