/**
 * @name        Element subscript conversion (元素角标转换)
 * @description 自动识别化学元素符号及对应数字并转换为下标，支持部分已标注标题的续处理，
 *              保留现有 HTML 标签，自动清除化学式间多余空格，批量事务提交以提升性能。
 * @author      Seking
 * @email       shikun.creative@gmail.com
 * @version     2.2
 * @date        2025-04-03
 * @link        https://github.com/windingwind/zotero-actions-tags/discussions/
 */

// ─── Element Set ─────────────────────────────────────────────────────────────
const elementSet = new Set([
  "H",  "He", "Li", "Be", "B",  "C",  "N",  "O",  "F",  "Ne",
  "Na", "Mg", "Al", "Si", "P",  "S",  "Cl", "Ar", "K",  "Ca",
  "Sc", "Ti", "V",  "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
  "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y",  "Zr",
  "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
  "Sb", "Te", "I",  "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
  "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
  "Lu", "Hf", "Ta", "W",  "Re", "Os", "Ir", "Pt", "Au", "Hg",
  "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th",
  "Pa", "U",  "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
  "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds",
  "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Process only plain-text nodes within an HTML string, leaving all existing
 * tags (e.g. <i>, <sup>, <sub>) completely intact.
 * @param {string} html
 * @returns {string}
 */
function applySubscriptsToTextNodes(html) {
  return html.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, text) => {
    if (tag) return tag;
    return text
      // Element symbol followed by 1-3 digits (not part of a 4-digit year)
      .replace(/([A-Z][a-z]?)(\d{1,3})(?!\d)/g, (m, symbol, digits) =>
        elementSet.has(symbol) ? `${symbol}<sub>${digits}</sub>` : m
      )
      // Closing bracket preceded by a letter, followed by 1-3 digits
      // e.g. (SO4)2 -> (SO4)<sub>2</sub>, but NOT (2024) or (Fig. 3)
      .replace(/([A-Za-z])(\))(\d{1,3})(?!\d)/g, '$1$2<sub>$3</sub>');
  });
}

/**
 * Remove spurious spaces between components of chemical formulas.
 * Operates on the full HTML string (spaces can span tag boundaries).
 *
 * Scenario A: Space before <sub> within a formula token
 *   "ReS <sub>2</sub>"                     ->  "ReS<sub>2</sub>"
 *
 * Scenario B: Spaces around formula separators (/ · •) between formula blocks
 *   "ReS<sub>2</sub> /MoSe<sub>2</sub>"    ->  "ReS<sub>2</sub>/MoSe<sub>2</sub>"
 *   "ReS<sub>2</sub>/ MoSe<sub>2</sub>"    ->  same
 *   "ReS<sub>2</sub> / MoSe<sub>2</sub>"   ->  same
 *   Only fires when the right side opens with a capital letter.
 *
 * Scenario C: Space between </sub> and the next element symbol with its own subscript
 *   "CuInP<sub>2</sub> S<sub>6</sub>"      ->  "CuInP<sub>2</sub>S<sub>6</sub>"
 *   "MoS<sub>2</sub>/CuInP<sub>2</sub> S<sub>6</sub>" ->  "MoS<sub>2</sub>/CuInP<sub>2</sub>S<sub>6</sub>"
 *   Guarded by: right symbol must be a known element AND immediately followed by a
 *   digit or <sub> — strongly indicating formula context rather than prose.
 *
 * Scenario D: Space between two adjacent bare element symbols in plain text,
 *   when the second is immediately followed by a subscript indicator
 *   "Mo Se<sub>2</sub>"                    ->  "MoSe<sub>2</sub>"
 *   Both sides must be valid elements to fire.
 *
 * Scenario E: element+subscript + space(s) + bare element symbol (no trailing subscript),
 *   where the right symbol ends at a boundary or tag start
 *   "Bi<sub>2</sub>O<sub>2</sub> Se"      ->  "Bi<sub>2</sub>O<sub>2</sub>Se"
 *   Fires only when the left side is explicit [Element]<sub>[digits]</sub>,
 *   to avoid touching non-formula boundary spaces in prose.
 *
 * @param {string} html
 * @returns {string}
 */
