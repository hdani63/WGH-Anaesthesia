// Static registry for the UHW guideline algorithm images.
// Metro only resolves require() with literal paths, so each asset is listed
// explicitly. Aspect ratios come from the source PNGs and let the renderer
// size an image before it loads, which stops the layout jumping on scroll.
//
// Source: Anaesthesia-Companion/static/uhw_algorithms/
// Keys match the `src` filename emitted by scripts/convert_uhw_guidelines.py.

export const UHW_IMAGES = {
  'sepsis_adult_1.png': {
    source: require('../../assets/images/uhw-algorithms/sepsis_adult_1.png'),
    aspectRatio: 452 / 637,
  },
  'sepsis_adult_2.png': {
    source: require('../../assets/images/uhw-algorithms/sepsis_adult_2.png'),
    aspectRatio: 453 / 638,
  },
  'sepsis_maternity_1.png': {
    source: require('../../assets/images/uhw-algorithms/sepsis_maternity_1.png'),
    aspectRatio: 633 / 896,
  },
  'sepsis_maternity_2.png': {
    source: require('../../assets/images/uhw-algorithms/sepsis_maternity_2.png'),
    aspectRatio: 630 / 890,
  },
  'sepsis_postpartum_1.png': {
    source: require('../../assets/images/uhw-algorithms/sepsis_postpartum_1.png'),
    aspectRatio: 451 / 638,
  },
  'sepsis_postpartum_2.png': {
    source: require('../../assets/images/uhw-algorithms/sepsis_postpartum_2.png'),
    aspectRatio: 452 / 638,
  },
  'gentamicin_dosing_table.png': {
    source: require('../../assets/images/uhw-algorithms/gentamicin_dosing_table.png'),
    aspectRatio: 413 / 191,
  },
  'gentamicin_trough_chart.png': {
    source: require('../../assets/images/uhw-algorithms/gentamicin_trough_chart.png'),
    aspectRatio: 643 / 229,
  },
  'amikacin_algorithm.png': {
    source: require('../../assets/images/uhw-algorithms/amikacin_algorithm.png'),
    aspectRatio: 940 / 1187,
  },
  'amikacin_trough_chart.png': {
    source: require('../../assets/images/uhw-algorithms/amikacin_trough_chart.png'),
    aspectRatio: 643 / 229,
  },
  'vancomycin_algorithm.png': {
    source: require('../../assets/images/uhw-algorithms/vancomycin_algorithm.png'),
    aspectRatio: 940 / 1273,
  },
  'tobramycin_dose_table.png': {
    source: require('../../assets/images/uhw-algorithms/tobramycin_dose_table.png'),
    aspectRatio: 368 / 247,
  },
  'glycopeptides_container.png': {
    source: require('../../assets/images/uhw-algorithms/glycopeptides_container.png'),
    aspectRatio: 256 / 152,
  },
};

export function getUhwImage(name) {
  return UHW_IMAGES[name] || null;
}
