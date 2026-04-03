// ==UserScript==
// @name        PaperPilot
// @version     18.1
// @author      Rebuild by Hou (Optimized)
// @description Automatically jumps to PDF when you visit a journal article abstract page. Also includes utilities to copy citation info and download PDF. Google Scholar-like search pages will NOT auto-open the first result and will NOT show the sidebar.
// @match       https://www.sciencedirect.com/science/article/*
// @match       https://onlinelibrary.wiley.com/doi/*
// @match       https://*.onlinelibrary.wiley.com/doi/*
// @match       https://pubs.acs.org/doi/*
// @match       https://www.tandfonline.com/doi/*
// @match       https://www.beilstein-journals.org/*
// @match       https://pubs.rsc.org/en/content/*
// @match       https://link.springer.com/article*
// @match       https://pubs.aip.org/aip/*/article/*
// @match       https://pubs.aip.org/*/article/*
// @match       https://pubs.aip.org/*/article/*/*
// @match       https://www.nature.com/articles*
// @match       https://www.science.org/doi/*
// @match       https://journals.aps.org/*/abstract/10*
// @match       https://cdnsciencepub.com/doi/*
// @match       https://iopscience.iop.org/article/10*
// @match       https://www.cell.com/*/fulltext/*
// @match       https://journals.lww.com/*
// @match       https://*.biomedcentral.com/articles/*
// @match       https://journals.sagepub.com/doi/*
// @match       https://academic.oup.com/*/article/*
// @match       https://karger.com/*/article/*
// @match       https://www.cambridge.org/core/journals/*/article/*
// @match       https://www.annualreviews.org/doi/*
// @match       https://www.jstage.jst.go.jp/article/*
// @match       https://www.hindawi.com/journals/*
// @match       https://*.theclinics.com/article/*
// @match       https://www.liebertpub.com/doi/*
// @match       https://thorax.bmj.com/content/*
// @match       https://journals.physiology.org/doi/*
// @match       https://www.ahajournals.org/doi/*
// @match       https://dl.acm.org/doi/*
// @match       https://journals.asm.org/doi/*
// @match       https://*.apa.org/record/*
// @match       https://*.apa.org/fulltext/*
// @match       https://www.thelancet.com/journals/*/article/*
// @match       https://jamanetwork.com/journals/*
// @match       https://aacrjournals.org/*/article/*
// @match       https://royalsocietypublishing.org/doi/*
// @match       https://journals.plos.org/*/article*
// @match       https://*.psychiatryonline.org/doi/*
// @match       https://opg.optica.org/*/*.cfm*
// @match       https://www.thieme-connect.de/products/ejournals/*
// @match       https://journals.ametsoc.org/view/journals/*
// @match       https://www.frontiersin.org/articles/*
// @match       https://www.worldscientific.com/doi/*
// @match       https://www.nejm.org/doi/*
// @match       https://ascopubs.org/doi/*
// @match       https://www.jto.org/article/*
// @match       https://www.jci.org/articles/*
// @match       https://www.pnas.org/doi/*
// @match       https://scholar.google.com/*
// @match       https://www.x-mol.com/*
// @match       https://cljtscd.com/*
// @match       https://xueshu.lanfanshu.cn/*
// @match       https://xs.cljtscd.com/*
// @match       https://sc.panda985.com/*
// @match       https://so1.cljtscd.com/*
// @match       https://pubs.aip.org/*/*/article-abstract/*
// @match       https://pubs.aip.org/*/*/article-abstract/*/*
// @match       https://journals.aps.org/*/*
// @match       https://link.aps.org/doi/*
// @match       https://journals.jps.jp/doi/*
// @match       https://iopscience.iop.org/article/*/*
// @match       https://iopscience.iop.org/journal/*
// @match       https://www.sciencemag.org/content/*
// @match       https://www.science.org/content/*
// @match       https://advances.sciencemag.org/content/*
// @match       https://www.nature.com/articles/*
// @match       https://www.nature.com/*/articles/*
// @match       https://www.nature.com/nphys/journal/*
// @match       https://www.nature.com/nmat/journal/*
// @match       https://www.nature.com/nnano/journal/*
// @match       https://www.nature.com/ncomms/*/articles/*
// @match       https://www.nature.com/s*/articles/*
// @match       https://link.springer.com/content/*
// @match       https://link.springer.com/journal/*
// @match       https://link.springer.com/epj/*
// @match       https://epjweb.org/articles/*
// @match       https://www.epj.org/*
// @match       https://journals.jps.jp/toc/*
// @match       https://academic.oup.com/ptep/article/*
// @match       https://academic.oup.com/ptp/article/*
// @match       https://aapt.scitation.org/doi/*
// @match       https://aip.scitation.org/doi/*
// @match       https://pubs.aip.org/*/journal/*
// @match       https://physicstoday.scitation.org/doi/*
// @match       https://www.annualreviews.org/content/*
// @match       https://journals.aps.org/search*
// @match       https://www.cambridge.org/core/product/*
// @match       https://www.cambridge.org/core/journals/*/article/*
// @match       https://royalsocietypublishing.org/action/*
// @match       https://rsta.royalsocietypublishing.org/content/*
// @match       https://rspa.royalsocietypublishing.org/content/*
// @match       https://rstb.royalsocietypublishing.org/content/*
// @match       https://www.tandfonline.com/action/*
// @match       https://www.mdpi.com/*/article/*
// @match       https://www.mdpi.com/journal/*
// @match       https://www.degruyter.com/document/*
// @match       https://www.degruyter.com/journal/*
// @match       https://onlinelibrary.wiley.com/journal/*
// @match       https://physicsworld.com/a/*
// @match       https://cerncourier.com/a/*
// @match       https://www.sciencedaily.com/releases/*
// @match       https://arxiv.org/abs/*
// @match       https://arxiv.org/pdf/*
// @grant       GM_download
// @run-at      document-start
// @namespace   https://greasyfork.org/users/171198
// ==/UserScript==