function removeInterFormulaSpaces(html) {

  // Scenario A: letter + space(s) + <sub>
  html = html.replace(/([A-Za-z])\s+(<sub>)/gi, '$1$2');

  // Scenario B: spaces around formula separators / · •
  // Left anchor: </sub> or an alphanumeric character
  // Right lookahead: must open with a capital letter (formula start)
  html = html.replace(
    /((?:<\/sub>)|(?:[A-Za-z\d]))\s*([/·•])\s*(?=[A-Z])/g,
    '$1$2'
  );

  // Scenario C: </sub> + space(s) + element symbol immediately before digit or <sub>
  // Handles compounds like CuInP<sub>2</sub> S<sub>6</sub>
  html = html.replace(
    /<\/sub>\s+([A-Z][a-z]?)(?=\d{1,3}(?!\d)|<sub>)/g,
    (match, symbol) => elementSet.has(symbol) ? `</sub>${symbol}` : match
  );

  // Scenario D: two bare element symbols separated by a space in plain text,
  // second symbol immediately before a subscript indicator
  html = html.replace(
    /([A-Z][a-z]?)\s+([A-Z][a-z]?)(?=\d{1,3}(?!\d)|<sub>)/g,
    (match, sym1, sym2) =>
      (elementSet.has(sym1) && elementSet.has(sym2)) ? `${sym1}${sym2}` : match
  );

  // Scenario E: [Element]<sub>n</sub> + space(s) + bare element symbol ending at boundary/tag
  // Handles formulas like Bi<sub>2</sub>O<sub>2</sub> Se
  html = html.replace(
    /([A-Z][a-z]?<sub>\d{1,3}<\/sub>)\s+([A-Z][a-z]?)(?=(?:$|<|[^A-Za-z]))/g,
    (match, leftGroup, rightSymbol) =>
      elementSet.has(rightSymbol) ? `${leftGroup}${rightSymbol}` : match
  );

  return html;
}

/**
 * Returns true if the title contains untagged chemical number patterns.
 * @param {string} title
 * @returns {boolean}
 */
function hasUntaggedChemicalNumbers(title) {
  return /([A-Z][a-z]?)(\d{1,3})(?!\d)/.test(title) ||
         /([A-Za-z])(\))(\d{1,3})(?!\d)/.test(title);
}

/**
 * Returns true if the title contains inter-formula spaces that should be removed.
 *
 * BUG FIX (v2.1 -> v2.2): Scenario B previously used \s* (zero-or-more spaces),
 * causing false positives for already-compact separators like </sub>/CuIn where
 * there is nothing to strip. The detection now requires at least one space on
 * either side of the separator (\s+ before OR \s+ after), so compact separators
 * such as MoS<sub>2</sub>/WS<sub>2</sub> no longer trigger unnecessary processing.
 *
 * @param {string} title
 * @returns {boolean}
 */
function hasInterFormulaSpaces(title) {
  return (
    // A: space before <sub>
    /[A-Za-z]\s+<sub>/i.test(title)
    ||
    // B: at least one space on either side of a formula separator
    // Use two sub-checks: space BEFORE separator, or space AFTER separator
    /((?:<\/sub>)|(?:[A-Za-z\d]))\s+[/·•]/.test(title) ||
    /[/·•]\s+[A-Z]/.test(title)
    ||
    // C: </sub> + space + element symbol before digit or <sub>
    /<\/sub>\s+[A-Z][a-z]?(?:\d|<sub>)/.test(title)
    ||
    // D: two bare element symbols separated by a space, second before subscript
    /[A-Z][a-z]?\s+[A-Z][a-z]?(?:\d|<sub>)/.test(title)
    ||
    // E: [Element]<sub>n</sub> + space + bare element symbol at boundary/tag
    /[A-Z][a-z]?<sub>\d{1,3}<\/sub>\s+[A-Z][a-z]?(?=(?:$|<|[^A-Za-z]))/.test(title)
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async function () {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return "No items selected.";
  }

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount   = 0;

  try {
    // Single database transaction for all saves — much faster than per-item saveTx()
    await Zotero.DB.executeTransaction(async function () {
      for (const item of items) {
        try {
          if (!item.isRegularItem()) { skippedCount++; continue; }

          const title = String(item.getField("title") ?? "").trim();
          if (!title)            { skippedCount++; continue; }
          if (!/\d/.test(title)) { skippedCount++; continue; }

          const needsSubscripts = hasUntaggedChemicalNumbers(title);
          const needsSpaceFix   = hasInterFormulaSpaces(title);
          if (!needsSubscripts && !needsSpaceFix) { skippedCount++; continue; }

          // Step 1: tag subscripts in text nodes (preserves existing HTML tags)
          // Step 2: remove inter-formula spaces — re-checked after tagging
          //         because tagging may introduce new </sub>+space patterns
          //         (e.g. untagged "CuInP2 S6" → tagged "CuInP<sub>2</sub> S<sub>6</sub>"
          //          → space now detectable via Scenario C)
          let newTitle = title;
          if (needsSubscripts) newTitle = applySubscriptsToTextNodes(newTitle);
          if (needsSpaceFix || hasInterFormulaSpaces(newTitle))
                               newTitle = removeInterFormulaSpaces(newTitle);

          if (newTitle !== title) {
            item.setField("title", newTitle);
            await item.save();
            updatedCount++;
          } else {
            skippedCount++;
          }
        } catch (itemError) {
          errorCount++;
          Zotero.logError(
            `[Element Subscript] Failed to process item ${item?.id ?? "unknown"}: ${itemError}`
          );
        }
      }
    });
  } catch (txError) {
    Zotero.logError(`[Element Subscript] Transaction failed: ${txError}`);
    return `Transaction error: ${txError.message}. Updated ${updatedCount} item(s) before failure.`;
  }

  return `Done — Updated: ${updatedCount}, Skipped: ${skippedCount}, Errors: ${errorCount} (Total: ${items.length}).`;
})();
