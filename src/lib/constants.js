// Model options
export const MODEL_OPTIONS = [
  { id: 'gpt-4.1', name: 'GPT 4.1', premium: false },
  { id: 'DeepSeek-R1', name: 'DeepSeek R1', premium: false },
  { id: 'DeepSeek-V3.1', name: 'DeepSeek V3.1', premium: false },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', premium: true, beta: true },
  { id: 'DeepSeek-R1-0528', name: 'DeepSeek R1 0528', premium: true },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', premium: true }, 
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', premium: true},
  { id: 'gpt-4o-mini', name: 'gpt-4o-mini', premium: true},
  { id: 'gpt-5.1-chat', name: 'GPT 5.1', premium: true}
];

// Image generator options
export const IMAGE_GENERATOR_OPTIONS = [
  { id: 'FLUX-1.1-pro', name: 'Flux 1.1', premium: true }
];

// Rhyme scheme options organized by category
export const rhymePlacementOptions = [
  "End rhyme",
  "Internal rhyme",
  "Cross-line rhyme"
];

export const rhymeQualityOptions = [
  "Perfect rhyme",
  "Slant rhyme",
  "Assonance",
  "Consonance",
  "Multisyllabic rhyme"
];

export const rhymePatternOptions = [
  "AABB (couplets)",
  "ABAB (alternating)",
  "ABBA (enclosed)",
  "ABCCB Pattern",
  "ABCCA",
  "Free/irregular"
];

export const poeticFormOptions = [
  "Haiku",
  "Sonnet",
  "Free verse",
  "Limerick",
  "Villanelle",
  "Elegy",
  "Ode",
  "Acrostic",
  "Sestina",
  "Narrative",
  "Cinquain",
  "Prose",
  "Ekphrastic",
  "Pantoum",
  "Pastoral",
  "Ballad",
  "Ghazal"
];
