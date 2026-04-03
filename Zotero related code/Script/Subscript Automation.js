/**
 * @name        Element subscript conversion (元素角标转换)
 * @description 自动识别化学元素符号及对应数字并转换为下标，支持部分已标注标题的续处理，
 *              保留现有 HTML 标签，批量事务提交以提升性能。
 * @author      Seking
 * @email       shikun.creative@gmail.com
 * @version     2.0
 * @date        2025-04-03
 * @link        https://github.com/windingwind/zotero-actions-tags/discussions/
 */

// ─── Element Set ────────────────────────────────────────────────────────────
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
 * @param {string} html - Raw title string, possibly containing HTML tags.
 * @returns {string} - Title with chemical subscripts applied only to text nodes.
 */
function applySubscriptsToTextNodes(html) {
  return html.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, text) => {
    // Preserve existing tags unchanged
    if (tag) return tag;

    return text
      // Element symbol followed by 1–3 digits (not part of a 4-digit year)
      // Negative lookahead (?!\d) prevents matching "H2024" or "C2023"
      .replace(/([A-Z][a-z]?)(\d{1,3})(?!\d)/g, (m, symbol, digits) =>
        elementSet.has(symbol) ? `${symbol}<sub>${digits}</sub>` : m
      )
      // Closing bracket followed by 1–3 digits, only when preceded by a letter
      // e.g. (SO4)2 → (SO4)<sub>2</sub>, but NOT (2024) or (Fig. 3)
      .replace(/([A-Za-z])(\))(\d{1,3})(?!\d)/g, '$1$2<sub>$3</sub>');
  });
}

/**
 * Determine whether a title still contains untagged chemical number patterns.
 * Avoids re-processing titles that are already fully converted.
 * @param {string} title
 * @returns {boolean}
 */
function hasUntaggedChemicalNumbers(title) {
  // Check for element+digit patterns not already wrapped in <sub>
  return /([A-Z][a-z]?)(\d{1,3})(?!\d)(?![^<]*<\/sub>)/.test(title) ||
         /([A-Za-z])(\))(\d{1,3})(?!\d)/.test(title);
}

// ─── Main ────────────────────────────────────────────────────────────────────
(async function () {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return "No items selected.";
  }

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount   = 0;

  try {
    // Wrap all saves in a single database transaction for performance
    await Zotero.DB.executeTransaction(async function () {
      for (const item of items) {
        try {
          if (!item.isRegularItem()) {
            skippedCount++;
            continue;
          }

          // Coerce to string defensively; skip blank titles
          const title = String(item.getField("title") ?? "").trim();
          if (!title) {
            skippedCount++;
            continue;
          }

          // Quick pre-filter: skip if no digits present at all
          if (!/\d/.test(title)) {
            skippedCount++;
            continue;
          }

          // Skip if no actionable untagged patterns remain
          if (!hasUntaggedChemicalNumbers(title)) {
            skippedCount++;
            continue;
          }

          const newTitle = applySubscriptsToTextNodes(title);

          if (newTitle !== title) {
            item.setField("title", newTitle);
            await item.save(); // use save() inside executeTransaction, not saveTx()
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