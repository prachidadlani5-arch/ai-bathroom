# KOHLER AI Bathroom Designer & Planner

An AI-assisted bathroom design and product recommendation system that transforms customer requirements into **physically feasible, budget-aware, style-personalized bathroom bundles** and visualizes the resulting design in an interactive **3D environment**.

The system allows users to configure their bathroom space, budget, preferred aesthetic, and product requirements, then generates multiple optimized bathroom solutions that can be refined using natural-language instructions.

---

## Overview

Bathroom product selection is not simply a matter of choosing individual products. Fixtures must work together within the available space, satisfy the customer's budget, and match the desired aesthetic.

The KOHLER AI Bathroom Designer addresses this by combining:

* Room and space constraints
* Budget optimization
* Product compatibility
* Aesthetic preferences
* Product quality
* 3D visualization
* Natural-language refinement

The result is a personalized bathroom configuration rather than a collection of unrelated products.

---

## Key Features

### 🏠 Space-Aware Configuration

Users can specify bathroom dimensions and room constraints before generating a design.

### 💰 Budget-Aware Recommendations

The recommendation engine considers the customer's budget and balances cost against product quality and design preferences.

### 🎨 Style Personalization

The system supports multiple bathroom aesthetics, allowing recommendations and the visual environment to adapt to the selected style.

### 🚿 Product Bundle Optimization

Instead of recommending individual products independently, the system evaluates combinations of:

* Faucets
* Toilets
* Showers / tubs
* Vanities

and produces complete bathroom bundles.

### 🧠 Exact Optimization Engine

The recommendation engine evaluates the available product combinations and scores them against multiple factors including:

* Budget
* Quality
* Style compatibility
* Space requirements
* User preferences

Three different solution tiers are generated using different objective weightings, allowing users to explore alternative configurations.

### 🗣️ Natural-Language Refinement

Users can refine a generated design using plain-English instructions such as:

* "Make it more zen"
* "Increase the budget by 20%"
* "Make it cheaper"
* "Go industrial"
* "Give me the cheapest possible option"

The current implementation uses a transparent rule-based natural-language parser, making each modification auditable and predictable.

### 🧊 Interactive 3D Visualization

The selected bathroom configuration is rendered as an interactive 3D scene.

The visualization includes:

* Room geometry
* Walls and flooring
* Vanity
* Toilet
* Faucet
* Shower / tub
* Mirror
* Lighting
* Camera presets

The room's visual styling also changes according to the selected bathroom theme.

### 📸 Design Snapshot

Users can capture the current 3D design as a PNG image.

---

## User Flow

```text
Customer Requirements
        ↓
Bathroom Dimensions
        ↓
Budget & Constraints
        ↓
Aesthetic / Style Selection
        ↓
Product Catalog
        ↓
Optimization Engine
        ↓
Three Feasible Design Options
        ↓
Interactive 3D Visualization
        ↓
Natural-Language Refinement
        ↓
Final Bathroom Configuration
```

---

## Recommendation & Optimization Approach

The system uses an **exact exhaustive-search approach** over the available product combinations.

Each possible combination is evaluated using an objective function that considers factors such as:

* Product quality
* Style compatibility
* Total price
* Budget deviation
* Space/footprint considerations
* User preference weighting

Rather than returning a single configuration, the system generates three alternatives with different optimization priorities.

This provides users
