// ==UserScript==
// @name         Better Scholar
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Google Scholar UI 优化版：年份/来源/被引标签、按引用/按年份排序、来源筛选、状态记忆、CSS order 无损排序、无闪烁初始化、缓存清理（稳定增强版）。
// @author       ChatGPT
// @match        *://scholar.google.com/*
// @match        *://scholar.google.cz/*
// @match        *://scholar.google.co.jp/*
// @grant        none
// @license      MIT
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================
    // 早期预初始化：降低首次闪烁
    // =========================================================
    (function installEarlyBootStyle() {
        try {
            const html = document.documentElement;
            if (html) html.classList.add('bs-preinit');

            const style = document.createElement('style');
            style.id = 'bs-early-boot-style';
            style.textContent = `
                html.bs-preinit #gs_res_ccl_mid {
                    opacity: 0.001;
                }
                html.bs-ready #gs_res_ccl_mid {
                    opacity: 1;
                    transition: opacity 0.12s ease;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        } catch (_) {}
    })();

    // =========================================================
    // 常量
    // =========================================================
    const STORAGE_PREFIX = 'better-scholar-pro:v10';
    const MAX_STORAGE_ENTRIES = 20;
    const FOLD_THRESHOLD = 9;
    const REFRESH_DEBOUNCE = 140;
    const URL_FALLBACK_INTERVAL = 1200;

    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
    });

    // =========================================================
    // 全局状态
    // =========================================================
    const state = {
        observer: null,
        observerAttached: false,
        isInternalUpdating: false,
        refreshTimer: null,
        saveTimer: null,
        routeHooked: false,
        urlWatchTimer: null,

        lastUrl: location.href,
        lastQueryKey: '',
        lastResultSetKey: '',
        lastArticleSignature: '',
        lastSourceSignature: '',

        currentSortType: 'default',
        currentExpanded: false,
        sourceFilterState: new Map(),

        initRetryCount: 0,
        initialized: false
    };

    // =========================================================
    // 基础工具
    // =========================================================
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showReady() {
        try {
            const html = document.documentElement;
            if (!html) return;
            html.classList.remove('bs-preinit');
            html.classList.add('bs-ready');
        } catch (_) {}
    }

    function withInternalUpdate(fn) {
        state.isInternalUpdating = true;
        try {
            fn();
        } finally {
            requestAnimationFrame(() => {
                state.isInternalUpdating = false;
            });
        }
    }

    function debounceRefresh(forcePanel = false) {
        clearTimeout(state.refreshTimer);
        state.refreshTimer = setTimeout(() => {
            refreshPage(forcePanel);
        }, REFRESH_DEBOUNCE);
    }

    function cleanupStorage(maxEntries = MAX_STORAGE_ENTRIES) {
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
            if (keys.length <= maxEntries) return;

            const items = keys.map(key => {
                try {
                    const raw = localStorage.getItem(key);
                    const data = JSON.parse(raw || '{}');
                    return {
                        key,
                        updatedAt: Number(data.updatedAt || 0)
                    };
                } catch (_) {
                    return { key, updatedAt: 0 };
                }
            });

            items.sort((a, b) => b.updatedAt - a.updatedAt);
            items.slice(maxEntries).forEach(item => {
                try {
                    localStorage.removeItem(item.key);
                } catch (_) {}
            });
        } catch (_) {}
    }

    // =========================================================
    // DOM 获取
    // =========================================================
    function getResultsContainer() {
        return document.getElementById('gs_res_ccl_mid');
    }

    function getSidebar() {
        return document.getElementById('gs_bdy_sb_in') || document.getElementById('gs_bdy_sb');
    }

    function getToolbar() {
        return document.querySelector('#gs_ab_md');
    }

    function isResultArticle(el) {
        return !!(
            el &&
            el.nodeType === 1 &&
            el.classList &&
            el.classList.contains('gs_r') &&
            el.classList.contains('gs_or') &&
            el.classList.contains('gs_scl')
        );
    }

    function getScholarArticles() {
        const container = getResultsContainer();
        if (!container) return [];
        return Array.from(container.children).filter(isResultArticle);
    }

    // =========================================================
    // 样式注入
    // =========================================================
    function injectStyles() {
        if (document.getElementById('bs-pro-styles')) return;

        const style = document.createElement('style');
        style.id = 'bs-pro-styles';
        style.textContent = `
            :root {
                --bs-bg: #ffffff;
                --bs-panel-bg: #fafbfc;
                --bs-border: #e3e7eb;
                --bs-border-strong: #d7dde3;
                --bs-text: #202124;
                --bs-text-secondary: #5f6368;
                --bs-blue: #1a73e8;
                --bs-blue-soft: #e8f0fe;
                --bs-hover: #f3f6f9;
                --bs-tag-bg: #f1f3f4;
                --bs-tag-text: #5f6368;
                --bs-venue-bg: #eef3f7;
                --bs-venue-text: #415466;
                --bs-cite-bg: #f6efe4;
                --bs-cite-text: #8a5a12;
                --bs-cite-strong-bg: #fce8e6;
                --bs-cite-strong-text: #c5221f;
                --bs-shadow: 0 1px 2px rgba(60, 64, 67, 0.08);
            }

            #gs_res_ccl_mid.bs-order-mode {
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            #gs_res_ccl_mid.bs-order-mode > .gs_r.gs_or.gs_scl {
                width: 100%;
            }

            .bs-meta-tags {
                display: inline-flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 6px;
                margin-left: 8px;
                vertical-align: middle;
                pointer-events: none;
                user-select: none;
            }

            .bs-tag {
                display: inline-flex;
                align-items: center;
                height: 20px;
                padding: 0 8px;
                border-radius: 999px;
                font-size: 11px;
                line-height: 20px;
                white-space: nowrap;
                font-family: Arial, Roboto, sans-serif;
                border: 1px solid transparent;
                box-sizing: border-box;
                pointer-events: none;
            }

            .bs-tag-year {
                background: var(--bs-tag-bg);
                color: var(--bs-tag-text);
                border-color: #e5e7ea;
                font-weight: 600;
            }

            .bs-tag-venue {
                background: var(--bs-venue-bg);
                color: var(--bs-venue-text);
                border-color: #dde5ec;
                font-weight: 500;
                max-width: 220px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .bs-tag-cites {
                background: var(--bs-cite-bg);
                color: var(--bs-cite-text);
                border-color: #eed9b6;
                font-weight: 600;
            }

            .bs-tag-cites.bs-cites-strong {
                background: var(--bs-cite-strong-bg);
                color: var(--bs-cite-strong-text);
                border-color: #f2b8b5;
            }

            #bs-sort-wrap {
                display: inline-flex;
                align-items: center;
                margin-left: 14px;
                border: 1px solid var(--bs-border-strong);
                border-radius: 999px;
                overflow: hidden;
                background: var(--bs-panel-bg);
                vertical-align: middle;
                box-shadow: var(--bs-shadow);
            }

            .bs-sort-btn {
                border: none;
                background: transparent;
                color: var(--bs-text-secondary);
                font-size: 12px;
                padding: 6px 12px;
                cursor: pointer;
                transition: background 0.15s ease, color 0.15s ease;
                line-height: 1;
            }

            .bs-sort-btn:hover {
                background: var(--bs-hover);
                color: var(--bs-text);
            }

            .bs-sort-btn.active {
                background: var(--bs-blue-soft);
                color: var(--bs-blue);
                font-weight: 600;
            }

            #bs-source-panel {
                margin-top: 14px;
                padding-top: 14px;
                border-top: 1px solid #ebebeb;
            }

            #bs-source-panel-title {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin: 0 12px 10px 16px;
                gap: 10px;
            }

            #bs-source-panel-left {
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            #bs-source-panel-left .bs-title-main {
                font-size: 13px;
                color: var(--bs-text-secondary);
                font-weight: 600;
                line-height: 1.2;
            }

            #bs-filter-summary {
                font-size: 11px;
                color: #7b8187;
                line-height: 1.2;
            }

            #bs-source-actions {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 8px;
                flex: 0 0 auto;
            }

            .bs-link-btn {
                color: var(--bs-blue);
                cursor: pointer;
                font-size: 11px;
                user-select: none;
                line-height: 1.2;
            }

            .bs-link-btn:hover {
                text-decoration: underline;
            }

            #bs-source-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .bs-source-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 0 8px;
                padding: 6px 8px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.15s ease;
                gap: 8px;
            }

            .bs-source-item:hover {
                background: var(--bs-hover);
            }

            .bs-source-left {
                display: flex;
                align-items: center;
                min-width: 0;
                flex: 1;
                gap: 8px;
            }

            .bs-source-left input[type="checkbox"] {
                margin: 0;
                flex: 0 0 auto;
            }

            .bs-source-name {
                font-size: 12px;
                color: var(--bs-text);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .bs-source-count {
                flex: 0 0 auto;
                min-width: 22px;
                text-align: center;
                padding: 1px 7px;
                border-radius: 999px;
                background: #f1f3f4;
                color: #5f6368;
                font-size: 10px;
                font-weight: 700;
                line-height: 16px;
            }

            #bs-source-more {
                display: none;
                margin: 8px 0 0 24px;
                color: var(--bs-blue);
                font-size: 12px;
                cursor: pointer;
                user-select: none;
            }

            #bs-source-more:hover {
                text-decoration: underline;
            }

            .gs_r.gs_or.gs_scl.bs-hidden-by-filter {
                display: none !important;
            }

            #bs-toast {
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 99999;
                background: rgba(32, 33, 36, 0.92);
                color: #fff;
                border-radius: 10px;
                padding: 10px 14px;
                font-size: 12px;
                line-height: 1.4;
                box-shadow: 0 6px 18px rgba(0,0,0,0.18);
                opacity: 0;
                transform: translateY(8px);
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease;
                font-family: Arial, Roboto, sans-serif;
            }

            #bs-toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;

        (document.head || document.documentElement).appendChild(style);

        if (!document.getElementById('bs-toast') && document.body) {
            const toast = document.createElement('div');
            toast.id = 'bs-toast';
            document.body.appendChild(toast);
        }
    }

    function ensureToast() {
        if (!document.body) return;
        if (document.getElementById('bs-toast')) return;
        const toast = document.createElement('div');
        toast.id = 'bs-toast';
        document.body.appendChild(toast);
    }

    function showToast(message) {
        ensureToast();
        const toast = document.getElementById('bs-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, 1500);
    }

    // =========================================================
    // 存储
    // =========================================================
    function getQueryKey() {
        const url = new URL(location.href);
        const q = (url.searchParams.get('q') || '').trim();
        const scisbd = (url.searchParams.get('scisbd') || '').trim();
        const asSdt = (url.searchParams.get('as_sdt') || '').trim();
        const hl = (url.searchParams.get('hl') || '').trim();
        return `${url.hostname}|q=${q}|scisbd=${scisbd}|as_sdt=${asSdt}|hl=${hl}`;
    }

    function getStorageKey() {
        return `${STORAGE_PREFIX}|${getQueryKey()}`;
    }

    function loadPersistedState() {
        state.currentSortType = 'default';
        state.currentExpanded = false;
        state.sourceFilterState = new Map();

        try {
            const raw = localStorage.getItem(getStorageKey());
            if (!raw) return;

            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object') return;

            if (['default', 'citations', 'year'].includes(data.sortType)) {
                state.currentSortType = data.sortType;
            }

            state.currentExpanded = !!data.expanded;

            if (data.filters && typeof data.filters === 'object') {
                state.sourceFilterState = new Map(Object.entries(data.filters));
            }
        } catch (_) {}
    }

    function savePersistedState() {
        try {
            const data = {
                updatedAt: Date.now(),
                sortType: state.currentSortType,
                expanded: state.currentExpanded,
                filters: Object.fromEntries(state.sourceFilterState)
            };
            localStorage.setItem(getStorageKey(), JSON.stringify(data));
            cleanupStorage();
        } catch (_) {}
    }

    function scheduleSaveState() {
        clearTimeout(state.saveTimer);
        state.saveTimer = setTimeout(savePersistedState, 150);
    }

    // =========================================================
    // Scholar 数据提取
    // =========================================================
    function getRawMetaText(infoNode) {
        if (!infoNode) return '';
        const clone = infoNode.cloneNode(true);
        clone.querySelectorAll('.bs-meta-tags').forEach(node => node.remove());
        return (clone.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function extractYear(text) {
        const raw = String(text || '');
        const matches = raw.match(/\b(?:19|20)\d{2}\b/g);
        if (!matches) return 0;

        const currentYear = new Date().getFullYear();
        const years = matches
            .map(v => parseInt(v, 10))
            .filter(y => y >= 1900 && y <= currentYear + 1);

        return years.length ? years[years.length - 1] : 0;
    }

    function looksLikeDomain(text) {
        return /\b[a-z0-9.-]+\.(com|org|net|edu|gov|io|ai|cn|uk|de|jp)\b/i.test(String(text || ''));
    }

    function cleanVenueText(text) {
        let v = String(text || '')
            .replace(/\.\.\./g, '')
            .replace(/\s+/g, ' ')
            .replace(/[;,]\s*$/, '')
            .trim();

        if (!v) return '未知来源';

        // 去掉明显的年份、卷期、页码尾巴
        v = v.replace(/\b(?:19|20)\d{2}\b.*$/, '').trim();
        v = v.replace(/\s+\d+\(\d+\)\s*$/, '').trim();
        v = v.replace(/\s+\d+\(\d+\):\d+(-\d+)?\s*$/, '').trim();
        v = v.replace(/\s+\d+:\d+(-\d+)?\s*$/, '').trim();
        v = v.replace(/\s+\d+\s*$/, '').trim();
        v = v.replace(/\s*,\s*$/, '').trim();

        if (!v) return '未知来源';
        if (looksLikeDomain(v)) return '未知来源';

        return v;
    }

    function extractVenue(text) {
        const raw = String(text || '').trim();
        if (!raw) return '未知来源';

        const parts = raw.split(/\s+-\s+/).map(s => s.trim()).filter(Boolean);
        if (parts.length < 2) return '未知来源';

        // Scholar 常见格式：
        // 作者 - 期刊/会议, 年份 - 来源站点
        // 优先取第二段作为来源候选
        let candidate = parts[1] || '';

        if (!candidate || looksLikeDomain(candidate)) {
            // 如果第二段异常，再尝试倒数第二段
            candidate = parts.length >= 2 ? parts[parts.length - 2] : '';
        }

        const cleaned = cleanVenueText(candidate);
        return cleaned || '未知来源';
    }

    function parseCitationCountFromText(text) {
        const t = String(text || '').replace(/\s+/g, ' ').trim();

        let m = t.match(/^Cited by\s+(\d+)$/i);
        if (m) return parseInt(m[1], 10);

        m = t.match(/^被引用(?:次数)?[:：]?\s*(\d+)$/i);
        if (m) return parseInt(m[1], 10);

        return null;
    }

    function getArticleCitations(article) {
        const links = Array.from(article.querySelectorAll('.gs_fl a'));
        if (!links.length) return 0;

        // 优先按 cites 参数识别
        for (const a of links) {
            const href = a.getAttribute('href') || '';
            if (/[?&]cites=/.test(href) || href.includes('/scholar?cites=')) {
                const text = (a.textContent || '').replace(/\s+/g, ' ').trim();
                const parsed = parseCitationCountFromText(text);
                if (parsed !== null) return parsed;

                const m = text.match(/(\d+)/);
                return m ? parseInt(m[1], 10) : 0;
            }
        }

        // 兜底：严格匹配文本
        for (const a of links) {
            const text = (a.textContent || '').replace(/\s+/g, ' ').trim();
            const parsed = parseCitationCountFromText(text);
            if (parsed !== null) return parsed;
        }

        return 0;
    }

    function getArticleTitle(article) {
        return (article.querySelector('h3.gs_rt')?.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function getArticleHref(article) {
        return article.querySelector('h3.gs_rt a')?.href || '';
    }

    function getArticleStableId(article, index) {
        const title = getArticleTitle(article);
        const href = getArticleHref(article);
        const meta = getRawMetaText(article.querySelector('.gs_a'));
        return `${href || title || `idx:${index}`}|${meta}`;
    }

    function getResultSetKey() {
        const url = new URL(location.href);
        const q = url.searchParams.get('q') || '';
        const start = url.searchParams.get('start') || '0';
        const ids = getScholarArticles()
            .map((article, index) => getArticleStableId(article, index))
            .sort(collator.compare);

        return `${url.pathname}|q=${q}|start=${start}|count=${ids.length}|${ids.join('||')}`;
    }

    function getArticleSignature() {
        const ids = getScholarArticles()
            .map((article, index) => {
                return [
                    getArticleStableId(article, index),
                    article.dataset.bsYear || '0',
                    article.dataset.bsCitations || '0',
                    article.dataset.bsVenue || ''
                ].join('|');
            })
            .sort(collator.compare);

        return ids.join('||');
    }

    function getSourceStats() {
        const stats = new Map();
        getScholarArticles().forEach(article => {
            const venue = article.dataset.bsVenue || '未知来源';
            stats.set(venue, (stats.get(venue) || 0) + 1);
        });
        return stats;
    }

    function getSourceSignature() {
        return JSON.stringify(
            Array.from(getSourceStats().entries()).sort((a, b) => {
                if (a[0] === b[0]) return 0;
                return collator.compare(a[0], b[0]);
            })
        );
    }

    // =========================================================
    // 标签渲染
    // =========================================================
    function buildMetaTagsHtml(year, venue, citations) {
        const citeClass = citations >= 1000 ? 'bs-tag bs-tag-cites bs-cites-strong' : 'bs-tag bs-tag-cites';
        const citeHtml = citations > 0
            ? `<span class="${citeClass}">被引 ${escapeHtml(citations)}</span>`
            : '';

        return `
            <span class="bs-tag bs-tag-year">${escapeHtml(year || '0')}</span>
            <span class="bs-tag bs-tag-venue" title="${escapeHtml(venue || '未知来源')}">${escapeHtml(venue || '未知来源')}</span>
            ${citeHtml}
        `;
    }

    // =========================================================
    // 排序核心：CSS order，无损排序
    // =========================================================
    function ensureOrderMode() {
        const container = getResultsContainer();
        if (!container) return;
        container.classList.add('bs-order-mode');
    }

    function refreshDefaultOrderIfNeeded() {
        const nextResultSetKey = getResultSetKey();
        const articles = getScholarArticles();

        if (nextResultSetKey !== state.lastResultSetKey) {
            articles.forEach(article => {
                delete article.dataset.bsDefaultOrder;
            });
            state.lastResultSetKey = nextResultSetKey;
            state.lastSourceSignature = '';
        }
    }

    function processArticle(article, index) {
        const infoNode = article.querySelector('.gs_a');
        if (!infoNode) return;

        const rawMeta = getRawMetaText(infoNode);
        const year = extractYear(rawMeta);
        const venue = extractVenue(rawMeta);
        const citations = getArticleCitations(article);

        article.dataset.bsYear = String(year || 0);
        article.dataset.bsVenue = venue || '未知来源';
        article.dataset.bsCitations = String(citations || 0);

        if (!article.dataset.bsDefaultOrder) {
            article.dataset.bsDefaultOrder = String(index);
        }

        let tagsWrap = infoNode.querySelector('.bs-meta-tags');
        const nextHtml = buildMetaTagsHtml(year, venue, citations);

        if (!tagsWrap) {
            tagsWrap = document.createElement('span');
            tagsWrap.className = 'bs-meta-tags';
            tagsWrap.innerHTML = nextHtml;
            infoNode.appendChild(tagsWrap);
        } else if (tagsWrap.innerHTML !== nextHtml) {
            tagsWrap.innerHTML = nextHtml;
        }
    }

    function compareTitle(a, b) {
        return collator.compare(getArticleTitle(a), getArticleTitle(b));
    }

    function sortArticles(sortType) {
        const articles = getScholarArticles();
        if (!articles.length) return;

        const sorted = [...articles];

        if (sortType === 'default') {
            sorted.sort((a, b) => {
                const ao = parseInt(a.dataset.bsDefaultOrder || '0', 10);
                const bo = parseInt(b.dataset.bsDefaultOrder || '0', 10);
                return ao - bo;
            });
        } else if (sortType === 'citations') {
            sorted.sort((a, b) => {
                const ac = parseInt(a.dataset.bsCitations || '0', 10);
                const bc = parseInt(b.dataset.bsCitations || '0', 10);
                if (bc !== ac) return bc - ac;

                const ay = parseInt(a.dataset.bsYear || '0', 10);
                const by = parseInt(b.dataset.bsYear || '0', 10);
                if (by !== ay) return by - ay;

                const tt = compareTitle(a, b);
                if (tt !== 0) return tt;

                const ao = parseInt(a.dataset.bsDefaultOrder || '0', 10);
                const bo = parseInt(b.dataset.bsDefaultOrder || '0', 10);
                return ao - bo;
            });
        } else if (sortType === 'year') {
            sorted.sort((a, b) => {
                const ay = parseInt(a.dataset.bsYear || '0', 10);
                const by = parseInt(b.dataset.bsYear || '0', 10);
                if (by !== ay) return by - ay;

                const ac = parseInt(a.dataset.bsCitations || '0', 10);
                const bc = parseInt(b.dataset.bsCitations || '0', 10);
                if (bc !== ac) return bc - ac;

                const tt = compareTitle(a, b);
                if (tt !== 0) return tt;

                const ao = parseInt(a.dataset.bsDefaultOrder || '0', 10);
                const bo = parseInt(b.dataset.bsDefaultOrder || '0', 10);
                return ao - bo;
            });
        }

        sorted.forEach((article, index) => {
            article.style.order = String(index);
        });
    }

    function applyCurrentSort() {
        ensureOrderMode();
        sortArticles(state.currentSortType);
        updateSortButtonState();
    }

    function setSortType(sortType, silent = false) {
        processAllArticles(false, true);
        state.currentSortType = sortType;
        applyCurrentSort();
        scheduleSaveState();

        if (!silent) {
            if (sortType === 'default') showToast('已恢复默认排序');
            if (sortType === 'citations') showToast('已按引用排序');
            if (sortType === 'year') showToast('已按年份排序');
        }
    }

    // =========================================================
    // 顶部排序按钮
    // =========================================================
    function updateSortButtonState() {
        document.querySelectorAll('.bs-sort-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sort === state.currentSortType);
        });
    }

    function createSortingButtons() {
        const toolbar = getToolbar();
        if (!toolbar) return;

        let wrap = document.getElementById('bs-sort-wrap');
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.id = 'bs-sort-wrap';

            const buttonConfigs = [
                { key: 'default', label: '默认排序' },
                { key: 'citations', label: '按引用' },
                { key: 'year', label: '按年份' }
            ];

            buttonConfigs.forEach(cfg => {
                const btn = document.createElement('button');
                btn.className = 'bs-sort-btn';
                btn.type = 'button';
                btn.dataset.sort = cfg.key;
                btn.textContent = cfg.label;

                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSortType(cfg.key);
                });

                wrap.appendChild(btn);
            });

            toolbar.appendChild(wrap);
        }

        updateSortButtonState();
    }

    // =========================================================
    // 来源筛选
    // =========================================================
    function ensureSourceFilterState() {
        const stats = getSourceStats();
        const nextState = new Map();

        Array.from(stats.keys()).forEach(source => {
            if (state.sourceFilterState.has(source)) {
                nextState.set(source, state.sourceFilterState.get(source));
            } else {
                nextState.set(source, true);
            }
        });

        state.sourceFilterState = nextState;
    }

    function updateFilterSummary() {
        const node = document.getElementById('bs-filter-summary');
        if (!node) return;

        const total = getScholarArticles().length;
        const visible = document.querySelectorAll('#gs_res_ccl_mid > .gs_r.gs_or.gs_scl:not(.bs-hidden-by-filter)').length;
        node.textContent = `显示 ${visible} / ${total}`;
    }

    function updateSourceActionText() {
        const cbs = Array.from(document.querySelectorAll('.bs-source-cb'));
        const allChecked = cbs.length > 0 && cbs.every(cb => cb.checked);
        const toggleNode = document.getElementById('bs-toggle-all');
        if (toggleNode) {
            toggleNode.textContent = allChecked ? '全不选' : '全选';
        }
    }

    function refreshSourceCounts() {
        const totalStats = getSourceStats();
        document.querySelectorAll('.bs-source-item').forEach(item => {
            const source = item.dataset.source || '';
            const countNode = item.querySelector('.bs-source-count');
            if (countNode) {
                countNode.textContent = String(totalStats.get(source) || 0);
            }
        });
    }

    function applySourceFilter() {
        getScholarArticles().forEach(article => {
            const venue = article.dataset.bsVenue || '未知来源';
            const visible = state.sourceFilterState.get(venue) !== false;
            article.classList.toggle('bs-hidden-by-filter', !visible);
        });

        refreshSourceCounts();
        updateSourceActionText();
        updateFilterSummary();
    }

    function syncCheckboxesFromState() {
        document.querySelectorAll('.bs-source-item').forEach(item => {
            const source = item.dataset.source || '';
            const cb = item.querySelector('.bs-source-cb');
            if (cb) {
                cb.checked = state.sourceFilterState.get(source) !== false;
            }
        });

        updateSourceActionText();
        updateFilterSummary();
    }

    function updateFoldState() {
        const items = Array.from(document.querySelectorAll('.bs-source-item'));
        const moreBtn = document.getElementById('bs-source-more');
        if (!items.length || !moreBtn) return;

        if (items.length <= FOLD_THRESHOLD) {
            items.forEach(item => item.style.display = 'flex');
            moreBtn.style.display = 'none';
            return;
        }

        items.forEach((item, index) => {
            item.style.display = (state.currentExpanded || index < FOLD_THRESHOLD) ? 'flex' : 'none';
        });

        moreBtn.style.display = 'block';
        moreBtn.textContent = state.currentExpanded ? '收起' : '展开更多';
    }

    function renderSourcePanel(force = false) {
        const sidebar = getSidebar();
        if (!sidebar) return;

        const nextSignature = getSourceSignature();
        let panel = document.getElementById('bs-source-panel');

        if (!force && panel && state.lastSourceSignature === nextSignature) {
            syncCheckboxesFromState();
            updateFoldState();
            return;
        }

        state.lastSourceSignature = nextSignature;

        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'bs-source-panel';
            panel.innerHTML = `
                <div id="bs-source-panel-title">
                    <div id="bs-source-panel-left">
                        <span class="bs-title-main">来源筛选</span>
                        <span id="bs-filter-summary">显示 0 / 0</span>
                    </div>
                    <div id="bs-source-actions">
                        <span class="bs-link-btn" id="bs-toggle-all">全不选</span>
                        <span class="bs-link-btn" id="bs-reset-filter">重置</span>
                    </div>
                </div>
                <div id="bs-source-list"></div>
                <div id="bs-source-more">展开更多</div>
            `;
            sidebar.appendChild(panel);

            panel.querySelector('#bs-toggle-all')?.addEventListener('click', () => {
                const values = Array.from(state.sourceFilterState.values());
                const allChecked = values.length > 0 && values.every(v => v === true);

                state.sourceFilterState.forEach((_, key) => {
                    state.sourceFilterState.set(key, !allChecked);
                });

                syncCheckboxesFromState();
                applySourceFilter();
                scheduleSaveState();
            });

            panel.querySelector('#bs-reset-filter')?.addEventListener('click', () => {
                state.sourceFilterState.forEach((_, key) => {
                    state.sourceFilterState.set(key, true);
                });

                syncCheckboxesFromState();
                applySourceFilter();
                scheduleSaveState();
                showToast('已重置来源筛选');
            });

            panel.querySelector('#bs-source-more')?.addEventListener('click', () => {
                state.currentExpanded = !state.currentExpanded;
                updateFoldState();
                scheduleSaveState();
            });
        }

        const list = document.getElementById('bs-source-list');
        if (!list) return;

        list.innerHTML = '';

        const stats = getSourceStats();
        const sources = Array.from(stats.entries()).sort((a, b) => {
            if (a[0] === '未知来源') return 1;
            if (b[0] === '未知来源') return -1;
            if (b[1] !== a[1]) return b[1] - a[1];
            return collator.compare(a[0], b[0]);
        });

        sources.forEach(([source, count], index) => {
            const item = document.createElement('label');
            item.className = 'bs-source-item';
            item.dataset.index = String(index);
            item.dataset.source = source;

            item.innerHTML = `
                <div class="bs-source-left">
                    <input class="bs-source-cb" type="checkbox" ${state.sourceFilterState.get(source) !== false ? 'checked' : ''}>
                    <span class="bs-source-name" title="${escapeHtml(source)}">${escapeHtml(source)}</span>
                </div>
                <span class="bs-source-count">${count}</span>
            `;

            const checkbox = item.querySelector('.bs-source-cb');
            checkbox?.addEventListener('change', () => {
                state.sourceFilterState.set(source, checkbox.checked);
                applySourceFilter();
                scheduleSaveState();
            });

            list.appendChild(item);
        });

        updateFoldState();
        updateSourceActionText();
        updateFilterSummary();
    }

    // =========================================================
    // 主处理链路
    // =========================================================
    function processAllArticles(forcePanel = false, skipPanel = false) {
        const articles = getScholarArticles();
        if (!articles.length) return false;

        withInternalUpdate(() => {
            ensureOrderMode();
            refreshDefaultOrderIfNeeded();

            articles.forEach((article, index) => {
                processArticle(article, index);
            });

            ensureSourceFilterState();
            createSortingButtons();

            if (!skipPanel) {
                renderSourcePanel(forcePanel);
            }

            applyCurrentSort();
            applySourceFilter();
        });

        state.lastArticleSignature = getArticleSignature();
        return true;
    }

    function refreshPage(forcePanel = false) {
        if (state.isInternalUpdating) return;

        const container = getResultsContainer();
        if (!container) return;

        const currentResultSetKey = getResultSetKey();
        const currentSignature = getArticleSignature();

        const needReprocess =
            forcePanel ||
            currentResultSetKey !== state.lastResultSetKey ||
            currentSignature !== state.lastArticleSignature ||
            location.href !== state.lastUrl;

        if (needReprocess) {
            state.lastUrl = location.href;
            processAllArticles(forcePanel, false);
        } else {
            createSortingButtons();
            renderSourcePanel(false);
            applyCurrentSort();
            applySourceFilter();
        }

        attachObserver();
        showReady();
    }

    // =========================================================
    // 监听器
    // =========================================================
    function disconnectObserver() {
        if (state.observer) state.observer.disconnect();
        state.observerAttached = false;
    }

    function attachObserver() {
        const parent = getResultsContainer();
        if (!parent) return;

        if (state.observerAttached) {
            const oldParent = state.observer?._bsParent;
            if (oldParent === parent) return;
            disconnectObserver();
        }

        state.observer = new MutationObserver((mutations) => {
            if (state.isInternalUpdating) return;

            const hasMeaningfulChange = mutations.some(m => {
                if (m.type !== 'childList') return false;
                return (m.addedNodes && m.addedNodes.length) || (m.removedNodes && m.removedNodes.length);
            });

            if (!hasMeaningfulChange) return;
            debounceRefresh(false);
        });

        state.observer.observe(parent, {
            childList: true,
            subtree: true
        });

        state.observer._bsParent = parent;
        state.observerAttached = true;
    }

    // =========================================================
    // 路由与 URL 变化
    // =========================================================
    function handleRouteChange() {
        const newUrl = location.href;
        const newQueryKey = getQueryKey();

        if (newUrl === state.lastUrl && newQueryKey === state.lastQueryKey) return;

        state.lastUrl = newUrl;
        state.lastQueryKey = newQueryKey;
        state.lastResultSetKey = '';
        state.lastArticleSignature = '';
        state.lastSourceSignature = '';

        loadPersistedState();

        setTimeout(() => {
            createSortingButtons();
            debounceRefresh(true);
        }, 120);
    }

    function hookRouteChanges() {
        if (state.routeHooked) return;
        state.routeHooked = true;

        const dispatchRouteChange = () => {
            window.dispatchEvent(new Event('bs:routechange'));
        };

        ['pushState', 'replaceState'].forEach(method => {
            const raw = history[method];
            if (typeof raw !== 'function') return;

            history[method] = function () {
                const result = raw.apply(this, arguments);
                setTimeout(dispatchRouteChange, 0);
                return result;
            };
        });

        window.addEventListener('popstate', dispatchRouteChange);
        window.addEventListener('hashchange', dispatchRouteChange);
        window.addEventListener('bs:routechange', handleRouteChange);
    }

    function startUrlFallbackWatcher() {
        if (state.urlWatchTimer) return;

        state.urlWatchTimer = setInterval(() => {
            if (location.href !== state.lastUrl || getQueryKey() !== state.lastQueryKey) {
                handleRouteChange();
            }
        }, URL_FALLBACK_INTERVAL);
    }

    // =========================================================
    // 初始化
    // =========================================================
    function init() {
        injectStyles();
        ensureToast();
        hookRouteChanges();
        startUrlFallbackWatcher();

        state.lastUrl = location.href;
        state.lastQueryKey = getQueryKey();
        loadPersistedState();

        const ok = processAllArticles(true, false);
        createSortingButtons();
        attachObserver();

        if (!ok) {
            state.initRetryCount += 1;
            if (state.initRetryCount <= 25) {
                setTimeout(init, 250);
                return;
            }
            showReady();
            return;
        }

        state.initialized = true;
        showReady();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();