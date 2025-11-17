/**
 * Contrast - Cálculo de contraste de cores (WCAG 1.4.3)
 * Implementa o algoritmo de luminância relativa do WCAG
 */

/**
 * Converte componente de cor sRGB para linear
 * @param {number} val - Valor 0-255
 * @returns {number} Valor linear
 */
function toLinear(val) {
  const v = val / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Calcula luminância relativa de uma cor RGB
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} Luminância relativa (0-1)
 */
function relativeLuminance(r, g, b) {
  const rL = toLinear(r);
  const gL = toLinear(g);
  const bL = toLinear(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/**
 * Calcula razão de contraste entre duas cores
 * @param {Array} rgb1 - [r, g, b] primeira cor
 * @param {Array} rgb2 - [r, g, b] segunda cor
 * @returns {number} Razão de contraste (1-21)
 */
function contrastRatio(rgb1, rgb2) {
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Extrai RGB de string de cor CSS
 * @param {string} color - Cor em formato CSS (rgb, rgba, hex)
 * @returns {Array|null} [r, g, b] ou null se inválido
 */
function parseColor(color) {
  // Remove espaços
  color = color.trim();
  
  // Hex
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16)
      ];
    }
  }
  
  // RGB/RGBA
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1]),
      parseInt(rgbMatch[2]),
      parseInt(rgbMatch[3])
    ];
  }
  
  return null;
}

/**
 * Verifica se contraste atende ao nível AA (4.5:1 para texto normal, 3:1 para texto grande)
 * @param {number} ratio - Razão de contraste
 * @param {boolean} isLargeText - Se é texto grande (>=18pt ou >=14pt bold)
 * @returns {boolean} true se passa no nível AA
 */
function passesAA(ratio, isLargeText = false) {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Verifica se contraste atende ao nível AAA (7:1 para texto normal, 4.5:1 para texto grande)
 * @param {number} ratio - Razão de contraste
 * @param {boolean} isLargeText - Se é texto grande
 * @returns {boolean} true se passa no nível AAA
 */
function passesAAA(ratio, isLargeText = false) {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

// Exporta funções
if (typeof window !== 'undefined') {
  window.contrast = {
    relativeLuminance,
    contrastRatio,
    parseColor,
    passesAA,
    passesAAA
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    relativeLuminance,
    contrastRatio,
    parseColor,
    passesAA,
    passesAAA
  };
}
