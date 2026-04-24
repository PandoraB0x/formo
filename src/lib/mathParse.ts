const TRAILING_DIGITS = /^(.+?)(\d+)$/;
const FRACTION_PATTERN = /^\s*([^/]+?)\s*\/\s*([^/]+?)\s*$/;

export function parseFraction(text: string): { numerator: string; denominator: string } | null {
  const m = text.match(FRACTION_PATTERN);
  if (!m) return null;
  const numerator = m[1].trim();
  const denominator = m[2].trim();
  if (!numerator || !denominator) return null;
  return { numerator, denominator };
}

export function splitForScript(text: string): { base: string; tail: string } | null {
  const trimmed = text.trim();
  if (trimmed.length < 2) return null;

  const spaceIdx = trimmed.lastIndexOf(' ');
  if (spaceIdx > 0 && spaceIdx < trimmed.length - 1) {
    const base = trimmed.slice(0, spaceIdx).trimEnd();
    const tail = trimmed.slice(spaceIdx + 1).trimStart();
    if (base && tail) return { base, tail };
  }

  const m = trimmed.match(TRAILING_DIGITS);
  if (m && /\D/.test(m[1])) {
    return { base: m[1], tail: m[2] };
  }

  if (/^\d+$/.test(trimmed)) return null;

  return { base: trimmed.slice(0, -1), tail: trimmed.slice(-1) };
}

const SUPER_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
  'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
  'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
  'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
  'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
};

const SUB_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
  'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ',
};

export function toSuperscript(s: string): string {
  return s.split('').map((c) => SUPER_MAP[c.toLowerCase()] ?? c).join('');
}

export function toSubscript(s: string): string {
  return s.split('').map((c) => SUB_MAP[c.toLowerCase()] ?? c).join('');
}

export function normalizePlusMinus(text: string): string {
  return text.replace(/\+-/g, '±').replace(/-\+/g, '∓');
}