(function() {
  "use strict";

  const CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    LOAD_TIMEOUT: 30000,
    MAX_PDF_CANDIDATES: 14,
    MAX_VERIFIED_CANDIDATES: 3,
    MAX_PROBE_CONCURRENCY: 4,
    DOWNLOAD_CACHE_LIMIT: 160,
    SCIHUB_URL: "https://sci-hub.st/",
    TOOLBOX_ID: "journal-window-toolbox",
    TOOLBOX_STYLE_ID: "journal-window-styles"
  };

  let tit = null, doi = null, pdf = null, year = null, publication = null, arxivId = null;
  let toolboxCreated = false;
  let styleSheet = null;
  let activeCloseToolbox = null;

  const pdfProbeCache = new Map();
  const verifiedCandidateCache = new Map();
  const extractedPdfCache = new Map();

  const HISTORY_PATCH_FLAG = "__jwHistoryPatched__";
  const TOOLBOX_POS_KEY = "jw-toolbox-pos";
  const VERIFIED_PDF_KEY_PREFIX = "jw-verified-pdf::";

  const COMMON_PATH_TRANSFORMS = [
    ["/doi/full/", "/doi/pdf/"],
    ["/doi/abs/", "/doi/pdf/"],
    ["/article/fulltext/", "/article/pdf/"],
    ["/article/abstract/", "/article/pdf/"],
    ["/fulltext", "/pdf"],
    ["/full", "/pdf"]
  ];

  const HOST_SPECIFIC_TRANSFORMS = [
    {
      hostIncludes: ["wiley.com"],
      rules: [
        ["/doi/epdf/", "/doi/pdfdirect/"],
        ["/doi/pdf/", "/doi/pdfdirect/"],
        ["/doi/full/", "/doi/pdfdirect/"]
      ]
    },
    {
      hostIncludes: ["tandfonline.com"],
      rules: [
        ["/doi/full/", "/doi/pdf/"],
        ["/doi/abs/", "/doi/pdf/"]
      ]
    },
    {
      hostIncludes: ["pubs.acs.org"],
      rules: [
        ["/doi/full/", "/doi/pdf/"],
        ["/doi/abs/", "/doi/pdf/"]
      ]
    },
    {
      hostIncludes: ["springer.com"],
      rules: [
        ["/article/", "/content/pdf/"]
      ]
    },
    {
      hostIncludes: ["nature.com"],
      rules: [
        ["/full", ".pdf"]
      ]
    },
    {
      hostIncludes: ["science.org", "sciencemag.org"],
      rules: [
        ["/doi/full/", "/doi/pdf/"],
        ["/doi/abs/", "/doi/pdf/"]
      ]
    },
    {
      hostIncludes: ["arxiv.org"],
      rules: [
        ["/abs/", "/pdf/"]
      ]
    }
  ];

  function normalizeDoi(rawDoi) {
    if (!rawDoi || typeof rawDoi !== "string") return null;
    let value = rawDoi.trim();
    if (!value) return null;

    value = value
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
      .replace(/^doi\s*[:=]\s*/i, "")
      .replace(/[\s<>"'`]+/g, "")
      .replace(/\.$/, "");

    const match = value.match(/10\.\S+\/\S+/);
    if (!match) return null;
    return match[0];
  }

  function cleanTitle(value) {
    if (!value || typeof value !== "string") return null;
    const v = value.replace(/\s+/g, " ").trim();
    if (!v) return null;
    if (v.length < 5) return null;
    if (/^(pdf|full text|abstract|download)$/i.test(v)) return null;
    return v;
  }

  function cleanJournalName(value) {
    if (!value || typeof value !== "string") return null;

    let v = value
      .replace(/\s+/g, " ")
      .replace(/[|\u00A0]+/g, " ")
      .trim();

    if (!v) return null;

    const lower = v.toLowerCase();

    const badPatterns = [
      /^journal$/i,
      /^journal name$/i,
      /^publication$/i,
      /^source$/i,
      /^article$/i,
      /^full text$/i,
      /^pdf$/i,
      /^download pdf$/i,
      /^abstract$/i,
      /^open access$/i,
      /^copyright/i,
      /^home$/i,
      /^issue$/i,
      /^volume$/i,
      /^publisher$/i,
      /^published by$/i
    ];

    if (badPatterns.some(re => re.test(v))) return null;
    if (v.length < 3) return null;

    const bannedExact = new Set([
      "american chemical society",
      "acs publications",
      "acs journals",
      "elsevier",
      "springer",
      "springer nature",
      "wiley",
      "wiley online library",
      "nature portfolio",
      "nature publishing group",
      "taylor & francis",
      "iop publishing",
      "aip publishing",
      "american institute of physics",
      "american physical society",
      "royal society of chemistry",
      "oxford academic",
      "cambridge university press",
      "sage publications",
      "mdpi",
      "frontiers"
    ]);

    if (bannedExact.has(lower)) return null;

    const bannedContains = [
      "publications",
      "online library"
    ];

    if (bannedContains.some(token => lower === token || lower.startsWith(token + " ") || lower.endsWith(" " + token))) {
      return null;
    }

    return v;
  }

  function validateJournalCandidate(name) {
    const cleaned = cleanJournalName(name);
    if (!cleaned) return null;

    const lower = cleaned.toLowerCase();
    const obviousNonJournal = [
      "american chemical society",
      "springer nature",
      "wiley online library",
      "nature portfolio",
      "elsevier"
    ];

    if (obviousNonJournal.includes(lower)) return null;
    return cleaned;
  }

  function extractArxivId(urlValue = location.href) {
    try {
      const u = new URL(urlValue, location.href);
      if (!u.hostname.toLowerCase().includes("arxiv.org")) return null;

      const m = u.pathname.match(/^\/(?:abs|pdf)\/([^/?#]+?)(?:\.pdf)?$/i);
      return m ? m[1] : null;
    } catch (e) {
      return null;
    }
  }

  function getArxivPreferredPdfUrl(arxivValue = null, urlValue = location.href) {
    const id = arxivValue || extractArxivId(urlValue);
    if (!id) return null;
    return `https://arxiv.org/pdf/${id}.pdf`;
  }

  function safeQuerySelector(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (e) {
      return null;
    }
  }

  function safeQuerySelectorAll(selector, context = document) {
    try {
      return context.querySelectorAll(selector);
    } catch (e) {
      return [];
    }
  }

  function isScholarLikeHost(hostValue = location.hostname) {
    const host = (hostValue || "").toLowerCase();
    return (
      host.includes("scholar.google.") ||
      host === "xueshu.lanfanshu.cn" ||
      host === "cljtscd.com" ||
      host === "xs.cljtscd.com" ||
      host === "so1.cljtscd.com" ||
      host === "sc.panda985.com"
    );
  }

  function getScholarSiteName(hostValue = location.hostname) {
    const host = (hostValue || "").toLowerCase();
    if (host.includes("scholar.google.")) return "Google Scholar";
    if (host === "xueshu.lanfanshu.cn") return "学术镜像";
    if (host === "cljtscd.com" || host === "xs.cljtscd.com" || host === "so1.cljtscd.com" || host === "sc.panda985.com") {
      return "Scholar Mirror";
    }
    return "Scholar";
  }

  function hasScholarLikeResults() {
    const selectors = [
      ".gs_ri",
      ".gs_r",
      "h3.gs_rt",
      ".result-item",
      ".paper-item"
    ];
    return selectors.some(sel => safeQuerySelectorAll(sel).length > 0);
  }

  function extractScholarFirstTitle() {
    const selectors = [
      ".gs_rt a",
      "h3.gs_rt a",
      ".result-item a[href]",
      ".paper-item a[href]"
    ];

    for (const selector of selectors) {
      const node = safeQuerySelector(selector);
      const text = cleanTitle(node?.textContent || node?.innerText || "");
      if (text) return text;
    }
    return null;
  }

  function extractDoiFromMetaTags() {
    const metaFields = [
      'meta[name="citation_doi"]',
      'meta[name="dc.identifier"]',
      'meta[name="dc.source"]',
      'meta[name="prism.doi"]',
      'meta[property="og:doi"]'
    ];

    for (const selector of metaFields) {
      const meta = safeQuerySelector(selector);
      const content = meta && meta.getAttribute("content");
      const parsed = normalizeDoi(content);
      if (parsed) return parsed;
    }

    return null;
  }

  function extractDoiFromLinks() {
    const anchors = safeQuerySelectorAll('a[href*="doi.org/"]');
    for (const a of anchors) {
      const href = a.getAttribute("href") || "";
      const parsed = normalizeDoi(href);
      if (parsed) return parsed;
    }
    return null;
  }

  function extractDoiFromNaturePath(urlValue = location.href) {
    try {
      const u = new URL(urlValue, location.href);
      if (!u.hostname.toLowerCase().includes("nature.com")) return null;

      const m = u.pathname.match(/\/articles\/([^/?#]+)/i);
      if (!m) return null;

      let articleId = m[1]
        .replace(/\.pdf$/i, "")
        .replace(/_reference$/i, "");

      if (!articleId) return null;
      return normalizeDoi(`10.1038/${articleId}`);
    } catch (e) {
      return null;
    }
  }

  function extractDoiRobust() {
    return (
      extractDoiFromMetaTags() ||
      extractDoiFromLinks() ||
      extractDoiFromNaturePath(location.href) ||
      null
    );
  }

  function extractTitleFromMetaTags() {
    const selectors = [
      'meta[name="citation_title"]',
      'meta[name="dc.title"]',
      'meta[property="og:title"]',
      'meta[name="wkhealth_title"]'
    ];

    for (const selector of selectors) {
      const el = safeQuerySelector(selector);
      const value = cleanTitle(el?.getAttribute("content") || "");
      if (value) return value;
    }
    return null;
  }

  function extractTitleFromDom() {
    const titleSelectors = [
      "h1",
      ".article-header__title",
      ".article-title",
      '[data-test="article-title"]',
      '[data-testid="article-title"]',
      ".core-container h1",
      ".article-tools__header h1",
      ".publicationContentTitle",
      ".main-heading"
    ];

    for (const selector of titleSelectors) {
      const nodes = safeQuerySelectorAll(selector);
      for (const node of nodes) {
        const value = cleanTitle(node.innerText || node.textContent || "");
        if (value) return value;
      }
    }
    return null;
  }

  function extractTitleFromPaperPilotSidebar() {
    const toolbox = document.getElementById(CONFIG.TOOLBOX_ID);
    if (toolbox) {
      const fields = toolbox.querySelectorAll(".toolbox-field");
      for (const field of fields) {
        const label = field.querySelector(".toolbox-label");
        if (!label) continue;
        const labelText = (label.textContent || "").trim().toLowerCase();
        if (!["title", "标题"].includes(labelText)) continue;
        const input = field.querySelector('input[type="text"]');
        const value = cleanTitle(input?.value || input?.getAttribute("value") || "");
        if (value) return value;
      }
    }
    return null;
  }

  function extractTitleRobust() {
    return (
      extractTitleFromMetaTags() ||
      extractTitleFromDom() ||
      extractTitleFromPaperPilotSidebar() ||
      cleanTitle(document.title || "") ||
      null
    );
  }

  function extractJournalFromMetaTags() {
    const selectors = [
      'meta[name="citation_journal_title"]',
      'meta[name="citation_journal_abbrev"]',
      'meta[name="prism.publicationName"]',
      'meta[name="citation_source"]',
      'meta[name="dc.source"]',
      'meta[name="dc.Source"]'
    ];

    for (const selector of selectors) {
      const el = safeQuerySelector(selector);
      const content = el && el.getAttribute("content");
      const cleaned = cleanJournalName(content);
      if (cleaned) return cleaned;
    }

    return null;
  }

  function extractJournalFromJsonLdObject(obj) {
    if (!obj || typeof obj !== "object") return null;

    const candidates = [
      obj?.isPartOf?.name,
      obj?.publication?.name,
      obj?.periodical?.name,
      obj?.journal?.name
    ];

    for (const item of candidates) {
      const cleaned = cleanJournalName(item);
      if (cleaned) return cleaned;
    }

    if (Array.isArray(obj["@graph"])) {
      for (const node of obj["@graph"]) {
        const hit = extractJournalFromJsonLdObject(node);
        if (hit) return hit;
      }
    }

    return null;
  }

  function extractJournalFromJsonLd() {
    const scripts = safeQuerySelectorAll('script[type="application/ld+json"]');
    for (const s of scripts) {
      try {
        const raw = s.textContent?.trim();
        if (!raw) continue;
        const json = JSON.parse(raw);

        if (Array.isArray(json)) {
          for (const item of json) {
            const hit = extractJournalFromJsonLdObject(item);
            if (hit) return hit;
          }
        } else {
          const hit = extractJournalFromJsonLdObject(json);
          if (hit) return hit;
        }
      } catch (e) {}
    }
    return null;
  }

  function extractJournalFromHostSpecificDom() {
    const host = location.hostname.toLowerCase();

    const trySelectors = (selectors) => {
      for (const selector of selectors) {
        const nodes = safeQuerySelectorAll(selector);
        for (const node of nodes) {
          const text = cleanJournalName(node.innerText || node.textContent || "");
          if (text) return text;
        }
      }
      return null;
    };

    if (host.includes("pubs.acs.org")) {
      return trySelectors([
        ".issue-item_jour-name",
        ".article_header-journal",
        ".journalMetaVertical",
        ".breadcrumb-curr-item",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("wiley.com")) {
      return trySelectors([
        ".publication-title",
        ".epub-section__title",
        ".publicationContentTitle",
        ".breadcrumb__item",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("sciencedirect.com")) {
      return trySelectors([
        ".publication-title-link",
        ".anchor.js-publication-title",
        ".js-publication-title",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("springer.com")) {
      return trySelectors([
        '[data-test="journal-title"]',
        ".c-journal-title",
        ".app-journal-info__journal-title",
        ".c-article-identifiers__item",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("nature.com")) {
      return trySelectors([
        '[data-test="journal-title"]',
        ".app-journal-info__journal-title",
        ".c-article-info-details a",
        'a[data-track-label="journal link"]',
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("aps.org")) {
      return trySelectors([
        ".journal-title",
        ".logo__title",
        ".citation__title",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("aip.org") || host.includes("scitation.org")) {
      return trySelectors([
        ".publicationContentTitle",
        ".journal-meta-title",
        ".issue-info__title",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("iopscience.iop.org")) {
      return trySelectors([
        ".wd-jnl-title",
        ".publication-title",
        ".journal-home__title",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("cell.com")) {
      return trySelectors([
        ".journal-header__title",
        ".article-header__journal",
        ".article-tools__journal",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("pubs.rsc.org")) {
      return trySelectors([
        ".journal-title",
        ".capsule__title",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("academic.oup.com")) {
      return trySelectors([
        ".ww-citation-primary",
        ".citation-journal-title",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("tandfonline.com")) {
      return trySelectors([
        ".publication-title",
        ".journal-title",
        'a[href*="/toc/"]',
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("mdpi.com")) {
      return trySelectors([
        ".bib-identity .title",
        ".journal-name",
        'a[href*="/journal/"]'
      ]);
    }

    if (host.includes("cambridge.org")) {
      return trySelectors([
        ".journal-title",
        ".heading-title",
        'a[href*="/core/journals/"]'
      ]);
    }

    if (host.includes("sagepub.com")) {
      return trySelectors([
        ".publication-meta__title",
        ".journal-meta-title",
        'a[href*="/journal/"]'
      ]);
    }

    return null;
  }

  function extractJournalFromGenericDom() {
    const selectors = [
      ".journal-name",
      ".journal-title",
      ".publication-title",
      ".article-header__journal",
      ".citation-journal-title",
      ".issue-item_jour-name",
      ".breadcrumb-curr-item",
      '[data-test="journal-title"]',
      '[data-testid="journal-title"]',
      'a[href*="/journal/"]',
      'a[href*="/journals/"]',
      'a[href*="/toc/"]'
    ];

    for (const selector of selectors) {
      const nodes = safeQuerySelectorAll(selector);
      for (const node of nodes) {
        const text = cleanJournalName(node.innerText || node.textContent || "");
        if (!text) continue;
        if (text.length > 2 && text.length < 160) return text;
      }
    }
    return null;
  }

  function extractJournalFromPaperPilotSidebar() {
    const toolbox = document.getElementById(CONFIG.TOOLBOX_ID);
    if (toolbox) {
      const fields = toolbox.querySelectorAll(".toolbox-field");
      for (const field of fields) {
        const label = field.querySelector(".toolbox-label");
        if (!label) continue;

        const labelText = (label.textContent || "").trim().toLowerCase();
        if (!["journal", "期刊"].includes(labelText)) continue;

        const input = field.querySelector('input[type="text"]');
        const value = cleanJournalName(input?.value || input?.getAttribute("value") || "");
        if (value) return value;
      }
    }

    const candidates = safeQuerySelectorAll("aside, section, div");
    for (const node of candidates) {
      const txt = (node.innerText || "").trim();
      if (!txt) continue;
      if (txt.length > 1000) continue;

      let m = txt.match(/(?:^|\n)\s*(?:JOURNAL|Journal|期刊)\s*[\n:：]+\s*([^\n]+)/);
      if (m && m[1]) {
        const cleaned = cleanJournalName(m[1]);
        if (cleaned) return cleaned;
      }

      if (/Copy Journal/i.test(txt)) {
        const lines = txt.split("\n").map(s => s.trim()).filter(Boolean);
        for (let i = 0; i < lines.length; i++) {
          if (/^journal$/i.test(lines[i]) || /^期刊$/.test(lines[i])) {
            const next = cleanJournalName(lines[i + 1] || "");
            if (next) return next;
          }
        }
      }
    }

    return null;
  }

  function extractJournalFromCitationLine() {
    const text = document.body ? document.body.innerText : "";
    if (!text) return null;

    const patterns = [
      /\b(Adv\.\s*Funct\.\s*Mater\.)\s+\d{4}/i,
      /\b(Nat\.\s*Mater\.)\s+\d{4}/i,
      /\b(Nat\.\s*Nanotechnol\.)\s+\d{4}/i,
      /\b(Nat\.\s*Commun\.)\s+\d{4}/i,
      /\b(Nano\s*Lett\.)\s+\d{4}/i,
      /\b(ACS\s*Nano)\s+\d{4}/i,
      /\b(Acc\.\s*Chem\.\s*Res\.)\s+\d{4}/i,
      /\b(J\.\s*Am\.\s*Chem\.\s*Soc\.)\s+\d{4}/i,
      /\b(Phys\.\s*Rev\.\s*[A-Z]+)\s+\d{4}/i
    ];

    for (const re of patterns) {
      const m = text.match(re);
      if (m && m[1]) return cleanJournalName(m[1]);
    }
    return null;
  }

  function extractJournalFromTitleFallback() {
    const title = (document.title || "").trim();
    if (!title) return null;

    const separators = [" - ", " | ", " — ", " – "];
    for (const sep of separators) {
      if (!title.includes(sep)) continue;
      const parts = title.split(sep).map(s => s.trim()).filter(Boolean);
      if (parts.length < 2) continue;

      for (let i = parts.length - 1; i >= 0; i--) {
        const candidate = cleanJournalName(parts[i]);
        if (candidate) return candidate;
      }
    }

    return null;
  }

  function normalizeJournalAbbreviationToFullName(name) {
    if (!name) return null;

    const map = {
      "Adv. Funct. Mater.": "Advanced Functional Materials",
      "Adv Funct Mater": "Advanced Functional Materials",
      "Nat. Mater.": "Nature Materials",
      "Nat. Nanotechnol.": "Nature Nanotechnology",
      "Nat. Commun.": "Nature Communications",
      "Nano Lett.": "Nano Letters",
      "ACS Nano": "ACS Nano",
      "Acc. Chem. Res.": "Accounts of Chemical Research",
      "J. Am. Chem. Soc.": "Journal of the American Chemical Society",
      "Phys. Rev. Lett.": "Physical Review Letters",
      "Phys. Rev. B": "Physical Review B",
      "Appl. Phys. Lett.": "Applied Physics Letters",
      "J. Phys. Chem. Lett.": "The Journal of Physical Chemistry Letters",
      "Adv. Mater.": "Advanced Materials",
      "Small": "Small"
    };

    return map[name] || name;
  }

  function extractJournalRobust() {
    const result = (
      extractJournalFromMetaTags() ||
      extractJournalFromJsonLd() ||
      extractJournalFromHostSpecificDom() ||
      extractJournalFromGenericDom() ||
      extractJournalFromPaperPilotSidebar() ||
      extractJournalFromCitationLine() ||
      extractJournalFromTitleFallback() ||
      null
    );

    return normalizeJournalAbbreviationToFullName(result);
  }

  function isLikelyPdfUrl(url) {
    return /\.pdf(?:$|[?#])/i.test(url || "");
  }

  function ensureOnlyOneToolbox() {
    const existingToolbox = document.getElementById(CONFIG.TOOLBOX_ID);
    if (existingToolbox) {
      existingToolbox.remove();
      toolboxCreated = false;
    }
  }

  function resetDownloadCaches() {
    pdfProbeCache.clear();
    verifiedCandidateCache.clear();
    extractedPdfCache.clear();
  }

  function isRetryableHttpStatus(status) {
    return [408, 425, 429, 500, 502, 503, 504].includes(status);
  }

  function setLimitedCache(map, key, value, limit = CONFIG.DOWNLOAD_CACHE_LIMIT) {
    if (map.has(key)) map.delete(key);
    map.set(key, value);
    if (map.size > limit) {
      const oldestKey = map.keys().next().value;
      map.delete(oldestKey);
    }
  }

  function getPreferredPdfKey(doiValue) {
    const normalized = normalizeDoi(doiValue);
    return normalized ? `${VERIFIED_PDF_KEY_PREFIX}${normalized}` : null;
  }

  function getPreferredVerifiedPdf(doiValue) {
    const key = getPreferredPdfKey(doiValue);
    if (!key) return null;
    const cached = sessionStorage.getItem(key);
    return cached ? normalizePdfUrlForDownload(cached) : null;
  }

  function setPreferredVerifiedPdf(doiValue, pdfUrl) {
    const key = getPreferredPdfKey(doiValue);
    if (!key || !pdfUrl) return;
    sessionStorage.setItem(key, normalizePdfUrlForDownload(pdfUrl));
  }

  function initPageChangeListener() {
    if (history[HISTORY_PATCH_FLAG]) return;
    history[HISTORY_PATCH_FLAG] = true;

    let currentURL = location.href;
    const checkUrlChange = () => {
      if (location.href !== currentURL) {
        currentURL = location.href;
        ensureOnlyOneToolbox();
        resetDownloadCaches();
      }
    };

    window.addEventListener("popstate", checkUrlChange);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(this, arguments);
      checkUrlChange();
    };

    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      checkUrlChange();
    };
  }

  initPageChangeListener();

  function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      element.style.transition = "none";
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      const nextTop = element.offsetTop - pos2;
      const nextLeft = element.offsetLeft - pos1;
      const maxTop = Math.max(8, window.innerHeight - element.offsetHeight - 8);
      const maxLeft = Math.max(8, window.innerWidth - element.offsetWidth - 8);

      element.style.top = `${Math.min(Math.max(8, nextTop), maxTop)}px`;
      element.style.left = `${Math.min(Math.max(8, nextLeft), maxLeft)}px`;
      element.style.right = "auto";
      element.style.transform = "none";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      element.style.transition = "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)";
      localStorage.setItem(TOOLBOX_POS_KEY, JSON.stringify({
        top: element.style.top
      }));
    }
  }

  function getRightEdgeOffset() {
    return window.innerWidth <= 720 ? 12 : 20;
  }

  function pinToolboxToRight(element) {
    element.style.right = `${getRightEdgeOffset()}px`;
    element.style.left = "auto";
    element.style.transform = "none";
  }

  function onGlobalKeydown(e) {
    if (e.key === "Escape" && typeof activeCloseToolbox === "function") {
      activeCloseToolbox();
    }
  }

  document.addEventListener("keydown", onGlobalKeydown);

  async function fetchWithRetry(url, options = {}, retries = CONFIG.MAX_RETRIES) {
    for (let i = 0; i <= retries; i++) {
      let timeoutId = null;
      try {
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), CONFIG.LOAD_TIMEOUT);
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) return response;

        const err = new Error(`HTTP ${response.status}`);
        err.nonRetryable = !isRetryableHttpStatus(response.status);
        throw err;
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);
        if (i === retries || error.nonRetryable) throw error;
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (i + 1)));
      }
    }
  }

  async function copyText(text, fallbackInput = null) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      if (!fallbackInput) return false;
      fallbackInput.select();
      try {
        return document.execCommand("Copy");
      } catch (e) {
        return false;
      }
    }
  }

  function createStyleSheet() {
    if (styleSheet) return styleSheet;

    const existing = document.getElementById(CONFIG.TOOLBOX_STYLE_ID);
    if (existing) {
      styleSheet = existing;
      return styleSheet;
    }

    styleSheet = document.createElement("style");
    styleSheet.id = CONFIG.TOOLBOX_STYLE_ID;

    styleSheet.textContent = `
      :root {
        --jw-primary: #0f6d5f;
        --jw-primary-hover: #0a594d;
        --jw-primary-soft: rgba(15, 109, 95, 0.12);
        --jw-bg: rgba(252, 253, 251, 0.96);
        --jw-border: rgba(15, 34, 28, 0.10);
        --jw-text: #182522;
        --jw-muted: #5d716b;
        --jw-input-bg: #f4f7f6;
        --jw-header-bg: linear-gradient(180deg, rgba(15, 109, 95, 0.10), rgba(15, 109, 95, 0));
        --jw-shadow: 0 14px 30px rgba(0,0,0,0.13), 0 3px 12px rgba(0,0,0,0.07);
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --jw-primary: #71dbc8;
          --jw-primary-hover: #91e9da;
          --jw-primary-soft: rgba(113, 219, 200, 0.12);
          --jw-bg: rgba(18, 24, 23, 0.96);
          --jw-border: rgba(167, 222, 214, 0.18);
          --jw-text: #def0ed;
          --jw-muted: #9ebdb7;
          --jw-input-bg: rgba(255, 255, 255, 0.05);
          --jw-header-bg: linear-gradient(180deg, rgba(113, 219, 200, 0.16), rgba(113, 219, 200, 0));
          --jw-shadow: 0 14px 30px rgba(0,0,0,0.34), 0 3px 12px rgba(0,0,0,0.22);
        }
      }

      .toolbox-container {
        z-index: 2147483646;
        position: fixed;
        right: 20px;
        top: 18vh;
        width: min(296px, calc(100vw - 24px));
        max-width: 296px;
        background: var(--jw-bg);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid var(--jw-border);
        box-shadow: var(--jw-shadow);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        font-family: "Microsoft YaHei UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Segoe UI", sans-serif !important;
        color: var(--jw-text);
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .toolbox-container.minimized {
        width: 182px;
      }

      .toolbox-container.minimized .toolbox-content {
        display: none;
      }

      @media (max-width: 720px) {
        .toolbox-container {
          right: 12px;
          top: 12px;
          width: min(286px, calc(100vw - 24px));
          max-width: none;
        }

        .toolbox-content {
          max-height: 70vh;
        }
      }

      .toolbox-header {
        background: var(--jw-header-bg);
        color: var(--jw-primary);
        padding: 11px 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        font-size: 14px;
        cursor: grab;
        border-bottom: 1px solid var(--jw-border);
        line-height: 1.35;
      }

      .toolbox-header:active {
        cursor: grabbing;
      }

      .toolbox-header span {
        color: var(--jw-text) !important;
        font-weight: 800;
        letter-spacing: 0.2px;
      }

      .toolbox-controls {
        display: flex;
        gap: 8px;
      }

      .toolbox-btn-icon {
        background: transparent !important;
        border: none !important;
        color: var(--jw-text) !important;
        opacity: 0.55;
        font-size: 14px !important;
        cursor: pointer !important;
        padding: 2px 6px !important;
        border-radius: 7px !important;
        transition: all 0.18s ease !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toolbox-btn-icon:hover {
        opacity: 1;
        background: var(--jw-input-bg) !important;
      }

      .toolbox-content {
        padding: 12px;
        max-height: 74vh;
        overflow-y: auto;
      }

      .toolbox-content::-webkit-scrollbar {
        width: 6px;
      }

      .toolbox-content::-webkit-scrollbar-thumb {
        background: var(--jw-border);
        border-radius: 4px;
      }

      .toolbox {
        font-size: 13px !important;
        font-family: inherit !important;
        color: inherit !important;
        line-height: 1.45 !important;
      }

      .toolbox-section-title {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.45px;
        color: var(--jw-muted);
        text-transform: uppercase;
        margin: 2px 0 8px;
        padding-left: 2px;
      }

      .toolbox-field {
        background: var(--jw-input-bg);
        border: 1px solid var(--jw-border);
        border-radius: 11px;
        padding: 8px;
        margin-bottom: 10px;
      }

      .toolbox-label {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.3px;
        color: var(--jw-muted);
        margin-bottom: 6px;
        text-transform: uppercase;
      }

      .toolbox-meta {
        display: flex;
        gap: 6px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .toolbox-chip {
        border: 1px solid var(--jw-border);
        background: var(--jw-input-bg);
        border-radius: 999px;
        font-size: 11px;
        color: var(--jw-muted);
        padding: 4px 8px;
        line-height: 1.25;
        font-weight: 700;
      }

      input.toolbox[type=text], textarea.toolbox {
        width: 100% !important;
        padding: 8px 10px !important;
        border: 1px solid transparent !important;
        border-radius: 9px !important;
        background: rgba(255,255,255,0.82) !important;
        color: var(--jw-text) !important;
        transition: all 0.18s ease !important;
        margin-bottom: 8px !important;
        box-sizing: border-box !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        line-height: 1.45 !important;
        letter-spacing: 0.08px;
      }

      input.toolbox[type=text]:focus, textarea.toolbox:focus {
        outline: none !important;
        border-color: var(--jw-primary) !important;
        background: rgba(255,255,255,0.96) !important;
      }

      .toolbox-data-input {
        font-family: inherit !important;
      }

      .toolbox-data-doi {
        font-family: "Cascadia Code", "JetBrains Mono", Consolas, "Courier New", monospace !important;
        font-size: 12.3px !important;
        font-weight: 600 !important;
        letter-spacing: 0.03px;
      }

      input.toolbox[type=button].toolbox-copy-btn {
        width: 100% !important;
        height: 33px !important;
        padding: 0 10px !important;
        background: rgba(15, 109, 95, 0.10) !important;
        color: var(--jw-primary) !important;
        border-radius: 9px !important;
        border: 1px solid rgba(15, 109, 95, 0.22) !important;
        cursor: pointer !important;
        font-weight: 800 !important;
        transition: all 0.18s ease !important;
        margin: 0 !important;
        text-align: center;
      }

      input.toolbox[type=button].toolbox-copy-btn:hover {
        background: var(--jw-primary) !important;
        color: #fff !important;
        transform: translateY(-1px);
        box-shadow: 0 6px 14px rgba(15, 109, 95, 0.20) !important;
      }

      .toolbox-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-top: 4px;
      }

      .toolbox-action {
        width: 100% !important;
        min-width: 0;
        height: 38px;
        padding: 0 10px !important;
        box-sizing: border-box;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 10px;
        font-size: 12px !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        letter-spacing: 0.1px;
        text-decoration: none !important;
        user-select: none;
        cursor: pointer;
        transition: all 0.18s ease;
      }

      .toolbox-action::before {
        content: attr(data-icon);
        width: 18px;
        height: 18px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 900;
        line-height: 1;
        flex-shrink: 0;
      }

      .toolbox-action-primary {
        background: rgba(15, 109, 95, 0.12) !important;
        color: var(--jw-primary) !important;
        border: 1px solid rgba(15, 109, 95, 0.22) !important;
      }

      .toolbox-action-primary::before {
        background: rgba(15, 109, 95, 0.16);
        border: 1px solid rgba(15, 109, 95, 0.22);
      }

      .toolbox-action-primary:hover {
        background: var(--jw-primary) !important;
        color: #ffffff !important;
        box-shadow: 0 8px 16px rgba(15, 109, 95, 0.22) !important;
        transform: translateY(-1px);
      }

      .toolbox-action-primary:hover::before {
        background: rgba(255,255,255,0.20);
        border-color: rgba(255,255,255,0.26);
      }

      .toolbox-action-ghost {
        color: var(--jw-primary) !important;
        border: 1px solid rgba(15, 109, 95, 0.20);
        background: rgba(15, 109, 95, 0.07);
      }

      .toolbox-action-ghost::before {
        background: rgba(15, 109, 95, 0.10);
        border: 1px solid rgba(15, 109, 95, 0.18);
      }

      .toolbox-action-ghost:hover {
        background: rgba(15, 109, 95, 0.12) !important;
        transform: translateY(-1px);
      }

      .toolbox-action-download {
        grid-column: 1 / -1;
        height: 42px;
        font-size: 12.8px !important;
        border-radius: 11px;
        background: linear-gradient(180deg, rgba(15,109,95,0.18), rgba(15,109,95,0.12)) !important;
        border: 1px solid rgba(15,109,95,0.30) !important;
        box-shadow: 0 7px 16px rgba(15,109,95,0.10);
        margin-top: 2px;
      }

      .toolbox-action-download::before {
        width: 19px;
        height: 19px;
        font-size: 11px;
        background: rgba(15,109,95,0.20);
        border: 1px solid rgba(15,109,95,0.28);
      }

      .toolbox-action-download:hover {
        background: var(--jw-primary) !important;
        color: #fff !important;
        box-shadow: 0 10px 20px rgba(15,109,95,0.24) !important;
      }

      .toolbox-action-download:hover::before {
        background: rgba(255,255,255,0.22);
        border-color: rgba(255,255,255,0.28);
      }

      .toolbox-action-wide {
        grid-column: 1 / -1;
      }

      .toolbox-action:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }

      button.toolbox-action {
        appearance: none;
        -webkit-appearance: none;
      }

      .toolbox-bib {
        resize: vertical;
        display: none !important;
        width: 100% !important;
        min-height: 92px !important;
        margin-top: 10px !important;
        margin-bottom: 0 !important;
        border-radius: 10px !important;
      }

      .flash-success {
        background-color: rgba(40, 167, 69, 0.12) !important;
        border-color: rgba(40, 167, 69, 0.45) !important;
        color: #155724 !important;
      }

      @media (prefers-color-scheme: dark) {
        .flash-success {
          background-color: rgba(40, 167, 69, 0.18) !important;
          color: #a3cfbb !important;
        }
      }
    `;

    return styleSheet;
  }

  function getCrudeDOI() {
    try {
      const l = location.pathname.match(/(^.+doi\/)([^/]+\/)?(10\.[^/]+\/[^/]+)/);
      if (l !== null) {
        const d = normalizeDoi(l[l.length - 1]);
        if (!d) return [null, null];
        const isWiley = location.hostname.includes("wiley.com");
        const pdfSuffix = isWiley ? "epdf/" : "pdf/";
        return [d, l[1] + pdfSuffix + d];
      }

      if (location.hostname.includes("springer.com")) {
        const springerMatch = location.pathname.match(/^\/article\/(10\.[^/]+\/.+)$/i);
        if (springerMatch) {
          const springerDoi = normalizeDoi(decodeURIComponent(springerMatch[1]));
          if (springerDoi) {
            const encodedDoi = encodeURIComponent(springerDoi);
            return [springerDoi, `/content/pdf/${encodedDoi}.pdf`];
          }
        }
      }

      if (location.hostname.includes("pubs.aip.org")) {
        const aipMatch = location.pathname.match(/\/([^/]+)\/([^/]+)\/article\/([^/]+)\/([^/]+)\/([^/]+)(?:\/(.+))?/);
        if (aipMatch) {
          const [, publisher, journal, volume, issue, articleId, doiPart] = aipMatch;
          let parsedDoi = doiPart ? `10.${publisher}/${doiPart}` : (safeQuerySelector('meta[name="citation_doi"]')?.getAttribute("content"));
          parsedDoi = normalizeDoi(parsedDoi);
          if (parsedDoi) {
            const pdfPath = `/${publisher}/${journal}/article-pdf/${volume}/${issue}/${articleId}/${parsedDoi.replace("10." + publisher + "/", "")}`;
            return [parsedDoi, pdfPath];
          }
        }
      }

      if (location.hostname.includes("arxiv.org")) {
        const id = extractArxivId(location.href);
        if (id) return [null, `/pdf/${id}.pdf`];
      }

      return [null, null];
    } catch (error) {
      return [null, null];
    }
  }

  const [doiCrude, pdfPathname] = getCrudeDOI();
  let jump = sessionStorage.getItem("%" + doiCrude) === null && sessionStorage.getItem(location.pathname) === null;

  if (doiCrude !== null) {
    sessionStorage.setItem("%" + doiCrude, "1");

    if (jump && location.pathname !== pdfPathname) {
      const shortcutSites = [
        "acs", "aps", "wiley", "tandfonline", "sagepub", "annualreviews", "liebertpub",
        "physiology", "ahajournals", "acm", "royalsocietypublishing", "psychiatryonline",
        "thieme", "worldscientific", "nejm", "ascopubs", "cdnsciencepub", "asm", "science",
        "pnas", "aip", "iop", "iopscience", "springer", "nature", "jps", "oup", "scitation",
        "mdpi", "degruyter", "epj"
      ];

      if (shortcutSites.some(a => location.hostname.includes(a))) {
        location.pathname = pdfPathname;
      }
    } else {
      new Promise(checkLoaded).then(loadMeta);
    }
  } else {
    sessionStorage.setItem(location.pathname, "1");

    if (location.hostname.includes(".apa.")) {
      new Promise(checkAPALoaded).then(loadMeta);
    } else if (isScholarLikeHost()) {
      new Promise(checkGoogleScholarLoaded).then(() => {});
    } else if (location.hostname.includes("x-mol.com")) {
      new Promise(checkXMolLoaded).then(loadXMol);
    } else {
      new Promise(checkLoaded).then(loadMeta);
    }
  }

  function checkLoaded(resolve) {
    function check() {
      document.body !== null && document.body.innerHTML.length !== 0 ? resolve() : setTimeout(check, 100);
    }
    check();
  }

  function checkAPALoaded(resolve) {
    let count = 0;
    function check() {
      const main = document.querySelector("main");
      (main !== null && main.offsetHeight > 300) ? resolve() : (++count < 30 ? setTimeout(check, 1000) : null);
    }
    check();
  }

  function checkGoogleScholarLoaded(resolve) {
    let count = 0;
    function check() {
      const loaded = hasScholarLikeResults();
      loaded ? resolve() : (++count < 30 ? setTimeout(check, 600) : resolve());
    }
    check();
  }

  function checkXMolLoaded(resolve) {
    let count = 0;
    function check() {
      safeQuerySelectorAll(".paper-item").length > 0 ? resolve() : (++count < 30 ? setTimeout(check, 1000) : resolve());
    }
    check();
  }

  function loadMeta() {
    try {
      arxivId = null;
      const currentIsPdf = isLikelyPdfUrl(location.href);
      const metaList = document.getElementsByTagName("meta");

      for (const meta of metaList) {
        const n = (meta.getAttribute("name") || meta.getAttribute("property") || "").toLowerCase();
        const content = meta.getAttribute("content");
        if (!content) continue;

        if (tit === null && ["dc.title", "citation_title", "wkhealth_title", "og:title"].includes(n)) {
          tit = cleanTitle(content);
        }

        if (
          doi === null &&
          ["citation_doi", "dc.identifier", "dc.source", "prism.doi", "og:doi"].includes(n) &&
          content.includes("10.")
        ) {
          doi = normalizeDoi(content.includes("doi") ? content.slice(content.indexOf("10.")) : content);
        }

        if (pdf === null && ["citation_pdf_url", "wkhealth_pdf_url"].includes(n)) {
          pdf = content;
        }

        if (year === null && ["citation_year", "dc.date", "citation_date"].includes(n)) {
          year = content;
        }

        if (
          publication === null &&
          [
            "citation_journal_title",
            "citation_journal_abbrev",
            "prism.publicationname",
            "citation_source",
            "dc.source"
          ].includes(n)
        ) {
          publication = cleanJournalName(content);
        }

        if (arxivId === null && ["citation_arxiv_id", "arxiv_id"].includes(n)) {
          arxivId = content.trim();
        }
      }

      if (tit === null) {
        tit = extractTitleRobust();
      }

      if (publication === null) {
        publication = validateJournalCandidate(extractJournalRobust());
      } else {
        publication = validateJournalCandidate(publication) || validateJournalCandidate(extractJournalRobust());
      }

      if (arxivId === null && location.hostname.includes("arxiv.org")) {
        arxivId = extractArxivId(location.href);
      }

      if (publication === null && location.hostname.includes("arxiv.org")) {
        publication = "arXiv";
      }

      if (doi === null) {
        doi = extractDoiRobust();
      }

      if (jump && location.hostname.includes("sciencedirect")) if (loadElsevierPDF()) return;

      if (pdf !== null && location.hostname.includes(".apa.")) {
        try {
          const url = new URL(pdf);
          url.search = "";
          pdf = url.toString();
        } catch (e) {}
      }

      if (jump && location.hostname.includes("pubs.aip.org")) if (loadAIPPDF()) return;
      if (jump && location.hostname.includes("iopscience.iop.org")) if (loadIOPPDF()) return;
      if (jump && location.hostname.includes("nature.com")) if (loadNaturePDF()) return;
      if (jump && location.hostname.includes("springer.com")) if (loadSpringerPDF()) return;

      if (jump && pdf !== null && location.href !== pdf) {
        location.href = pdf;
      } else {
        const fallbackPdf = pdf || pdfPathname || (currentIsPdf ? location.href : null);

        if (doi === null) {
          doi = normalizeDoi(doiCrude);
          const allowWithoutDoi = Boolean(fallbackPdf) || location.hostname.includes("arxiv.org");
          if (doi === null && !allowWithoutDoi) return;
        }

        toolbox(
          tit || document.title || "Unknown Title",
          doi,
          fallbackPdf,
          year || "Unknown Year",
          publication || "Unknown Journal"
        );
      }
    } catch (error) {
      const safeDoi = normalizeDoi(doiCrude);
      if (safeDoi) {
        toolbox("Unknown Title", safeDoi, pdfPathname, "Unknown Year", publication || "Unknown Journal");
      } else if (isLikelyPdfUrl(location.href)) {
        toolbox(document.title || "Unknown Title", null, location.href, "Unknown Year", publication || "Unknown Journal");
      }
    }
  }

  function newinput(parent, type, value, onclick, readonly = true) {
    const i = document.createElement("input");
    i.type = type;
    i.value = value;
    i.className = "toolbox";
    if (type === "text" && readonly) i.readOnly = true;
    if (onclick) i.addEventListener("click", onclick, false);
    parent.appendChild(i);
    return i;
  }

  function newtag(parent, tag, text) {
    const i = document.createElement(tag);
    if (text !== null && text !== undefined) i.textContent = text;
    i.className = "toolbox";
    parent.appendChild(i);
    return i;
  }

  function sanitizeFileName(name) {
    let safe = (name || "document.pdf")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
      .replace(/\s+/g, " ")
      .trim();

    if (!/\.pdf$/i.test(safe)) safe += ".pdf";
    return safe;
  }

  function getFileNameFromUrl(url, doi, title, publication, year, arxivValue = null) {
    try {
      if (doi) {
        return sanitizeFileName(doi.replace(/[\/\\:]+/g, "_") + ".pdf");
      }

      if (arxivValue) {
        return sanitizeFileName(`arXiv_${arxivValue}.pdf`);
      }

      if (title) {
        const prefix = [];
        if (publication && publication !== "Unknown Publication" && publication !== "Unknown Journal") prefix.push(publication);
        if (year && year !== "Unknown Year") prefix.push(year);
        prefix.push(title);
        return sanitizeFileName(prefix.join(" - ").slice(0, 160) + ".pdf");
      }

      const u = new URL(url, location.href);
      const pathname = u.pathname || "";
      let name = pathname.substring(pathname.lastIndexOf("/") + 1);

      if (!name || !/\.pdf$/i.test(name)) {
        name = "paper_" + Date.now() + ".pdf";
      }

      return sanitizeFileName(decodeURIComponent(name));
    } catch (e) {
      return "paper_" + Date.now() + ".pdf";
    }
  }

  function normalizePdfUrlForDownload(pdfUrl) {
    if (!pdfUrl || typeof pdfUrl !== "string") return pdfUrl;

    try {
      const u = new URL(pdfUrl, location.href);
      const host = u.hostname.toLowerCase();

      if (host.includes("wiley.com") && /^\/doi\/epdf\//i.test(u.pathname)) {
        u.pathname = u.pathname.replace(/^\/doi\/epdf\//i, "/doi/pdfdirect/");
        if (!u.searchParams.has("download")) u.searchParams.set("download", "true");
        return u.toString();
      }

      if (host.includes("wiley.com") && /^\/doi\/pdf\//i.test(u.pathname)) {
        if (!u.searchParams.has("download")) u.searchParams.set("download", "true");
        return u.toString();
      }

      return u.toString();
    } catch (e) {
      return pdfUrl;
    }
  }

  function pushUniqueUrl(list, rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") return;
    const normalized = normalizePdfUrlForDownload(rawUrl).split("#")[0];
    if (normalized && !list.includes(normalized)) list.push(normalized);
  }

  function applyPathTransforms(baseUrl, transforms, outputList) {
    for (const [from, to] of transforms) {
      try {
        const u = new URL(baseUrl, location.href);
        if (!u.pathname.includes(from)) continue;

        if (to === "/content/pdf/" && u.hostname.toLowerCase().includes("springer.com")) {
          const tail = u.pathname.replace(/^\/article\//i, "");
          if (tail) {
            pushUniqueUrl(outputList, `${u.origin}/content/pdf/${tail}.pdf`);
          }
          continue;
        }

        const transformed = u.toString().replace(from, to);
        pushUniqueUrl(outputList, transformed);
      } catch (e) {}
    }
  }

  function applyHostSpecificTransforms(baseUrl, host, outputList) {
    for (const item of HOST_SPECIFIC_TRANSFORMS) {
      if (!item.hostIncludes.some(h => host.includes(h))) continue;
      applyPathTransforms(baseUrl, item.rules, outputList);
    }
  }

  function addHostSpecificExtraCandidates(baseUrl, host, outputList) {
    try {
      const u = new URL(baseUrl, location.href);

      if (host.includes("nature.com") && /\/articles\//i.test(u.pathname) && !/\.pdf$/i.test(u.pathname)) {
        pushUniqueUrl(outputList, `${u.origin}${u.pathname}.pdf`);
      }

      if (host.includes("springer.com") && /\/article\//i.test(u.pathname)) {
        const tail = u.pathname.replace(/^\/article\//i, "");
        pushUniqueUrl(outputList, `${u.origin}/content/pdf/${tail}.pdf`);
      }

      if (host.includes("sciencedirect.com") && /\/science\/article\/pii\//i.test(u.pathname)) {
        pushUniqueUrl(outputList, `${u.origin}${u.pathname}/pdfft`);
      }

      if (host.includes("arxiv.org")) {
        if (/^\/abs\//i.test(u.pathname)) {
          const id = u.pathname.replace(/^\/abs\//i, "");
          if (id) {
            pushUniqueUrl(outputList, `${u.origin}/pdf/${id}`);
            pushUniqueUrl(outputList, `${u.origin}/pdf/${id}.pdf`);
          }
        }

        if (/^\/pdf\//i.test(u.pathname) && !/\.pdf$/i.test(u.pathname)) {
          pushUniqueUrl(outputList, `${u.origin}${u.pathname}.pdf`);
        }
      }
    } catch (e) {}
  }

  function extractPdfUrlsFromDocument(limit = 24) {
    const cacheKey = `${location.href}::${limit}`;
    if (extractedPdfCache.has(cacheKey)) return extractedPdfCache.get(cacheKey);

    const urls = [];

    const metaSelectors = [
      'meta[name="citation_pdf_url"]',
      'meta[name="wkhealth_pdf_url"]',
      'meta[property="og:pdf"]'
    ];

    for (const selector of metaSelectors) {
      const meta = safeQuerySelector(selector);
      const content = meta && meta.getAttribute("content");
      pushUniqueUrl(urls, content);
      if (urls.length >= limit) {
        const frozen = Object.freeze([...urls]);
        setLimitedCache(extractedPdfCache, cacheKey, frozen);
        return frozen;
      }
    }

    const links = safeQuerySelectorAll("a[href]");
    for (const a of links) {
      const href = a.getAttribute("href") || "";
      const lowerHref = href.toLowerCase();
      if (!lowerHref) continue;

      const looksLikePdf =
        lowerHref.includes("/pdf") ||
        lowerHref.includes("pdfdirect") ||
        lowerHref.includes("pdfft") ||
        /\.pdf(?:$|[?#])/i.test(lowerHref) ||
        lowerHref.includes("download=true");

      if (!looksLikePdf) continue;

      try {
        const absolute = new URL(href, location.href).toString();
        pushUniqueUrl(urls, absolute);
      } catch (e) {}

      if (urls.length >= limit) break;
    }

    const frozen = Object.freeze([...urls]);
    setLimitedCache(extractedPdfCache, cacheKey, frozen);
    return frozen;
  }

  function getCandidateScore(rawUrl, doiValue = null) {
    try {
      const u = new URL(rawUrl, location.href);
      const host = u.hostname.toLowerCase();
      const path = u.pathname.toLowerCase();
      const full = u.toString().toLowerCase();
      let score = 0;

      if (host === location.hostname.toLowerCase()) score += 8;
      if (/\.pdf(?:$|[?#])/i.test(full)) score += 85;
      if (path.includes("/doi/pdfdirect/")) score += 95;
      if (host === "doi.org" || host.endsWith(".doi.org")) score += 32;
      if (full.includes("download=true")) score += 20;
      if (path.includes("/pdfft")) score += 80;
      if (path.includes("/article-pdf/")) score += 70;
      if (host.includes("arxiv.org") && /^\/pdf\/.+\.pdf$/i.test(path)) score += 90;
      if (host.includes("arxiv.org") && /^\/abs\//i.test(path)) score -= 80;
      if (path.includes("/content/pdf/")) score += 72;
      if (path.includes("/pdf/")) score += 45;
      if (path.includes("/pdf")) score += 20;
      if (path.includes("/epdf/")) score -= 120;
      if (path.includes("/full/")) score -= 40;
      if (path.includes("/fulltext/")) score -= 45;
      if (path.includes("/abstract") || path.includes("/abs/")) score -= 35;

      if (doiValue) {
        const doiLower = doiValue.toLowerCase();
        if (full.includes(doiLower)) score += 18;
        const encodedDoi = encodeURIComponent(doiValue).toLowerCase();
        if (full.includes(encodedDoi)) score += 14;
      }

      return score;
    } catch (e) {
      return -999;
    }
  }

  function sortCandidatesByPriority(candidates, doiValue = null) {
    return candidates
      .map((url, index) => ({
        url,
        index,
        score: getCandidateScore(url, doiValue)
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.index - b.index;
      })
      .map(item => item.url);
  }

  function buildPdfCandidates(pdfUrl, doiValue = null) {
    const candidates = [];
    const seedUrl = (pdfUrl && typeof pdfUrl === "string") ? pdfUrl : location.href;

    const arxivPreferred = getArxivPreferredPdfUrl(arxivId, seedUrl);
    if (arxivPreferred) {
      pushUniqueUrl(candidates, arxivPreferred);
    }

    pushUniqueUrl(candidates, seedUrl);

    const preferredVerified = getPreferredVerifiedPdf(doiValue);
    if (preferredVerified) {
      pushUniqueUrl(candidates, preferredVerified);
    }

    const normalizedDoi = normalizeDoi(doiValue);
    if (normalizedDoi) {
      pushUniqueUrl(candidates, `https://doi.org/${normalizedDoi}`);
      pushUniqueUrl(candidates, `https://dx.doi.org/${normalizedDoi}`);
    }

    try {
      const u = new URL(seedUrl, location.href);
      const host = u.hostname.toLowerCase();
      const path = u.pathname;

      applyHostSpecificTransforms(u.toString(), host, candidates);
      addHostSpecificExtraCandidates(u.toString(), host, candidates);
      applyPathTransforms(u.toString(), COMMON_PATH_TRANSFORMS, candidates);

      if (host.includes("sciencedirect.com") && /\/science\/article\/pii\//i.test(path)) {
        const pdfftUrl = `${u.origin}${path}/pdfft`;
        pushUniqueUrl(candidates, pdfftUrl);
      }
    } catch (e) {}

    const extracted = extractPdfUrlsFromDocument();
    for (const foundUrl of extracted) {
      pushUniqueUrl(candidates, foundUrl);
    }

    if (/\.pdf(?:[?#].*)?$/i.test(location.href)) {
      pushUniqueUrl(candidates, location.href);
    }

    const sorted = sortCandidatesByPriority(candidates, doiValue);
    return sorted.slice(0, CONFIG.MAX_PDF_CANDIDATES);
  }

  async function probePdfUrl(url) {
    if (pdfProbeCache.has(url)) return pdfProbeCache.get(url);

    try {
      const headResponse = await fetchWithRetry(url, {
        method: "HEAD",
        credentials: "include",
        headers: {
          "Accept": "application/pdf,*/*;q=0.8"
        }
      }, 1);

      const headType = (headResponse.headers.get("content-type") || "").toLowerCase();
      const disposition = (headResponse.headers.get("content-disposition") || "").toLowerCase();
      if (headType.includes("application/pdf") || disposition.includes(".pdf")) {
        setLimitedCache(pdfProbeCache, url, "pdf");
        return "pdf";
      }
      if (headType.includes("text/html")) {
        setLimitedCache(pdfProbeCache, url, "html");
        return "html";
      }
    } catch (e) {}

    try {
      const response = await fetchWithRetry(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/pdf,*/*;q=0.8",
          "Range": "bytes=0-0"
        }
      }, 1);

      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      if (contentType.includes("application/pdf")) {
        setLimitedCache(pdfProbeCache, url, "pdf");
        return "pdf";
      }
      if (contentType.includes("text/html")) {
        setLimitedCache(pdfProbeCache, url, "html");
        return "html";
      }
      setLimitedCache(pdfProbeCache, url, "unknown");
      return "unknown";
    } catch (e) {
      setLimitedCache(pdfProbeCache, url, "unknown");
      return "unknown";
    }
  }

  async function probeCandidateStates(candidates, stopAfterVerified = Infinity) {
    const states = new Array(candidates.length);
    let cursor = 0;
    let verifiedCount = 0;

    const worker = async () => {
      while (true) {
        if (verifiedCount >= stopAfterVerified) break;
        const idx = cursor;
        cursor += 1;
        if (idx >= candidates.length) break;
        const state = await probePdfUrl(candidates[idx]);
        states[idx] = state;
        if (state === "pdf") verifiedCount += 1;
      }
    };

    const workerCount = Math.min(CONFIG.MAX_PROBE_CONCURRENCY, candidates.length);
    const workers = [];
    for (let i = 0; i < workerCount; i++) workers.push(worker());
    await Promise.all(workers);
    return states;
  }

  async function getVerifiedDownloadCandidates(pdfUrl, doiValue = null) {
    const cacheKey = `${location.href}::${pdfUrl || ""}::${doiValue || ""}`;
    if (verifiedCandidateCache.has(cacheKey)) return verifiedCandidateCache.get(cacheKey);

    const allCandidates = buildPdfCandidates(pdfUrl, doiValue);
    const limitedCandidates = allCandidates.slice(0, CONFIG.MAX_PDF_CANDIDATES);
    const pdfCandidates = [];
    const unknownCandidates = [];

    const states = await probeCandidateStates(limitedCandidates, CONFIG.MAX_VERIFIED_CANDIDATES);
    for (let i = 0; i < limitedCandidates.length; i++) {
      const candidate = limitedCandidates[i];
      const state = states[i];
      if (state === "pdf") {
        pdfCandidates.push(candidate);
      } else if (state === "unknown") {
        unknownCandidates.push(candidate);
      }
    }

    const finalCandidates = pdfCandidates.length > 0 ? pdfCandidates : unknownCandidates;
    const result = {
      candidates: finalCandidates,
      checkedCount: limitedCandidates.length,
      verifiedCount: pdfCandidates.length
    };

    setLimitedCache(verifiedCandidateCache, cacheKey, result);
    return result;
  }

  function getBestDownloadUrl(pdfUrl, doiValue = null) {
    const candidates = buildPdfCandidates(pdfUrl, doiValue);
    return candidates.length > 0 ? candidates[0] : null;
  }

  async function triggerPdfDownload({ pdfUrl, doi, title, publication, year, arxivId, btn }) {
    if (!btn) return;

    btn.textContent = "Checking...";
    btn.disabled = true;

    const verifyResult = await getVerifiedDownloadCandidates(pdfUrl, doi);
    const finalCandidates = verifyResult.candidates;

    if (!finalCandidates.length) {
      btn.textContent = "No PDF";
      setTimeout(() => {
        btn.textContent = "Download PDF";
        btn.disabled = false;
      }, 1800);
      return;
    }

    if (verifyResult.verifiedCount > 0) {
      btn.textContent = `Ready (${verifyResult.verifiedCount} verified)`;
    } else {
      btn.textContent = `Ready (${verifyResult.checkedCount} checked)`;
    }

    let flowFinished = false;

    const tryDownload = (index) => {
      if (flowFinished) return;
      const finalUrl = finalCandidates[index];
      const fileName = getFileNameFromUrl(finalUrl, doi, title, publication, year, arxivId);

      btn.textContent = `Downloading ${index + 1}/${finalCandidates.length}`;

      let attemptSettled = false;

      const moveToNextOrFail = (timeout = false) => {
        if (flowFinished || attemptSettled) return;
        attemptSettled = true;

        if (index + 1 < finalCandidates.length) {
          tryDownload(index + 1);
          return;
        }

        flowFinished = true;
        btn.textContent = timeout ? "Timeout" : "Failed";
        setTimeout(() => {
          btn.textContent = "Download PDF";
          btn.disabled = false;
        }, 1800);
      };

      GM_download({
        url: finalUrl,
        name: fileName,
        saveAs: true,
        onload: () => {
          if (flowFinished || attemptSettled) return;
          attemptSettled = true;
          flowFinished = true;
          setPreferredVerifiedPdf(doi, finalUrl);
          btn.textContent = verifyResult.verifiedCount > 0 ? "Saved (Verified)" : "Saved";
          setTimeout(() => {
            btn.textContent = "Download PDF";
            btn.disabled = false;
          }, 1500);
        },
        onerror: (err) => {
          console.error("GM_download error:", err, "url:", finalUrl);
          moveToNextOrFail(false);
        },
        ontimeout: () => {
          moveToNextOrFail(true);
        }
      });
    };

    try {
      tryDownload(0);
    } catch (e) {
      console.error("Download failed:", e);
      btn.textContent = "Failed";
      setTimeout(() => {
        btn.textContent = "Download PDF";
        btn.disabled = false;
      }, 1800);
    }
  }

  function toolbox(tit, doi, pdf, year, publication) {
    if (isScholarLikeHost()) return;

    ensureOnlyOneToolbox();
    if (toolboxCreated) return;
    toolboxCreated = true;

    const div = document.createElement("div");
    div.id = CONFIG.TOOLBOX_ID;
    div.className = "toolbox-container";

    const styles = createStyleSheet();
    if (!document.head.contains(styles)) document.head.appendChild(styles);

    const savedPos = localStorage.getItem(TOOLBOX_POS_KEY);
    if (savedPos) {
      try {
        const pos = JSON.parse(savedPos);
        if (pos && pos.top) div.style.top = pos.top;

        const topNum = parseFloat(div.style.top);
        if (!Number.isNaN(topNum)) {
          const maxTop = Math.max(8, window.innerHeight - 60);
          div.style.top = `${Math.min(Math.max(8, topNum), maxTop)}px`;
        }
      } catch (e) {}
    }

    pinToolboxToRight(div);

    const header = document.createElement("div");
    header.className = "toolbox-header";
    header.title = "Press and hold to drag";

    const titleEl = document.createElement("span");
    titleEl.textContent = "Paper Pilot";

    const controls = document.createElement("div");
    controls.className = "toolbox-controls";

    const minBtn = document.createElement("button");
    minBtn.className = "toolbox-btn-icon";
    minBtn.innerHTML = "—";
    minBtn.title = "Minimize";
    minBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      div.classList.toggle("minimized");
    });

    const closeBtn = document.createElement("button");
    closeBtn.className = "toolbox-btn-icon";
    closeBtn.innerHTML = "✕";
    closeBtn.title = "Close (ESC)";
    const closeToolbox = () => {
      if (!document.body.contains(div)) return;
      window.removeEventListener("resize", handleResize);
      div.remove();
      toolboxCreated = false;
      if (activeCloseToolbox === closeToolbox) activeCloseToolbox = null;
    };

    const handleResize = () => {
      pinToolboxToRight(div);
      const topNum = parseFloat(div.style.top);
      if (!Number.isNaN(topNum)) {
        const maxTop = Math.max(8, window.innerHeight - 60);
        div.style.top = `${Math.min(Math.max(8, topNum), maxTop)}px`;
      }
    };
    window.addEventListener("resize", handleResize);

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeToolbox();
    });
    activeCloseToolbox = closeToolbox;

    controls.appendChild(minBtn);
    controls.appendChild(closeBtn);
    header.appendChild(titleEl);
    header.appendChild(controls);
    div.appendChild(header);

    makeDraggable(div, header);

    const content = document.createElement("div");
    content.className = "toolbox-content";
    div.appendChild(content);

    const triggerFlash = (element) => {
      element.classList.add("flash-success");
      setTimeout(() => element.classList.remove("flash-success"), 800);
    };

    const createSectionTitle = (text) => {
      const el = document.createElement("div");
      el.className = "toolbox-section-title";
      el.textContent = text;
      return el;
    };

    const createCopyBlock = (label, textToCopy) => {
      if (!textToCopy) return;

      const block = document.createElement("div");
      block.className = "toolbox-field";

      const labelEl = document.createElement("div");
      labelEl.className = "toolbox-label";
      labelEl.textContent = label;
      block.appendChild(labelEl);

      const input = newinput(block, "text", textToCopy, () => input.select());
      input.classList.add("toolbox-data-input");
      if (label === "DOI") input.classList.add("toolbox-data-doi");
      input.title = `Click to select ${label}`;

      const btn = newinput(block, "button", `Copy ${label}`);
      btn.classList.add("toolbox-copy-btn");

      btn.addEventListener("click", () => {
        const originalText = `Copy ${label}`;
        const onSuccess = () => {
          triggerFlash(input);
          btn.value = "✅ Copied!";
          setTimeout(() => btn.value = originalText, 1800);
        };

        const onFailure = () => {
          btn.value = "Copy Failed";
          setTimeout(() => btn.value = originalText, 1800);
        };

        copyText(textToCopy, input).then(ok => (ok ? onSuccess() : onFailure()));
      });

      content.appendChild(block);
    };

    const meta = document.createElement("div");
    meta.className = "toolbox-meta";

    if (year && year !== "Unknown Year") {
      const yearChip = document.createElement("span");
      yearChip.className = "toolbox-chip";
      yearChip.textContent = `Year · ${year}`;
      meta.appendChild(yearChip);
    }

    if (publication && publication !== "Unknown Publication" && publication !== "Unknown Journal") {
      const pubChip = document.createElement("span");
      pubChip.className = "toolbox-chip";
      pubChip.textContent = publication;
      meta.appendChild(pubChip);
    }

    if (meta.childElementCount > 0) content.appendChild(meta);

    content.appendChild(createSectionTitle("Citation"));
    if (publication) createCopyBlock("Journal", publication);
    createCopyBlock("DOI", doi);
    createCopyBlock("ArXiv ID", arxivId);
    if (tit) createCopyBlock("Title", tit);

    const txt_bib = newtag(content, "textarea", null);
    txt_bib.classList.add("toolbox-bib");
    txt_bib.readOnly = true;

    content.appendChild(createSectionTitle("Quick Actions"));

    const actions = document.createElement("div");
    actions.className = "toolbox-actions";
    content.appendChild(actions);

    let resolvedPdf = pdf;
    if (resolvedPdf === null && location.hostname.includes("sciencedirect") && doi) {
      resolvedPdf = sessionStorage.getItem(doi);
    }
    resolvedPdf = getBestDownloadUrl(resolvedPdf, doi);

    let pdflink = null;
    if (resolvedPdf) {
      pdflink = newtag(actions, "a", "Open PDF");
      pdflink.classList.add("toolbox-action", "toolbox-action-ghost");
      pdflink.setAttribute("data-icon", "P");
      pdflink.href = resolvedPdf;
      pdflink.target = "_blank";
    }

    if (pdflink) {
      getVerifiedDownloadCandidates(resolvedPdf, doi)
        .then(result => {
          if (!result || !result.candidates || !result.candidates.length) return;
          if (!document.body.contains(div)) return;
          const best = result.candidates[0];
          if (best && pdflink.href !== best) {
            pdflink.href = best;
            pdflink.title = result.verifiedCount > 0 ? "Open verified PDF" : "Open best candidate";
          }
          if (result.verifiedCount > 0) {
            setPreferredVerifiedPdf(doi, best);
          }
        })
        .catch(() => {});
    }

    const scihublink = newtag(actions, "a", "Sci-Hub");
    scihublink.classList.add("toolbox-action", "toolbox-action-ghost");
    scihublink.setAttribute("data-icon", "S");
    scihublink.target = "_blank";
    scihublink.href = CONFIG.SCIHUB_URL + (doi ? doi : encodeURIComponent(location.href));

    const btn_bib = newtag(actions, "button", "BibTeX");
    btn_bib.classList.add("toolbox", "toolbox-action", "toolbox-action-primary");
    btn_bib.setAttribute("data-icon", "B");

    if (!doi) {
      btn_bib.disabled = true;
      btn_bib.title = "DOI unavailable";
    }

    btn_bib.addEventListener("click", async () => {
      if (!doi) return;
      btn_bib.disabled = true;
      btn_bib.textContent = "Loading...";

      try {
        const res = await fetchWithRetry("https://dx.doi.org/" + doi, {
          headers: { "Accept": "application/x-bibtex" }
        });
        const data = await res.text();
        txt_bib.value = data;
        txt_bib.style.display = "block";

        const onSuccess = () => {
          triggerFlash(txt_bib);
          btn_bib.textContent = "Copied";
          setTimeout(() => {
            btn_bib.textContent = "BibTeX";
            btn_bib.disabled = false;
          }, 1800);
        };

        const copied = await copyText(data, txt_bib);
        if (copied) {
          onSuccess();
        } else {
          btn_bib.textContent = "Copy Failed";
          setTimeout(() => {
            btn_bib.textContent = "BibTeX";
            btn_bib.disabled = false;
          }, 1800);
        }
      } catch (e) {
        btn_bib.textContent = "Failed";
        setTimeout(() => {
          btn_bib.textContent = "BibTeX";
          btn_bib.disabled = false;
        }, 1800);
      }
    });

    const rislink = newtag(actions, "a", "RIS");
    rislink.classList.add("toolbox-action", "toolbox-action-primary");
    rislink.setAttribute("data-icon", "R");
    if (!doi) {
      rislink.setAttribute("aria-disabled", "true");
      rislink.title = "DOI unavailable";
      rislink.style.pointerEvents = "none";
      rislink.style.opacity = "0.65";
    }

    rislink.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!doi || rislink.dataset.loading === "1") return;

      const originalText = rislink.innerText;
      rislink.dataset.loading = "1";
      rislink.innerText = "Loading...";

      try {
        const res = await fetchWithRetry("https://dx.doi.org/" + doi, {
          headers: { "Accept": "application/x-research-info-systems" }
        });
        const data = await res.text();
        const url = URL.createObjectURL(new Blob([data], { type: "octet/stream" }));
        const tempA = document.createElement("a");
        tempA.href = url;
        tempA.download = doi.replace(/[\/\\:]+/g, "_") + ".ris";
        tempA.style.display = "none";
        document.body.appendChild(tempA);
        tempA.click();
        tempA.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);

        rislink.innerText = "Downloaded";
        setTimeout(() => {
          rislink.innerText = originalText;
          delete rislink.dataset.loading;
        }, 1800);
      } catch (err) {
        rislink.innerText = "Failed";
        setTimeout(() => {
          rislink.innerText = originalText;
          delete rislink.dataset.loading;
        }, 1800);
      }
    });

    if (resolvedPdf) {
      const downloadBtn = newtag(actions, "button", "Download PDF");
      downloadBtn.classList.add("toolbox-action", "toolbox-action-primary", "toolbox-action-download");
      downloadBtn.setAttribute("data-icon", "↓");
      downloadBtn.addEventListener("click", () => {
        triggerPdfDownload({
          pdfUrl: resolvedPdf,
          doi,
          title: tit,
          publication,
          year,
          arxivId,
          btn: downloadBtn
        });
      });
    } else {
      scihublink.classList.add("toolbox-action-wide");
    }

    document.body.appendChild(div);

    setTimeout(() => {
      try {
        const refreshedJournal = validateJournalCandidate(extractJournalRobust());
        const refreshedTitle = extractTitleRobust();

        const needRefreshJournal = (!publication || publication === "Unknown Journal") && !!refreshedJournal;
        const needRefreshTitle = (!tit || tit === "Unknown Title") && !!refreshedTitle;

        if (needRefreshJournal || needRefreshTitle) {
          const oldToolbox = document.getElementById(CONFIG.TOOLBOX_ID);
          if (oldToolbox) oldToolbox.remove();
          toolboxCreated = false;
          toolbox(
            needRefreshTitle ? refreshedTitle : tit,
            doi,
            pdf,
            year,
            needRefreshJournal ? refreshedJournal : publication
          );
        }
      } catch (e) {}
    }, 1200);
  }

  function loadElsevierPDF() {
    const pdfLink = safeQuerySelector(".pdf-download-btn") || safeQuerySelector('a.link-button-primary[href*="/pdffile/"]');
    if (pdfLink && pdfLink.href) {
      location.href = pdfLink.href;
      return true;
    }
    return false;
  }

  function loadAIPPDF() {
    const pdfLink = safeQuerySelector("a.al-link.pdf") || safeQuerySelector('a[href*="/pdf/"]');
    if (pdfLink && pdfLink.href) {
      location.href = pdfLink.href;
      return true;
    }
    return false;
  }

  function loadIOPPDF() {
    const pdfLink = safeQuerySelector("a.wd-jnl-art-pdf") || safeQuerySelector('a[href*="/pdf/"]');
    if (pdfLink && pdfLink.href) {
      location.href = pdfLink.href;
      return true;
    }
    return false;
  }

  function loadNaturePDF() {
    const pdfLink = safeQuerySelector("a.c-pdf__button") || safeQuerySelector('a[data-track-action="download pdf"]');
    if (pdfLink && pdfLink.href) {
      location.href = pdfLink.href;
      return true;
    }
    return false;
  }

  function loadSpringerPDF() {
    const selectors = [
      'a[data-track-action="Pdf download"]',
      'a[data-track-action="PDF download"]',
      ".c-pdf-download__link",
      'a[data-test="pdf-link"]',
      'a[title*="PDF"]',
      'a[href*="/content/pdf/"]',
      'a[href*=".pdf"]'
    ];

    for (const selector of selectors) {
      const pdfLink = safeQuerySelector(selector);
      if (pdfLink && pdfLink.href) {
        location.href = pdfLink.href;
        return true;
      }
    }

    const springerDoi = extractDoiRobust() || normalizeDoi(decodeURIComponent((location.pathname.match(/^\/article\/(10\.[^/]+\/.+)$/i) || [])[1] || ""));
    if (springerDoi) {
      const fallbackPdf = `${location.origin}/content/pdf/${encodeURIComponent(springerDoi)}.pdf`;
      location.href = fallbackPdf;
      return true;
    }

    return false;
  }

  function loadGoogleScholar() {
    return;
  }

  function loadXMol() {
    try {
      const first = safeQuerySelector('.paper-item a[href]');
      if (first && first.href) {
        location.href = first.href;
      } else {
        loadMeta();
      }
    } catch (e) {
      loadMeta();
    }
  }

})();