/* =========================================================
   CVR Hesaplayıcı — uygulama mantığı
   Tek dosya, iki dil (sayfanın <html lang> özniteliğinden algılanır)
   ========================================================= */
(function () {
    'use strict';

    // ---------------------------------------------------------
    // Dil ve metinler
    // ---------------------------------------------------------
    const LANG = document.documentElement.lang === 'en' ? 'en' : 'tr';

    const STR = {
        tr: {
            item: 'Madde',
            expert: 'Uzman',
            deleteRow: function (n) { return 'Madde ' + n + ' satırını sil'; },
            deleteCol: function (n) { return 'Uzman ' + n + ' sütununu sil'; },
            rowDeleted: function (n) { return 'Madde ' + n + ' silindi'; },
            colDeleted: function (n) { return 'Uzman ' + n + ' silindi'; },
            cleared: 'Tüm puanlar temizlendi',
            exampleLoaded: 'Örnek veri yüklendi (8 madde × 6 uzman)',
            imported: function (r, c) { return r + ' madde × ' + c + ' uzman içe aktarıldı'; },
            cellsFilled: function (n) { return n + ' hücre dolduruldu'; },
            undo: 'Geri Al',
            undone: 'Geri alındı',
            copied: 'Tablo panoya kopyalandı — Excel’e yapıştırabilirsiniz',
            copyFailed: 'Kopyalama başarısız oldu, lütfen tekrar deneyin',
            nothingToCopy: 'Kopyalanacak veri yok — önce tabloya puan girin',
            noValidData: 'Geçerli veri bulunamadı (yalnızca 1, 2 ve 3 değerleri kabul edilir)',
            previewSize: function (r, c) { return r + ' madde × ' + c + ' uzman algılandı'; },
            previewInvalid: function (n) { return n + ' geçersiz değer yok sayılacak'; },
            limitReached: 'Sınıra ulaşıldı: en fazla 200 madde ve 40 uzman desteklenir',
            truncated: 'Veri kırpıldı: en fazla 200 madde × 40 uzman alındı',
            lawsheNote: function (n, v) {
                return 'N = <strong>' + n + '</strong> uzman için Lawshe minimum CVR eşiği: <strong>' + v + '</strong>';
            },
            lawsheFew: 'Lawshe eşik tablosu en az 5 uzman için tanımlıdır — CVR yorumlarken dikkatli olun.',
            lawsheMissing: function (n) {
                return 'N = <strong>' + n + '</strong> için Lawshe tablosunda birebir eşik yok; en yakın değerler için aşağıdaki CVR açıklamasına bakın.';
            },
            modelHint: {
                strict: '<strong>Katı model:</strong> yalnızca <strong>1 (Gerekli)</strong> yanıtı "gerekli" sayılır; 2 ve 3 "gerekli değil" kabul edilir.',
                lenient: '<strong>Esnek model:</strong> <strong>1 (Gerekli)</strong> ve <strong>2 (Yararlı ama gerekli değil)</strong> yanıtları "gerekli" sayılır; yalnızca 3 "gerekli değil" kabul edilir.'
            },
            badgeValid: 'Geçerli',
            badgeInvalid: 'Geçersiz',
            badgeExcellent: 'Mükemmel',
            badgePoor: 'Yetersiz'
        },
        en: {
            item: 'Item',
            expert: 'Expert',
            deleteRow: function (n) { return 'Delete item row ' + n; },
            deleteCol: function (n) { return 'Delete expert column ' + n; },
            rowDeleted: function (n) { return 'Item ' + n + ' deleted'; },
            colDeleted: function (n) { return 'Expert ' + n + ' deleted'; },
            cleared: 'All ratings cleared',
            exampleLoaded: 'Example data loaded (8 items × 6 experts)',
            imported: function (r, c) { return 'Imported ' + r + ' items × ' + c + ' experts'; },
            cellsFilled: function (n) { return n + ' cells filled'; },
            undo: 'Undo',
            undone: 'Undone',
            copied: 'Table copied to clipboard — paste it into Excel',
            copyFailed: 'Copy failed, please try again',
            nothingToCopy: 'Nothing to copy — enter some ratings first',
            noValidData: 'No valid data found (only values 1, 2 and 3 are accepted)',
            previewSize: function (r, c) { return 'Detected ' + r + ' items × ' + c + ' experts'; },
            previewInvalid: function (n) { return n + ' invalid values will be ignored'; },
            limitReached: 'Limit reached: at most 200 items and 40 experts are supported',
            truncated: 'Data truncated: kept at most 200 items × 40 experts',
            lawsheNote: function (n, v) {
                return 'Lawshe minimum CVR threshold for N = <strong>' + n + '</strong> experts: <strong>' + v + '</strong>';
            },
            lawsheFew: 'The Lawshe threshold table is defined for at least 5 experts — interpret CVR with caution.',
            lawsheMissing: function (n) {
                return 'No exact Lawshe threshold for N = <strong>' + n + '</strong>; see the CVR explanation below for the nearest values.';
            },
            modelHint: {
                strict: '<strong>Strict model:</strong> only <strong>1 (Essential)</strong> counts as "relevant"; 2 and 3 count as "not relevant".',
                lenient: '<strong>Lenient model:</strong> <strong>1 (Essential)</strong> and <strong>2 (Useful but not essential)</strong> count as "relevant"; only 3 counts as "not relevant".'
            },
            badgeValid: 'Valid',
            badgeInvalid: 'Invalid',
            badgeExcellent: 'Excellent',
            badgePoor: 'Poor'
        }
    }[LANG];

    // ---------------------------------------------------------
    // Sabitler
    // ---------------------------------------------------------
    const MIN_CVR = {
        5: 0.99, 6: 0.99, 7: 0.99, 8: 0.75, 9: 0.78, 10: 0.62,
        11: 0.59, 12: 0.56, 13: 0.54, 14: 0.51, 15: 0.49,
        20: 0.42, 25: 0.37, 30: 0.33, 35: 0.31, 40: 0.29
    };
    const MAX_ROWS = 200;
    const MAX_COLS = 40;
    const DEFAULT_ROWS = 5;
    const DEFAULT_COLS = 5;
    const STORAGE_KEY = 'cvr-calculator-v2';
    const DEC = LANG === 'tr' ? ',' : '.'; // Excel'e kopyalarken ondalık ayracı

    const EXAMPLE = [
        ['1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '2'],
        ['1', '1', '2', '2', '1', '1'],
        ['1', '1', '1', '1', '2', '3'],
        ['3', '3', '2', '3', '3', '3'],
        ['1', '1', '1', '2', '1', '1'],
        ['2', '2', '2', '2', '2', '2'],
        ['1', '3', '1', '1', '1', '1']
    ];

    // ---------------------------------------------------------
    // Durum
    // ---------------------------------------------------------
    let state = {
        rows: DEFAULT_ROWS,
        cols: DEFAULT_COLS,
        data: [],
        model: 'strict'
    };
    let toastTimer = null;

    function emptyData(rows, cols) {
        const d = [];
        for (let i = 0; i < rows; i++) d.push(new Array(cols).fill(''));
        return d;
    }

    function sanitizeValue(v) {
        const t = String(v == null ? '' : v).trim();
        return /^[1-3]$/.test(t) ? t : '';
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const s = JSON.parse(raw);
            const rows = Math.min(MAX_ROWS, Math.max(0, parseInt(s.rows, 10) || 0));
            const cols = Math.min(MAX_COLS, Math.max(0, parseInt(s.cols, 10) || 0));
            if (rows < 1 || cols < 1 || !Array.isArray(s.data)) return;
            state.rows = rows;
            state.cols = cols;
            state.model = s.model === 'lenient' ? 'lenient' : 'strict';
            state.data = emptyData(rows, cols);
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    state.data[i][j] = sanitizeValue(s.data[i] && s.data[i][j]);
                }
            }
        } catch (e) {
            console.error('Kayıtlı durum okunamadı:', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* depolama dolu/kapalı olabilir, sessiz geç */ }
    }

    function snapshot() {
        return JSON.parse(JSON.stringify(state));
    }

    function restore(snap) {
        state = snap;
        render();
        saveState();
    }

    // ---------------------------------------------------------
    // Hesaplamalar (Lawshe / Polit & Beck)
    // ---------------------------------------------------------
    function isRelevant(value) {
        if (state.model === 'lenient') return value === '1' || value === '2';
        return value === '1';
    }

    function rowStats(i) {
        const row = state.data[i] || [];
        let answered = 0;
        let relevant = 0;
        for (let j = 0; j < state.cols; j++) {
            const v = row[j];
            if (v !== '' && v != null) {
                answered++;
                if (isRelevant(v)) relevant++;
            }
        }
        const cvr = answered > 0 ? (relevant - answered / 2) / (answered / 2) : null;
        const icvi = answered > 0 ? relevant / answered : null;
        return { answered: answered, relevant: relevant, cvr: cvr, icvi: icvi };
    }

    function cvrClass(cvr, n) {
        if (cvr == null) return 'none';
        const min = MIN_CVR[n] || 0;
        return cvr >= min ? 'good' : 'bad';
    }

    function icviClass(icvi, n) {
        if (icvi == null) return 'none';
        if (n <= 2) return icvi === 1 ? 'good' : 'bad';
        if (icvi >= 0.78) return 'good';
        if (icvi >= 0.70) return 'warn';
        return 'bad';
    }

    function summaryStats() {
        let cvrSum = 0, icviSum = 0, ratedRows = 0, uaRows = 0;
        for (let i = 0; i < state.rows; i++) {
            const st = rowStats(i);
            if (st.answered > 0) {
                ratedRows++;
                cvrSum += st.cvr;
                icviSum += st.icvi;
                if (st.relevant === st.answered) uaRows++;
            }
        }
        if (ratedRows === 0) return { cvi: null, scviAve: null, scviUA: null };
        return {
            cvi: cvrSum / ratedRows,
            scviAve: icviSum / ratedRows,
            scviUA: uaRows / ratedRows
        };
    }

    function fmt(n) {
        return n == null ? '–' : n.toFixed(3);
    }

    // ---------------------------------------------------------
    // DOM referansları
    // ---------------------------------------------------------
    const el = {};
    function grabElements() {
        [
            'headRow', 'tableBody', 'emptyState', 'cvrTable', 'onboardHint',
            'rowCount', 'colCount', 'addRow', 'removeRow', 'addColumn', 'removeColumn',
            'modelStrict', 'modelLenient', 'modelHint',
            'loadExample', 'pasteData', 'copyData', 'clearTable',
            'emptyCreate', 'emptyExample', 'emptyPaste',
            'lawsheNote', 'cviValue', 'cviBadge', 'scviAveValue', 'scviAveBadge',
            'scviUAValue', 'scviUABadge',
            'pasteModal', 'pasteInput', 'pastePreview', 'pasteConfirm', 'pasteCancel',
            'toast', 'toastMsg', 'toastAction'
        ].forEach(function (id) { el[id] = document.getElementById(id); });
    }

    // ---------------------------------------------------------
    // Görselleştirme
    // ---------------------------------------------------------
    function updateLegend() {
        document.querySelectorAll('.legend-chip[data-val]').forEach(function (chip) {
            const rel = isRelevant(chip.dataset.val);
            chip.classList.toggle('rel', rel);
            chip.classList.toggle('notrel', !rel);
        });
    }

    function render() {
        const hasTable = state.rows > 0 && state.cols > 0;
        el.cvrTable.style.display = hasTable ? '' : 'none';
        el.emptyState.hidden = hasTable;

        el.rowCount.textContent = state.rows;
        el.colCount.textContent = state.cols;
        el.removeRow.disabled = state.rows <= 1;
        el.removeColumn.disabled = state.cols <= 1;

        el.modelStrict.classList.toggle('active', state.model === 'strict');
        el.modelStrict.setAttribute('aria-pressed', state.model === 'strict');
        el.modelLenient.classList.toggle('active', state.model === 'lenient');
        el.modelLenient.setAttribute('aria-pressed', state.model === 'lenient');
        el.modelHint.innerHTML = STR.modelHint[state.model];
        updateLegend();

        if (hasTable) {
            renderHead();
            renderBody();
        } else {
            el.headRow.innerHTML = '';
            el.tableBody.innerHTML = '';
        }
        updateComputed();
    }

    function renderHead() {
        let html = '<th class="th-item">' + STR.item + '</th>';
        for (let j = 0; j < state.cols; j++) {
            html += '<th class="th-expert" data-col="' + j + '">' +
                '<span class="th-cap">' + STR.expert + '</span>' +
                '<span class="th-num">' + (j + 1) + '</span>' +
                (state.cols > 1
                    ? '<button type="button" class="col-del" data-col="' + j + '" title="' +
                      STR.deleteCol(j + 1) + '" aria-label="' + STR.deleteCol(j + 1) + '">×</button>'
                    : '') +
                '</th>';
        }
        html += '<th class="th-result">CVR</th><th class="th-result">I-CVI</th>';
        el.headRow.innerHTML = html;
    }

    function renderBody() {
        let html = '';
        for (let i = 0; i < state.rows; i++) {
            html += '<tr><td class="td-item">' + (i + 1) +
                (state.rows > 1
                    ? '<button type="button" class="row-del" data-row="' + i + '" title="' +
                      STR.deleteRow(i + 1) + '" aria-label="' + STR.deleteRow(i + 1) + '">×</button>'
                    : '') +
                '</td>';
            for (let j = 0; j < state.cols; j++) {
                const v = state.data[i][j] || '';
                html += '<td class="cell" contenteditable="true" inputmode="numeric" ' +
                    'data-row="' + i + '" data-col="' + j + '" ' +
                    'aria-label="' + STR.item + ' ' + (i + 1) + ', ' + STR.expert + ' ' + (j + 1) + '">' +
                    v + '</td>';
            }
            html += '<td class="td-result" id="cvr-' + i + '"></td>' +
                '<td class="td-result" id="icvi-' + i + '"></td></tr>';
        }
        el.tableBody.innerHTML = html;
    }

    // Yalnızca hesaplanan kısımları günceller (tabloyu yeniden kurmaz,
    // böylece yazarken odak kaybolmaz)
    function updateComputed() {
        let hasAnyData = false;

        for (let i = 0; i < state.rows; i++) {
            const st = rowStats(i);
            if (st.answered > 0) hasAnyData = true;

            const cvrCell = document.getElementById('cvr-' + i);
            const icviCell = document.getElementById('icvi-' + i);
            if (cvrCell) {
                cvrCell.innerHTML = '<span class="pill ' + cvrClass(st.cvr, st.answered) + '">' +
                    fmt(st.cvr) + '</span>';
            }
            if (icviCell) {
                icviCell.innerHTML = '<span class="pill ' + icviClass(st.icvi, st.answered) + '">' +
                    fmt(st.icvi) + '</span>';
            }

            // Hücre renkleri: model dönüşümüne göre gerekli / gerekli değil
            for (let j = 0; j < state.cols; j++) {
                const cell = el.tableBody.querySelector('.cell[data-row="' + i + '"][data-col="' + j + '"]');
                if (!cell) continue;
                const v = state.data[i][j];
                cell.classList.remove('cell-rel', 'cell-not', 'cell-missing');
                if (v !== '' && v != null) {
                    cell.classList.add(isRelevant(v) ? 'cell-rel' : 'cell-not');
                } else if (st.answered > 0) {
                    cell.classList.add('cell-missing');
                }
            }
        }

        // Lawshe eşik notu
        if (state.cols > 0) {
            if (state.cols < 5) {
                el.lawsheNote.innerHTML = STR.lawsheFew;
            } else if (MIN_CVR[state.cols]) {
                el.lawsheNote.innerHTML = STR.lawsheNote(state.cols, MIN_CVR[state.cols].toFixed(2));
            } else {
                el.lawsheNote.innerHTML = STR.lawsheMissing(state.cols);
            }
        } else {
            el.lawsheNote.innerHTML = '';
        }

        // Özet kutuları
        const s = summaryStats();
        setSummary(el.cviValue, el.cviBadge, s.cvi, s.cvi != null && s.cvi >= 0.8, STR.badgeValid, STR.badgeInvalid);
        setSummary(el.scviAveValue, el.scviAveBadge, s.scviAve, s.scviAve != null && s.scviAve >= 0.90, STR.badgeExcellent, STR.badgePoor);
        setSummary(el.scviUAValue, el.scviUABadge, s.scviUA, s.scviUA != null && s.scviUA >= 0.80, STR.badgeExcellent, STR.badgePoor);

        // Veri girilince tanıtım ipucunu gizle
        if (el.onboardHint) el.onboardHint.style.display = hasAnyData ? 'none' : '';
    }

    function setSummary(valueEl, badgeEl, value, ok, okLabel, badLabel) {
        valueEl.textContent = fmt(value);
        valueEl.classList.remove('good', 'bad');
        if (value == null) {
            badgeEl.hidden = true;
            return;
        }
        valueEl.classList.add(ok ? 'good' : 'bad');
        badgeEl.hidden = false;
        badgeEl.textContent = ok ? okLabel : badLabel;
        badgeEl.classList.remove('good', 'bad');
        badgeEl.classList.add(ok ? 'good' : 'bad');
    }

    // ---------------------------------------------------------
    // Toast
    // ---------------------------------------------------------
    function showToast(msg, action) {
        clearTimeout(toastTimer);
        el.toastMsg.textContent = msg;
        if (action) {
            el.toastAction.textContent = action.label;
            el.toastAction.hidden = false;
            el.toastAction.onclick = function () {
                hideToast();
                action.fn();
            };
        } else {
            el.toastAction.hidden = true;
            el.toastAction.onclick = null;
        }
        el.toast.hidden = false;
        toastTimer = setTimeout(hideToast, action ? 7000 : 3500);
    }

    function hideToast() {
        el.toast.hidden = true;
    }

    // ---------------------------------------------------------
    // Hücre etkileşimi (klavye + yapıştırma)
    // ---------------------------------------------------------
    function commitCell(cell) {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        const v = sanitizeValue(cell.textContent);
        if (cell.textContent !== v) cell.textContent = v;
        state.data[r][c] = v;
        updateComputed();
        saveState();
    }

    function focusCell(r, c) {
        if (r < 0 || c < 0 || r >= state.rows || c >= state.cols) return;
        const cell = el.tableBody.querySelector('.cell[data-row="' + r + '"][data-col="' + c + '"]');
        if (!cell) return;
        cell.focus();
        // İçeriği seç: üzerine yazmak kolaylaşır
        const range = document.createRange();
        range.selectNodeContents(cell);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function nextCell(r, c) {
        if (c + 1 < state.cols) focusCell(r, c + 1);
        else if (r + 1 < state.rows) focusCell(r + 1, 0);
    }

    function onCellKeydown(e) {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);

        switch (e.key) {
            case 'ArrowRight': e.preventDefault(); focusCell(r, c + 1); return;
            case 'ArrowLeft': e.preventDefault(); focusCell(r, c - 1); return;
            case 'ArrowUp': e.preventDefault(); focusCell(r - 1, c); return;
            case 'ArrowDown':
            case 'Enter': e.preventDefault(); focusCell(r + 1, c); return;
            case 'Backspace':
            case 'Delete':
                e.preventDefault();
                cell.textContent = '';
                commitCell(cell);
                return;
            case 'Tab':
                return; // varsayılan sekme davranışı yeterli
        }

        if (/^[1-3]$/.test(e.key)) {
            e.preventDefault();
            cell.textContent = e.key;
            commitCell(cell);
            nextCell(r, c);
            return;
        }

        // Tek karakterlik diğer tuşları engelle (Ctrl/Alt kombinasyonlarına dokunma)
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
        }
    }

    function onCellInput(e) {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        commitCell(cell); // mobil klavyeler keydown'ı atlayabilir
    }

    function onCellPaste(e) {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const parsed = parseGrid(text);
        if (!parsed.rows) return;

        if (parsed.rows === 1 && parsed.cols === 1) {
            cell.textContent = parsed.grid[0][0];
            commitCell(cell);
            return;
        }

        // Çok hücreli blok: bulunduğu konumdan itibaren doldur (Excel davranışı)
        const startR = parseInt(cell.dataset.row, 10);
        const startC = parseInt(cell.dataset.col, 10);
        const snap = snapshot();
        const needRows = Math.min(MAX_ROWS, startR + parsed.rows);
        const needCols = Math.min(MAX_COLS, startC + parsed.cols);

        if (needRows > state.rows) {
            for (let i = state.rows; i < needRows; i++) state.data.push(new Array(state.cols).fill(''));
            state.rows = needRows;
        }
        if (needCols > state.cols) {
            for (let i = 0; i < state.rows; i++) {
                while (state.data[i].length < needCols) state.data[i].push('');
            }
            state.cols = needCols;
        }

        let filled = 0;
        for (let i = 0; i < parsed.rows && startR + i < state.rows; i++) {
            for (let j = 0; j < parsed.cols && startC + j < state.cols; j++) {
                state.data[startR + i][startC + j] = parsed.grid[i][j];
                filled++;
            }
        }

        render();
        saveState();
        showToast(STR.cellsFilled(filled), { label: STR.undo, fn: function () { restore(snap); showToast(STR.undone); } });
    }

    // ---------------------------------------------------------
    // Yapı değişiklikleri
    // ---------------------------------------------------------
    function addRow() {
        if (state.rows >= MAX_ROWS) { showToast(STR.limitReached); return; }
        if (state.cols === 0) state.cols = 1;
        state.data.push(new Array(state.cols).fill(''));
        state.rows++;
        render();
        saveState();
    }

    function removeRowAt(index) {
        if (state.rows <= 1) return;
        state.data.splice(index, 1);
        state.rows--;
        render();
        saveState();
    }

    function addColumn() {
        if (state.cols >= MAX_COLS) { showToast(STR.limitReached); return; }
        if (state.rows === 0) { state.rows = 1; state.data.push([]); }
        for (let i = 0; i < state.rows; i++) state.data[i].push('');
        state.cols++;
        render();
        saveState();
    }

    function removeColumnAt(index) {
        if (state.cols <= 1) return;
        for (let i = 0; i < state.rows; i++) state.data[i].splice(index, 1);
        state.cols--;
        render();
        saveState();
    }

    function clearTable() {
        const snap = snapshot();
        state.data = emptyData(state.rows, state.cols);
        render();
        saveState();
        showToast(STR.cleared, { label: STR.undo, fn: function () { restore(snap); showToast(STR.undone); } });
    }

    function createDefault() {
        state.rows = DEFAULT_ROWS;
        state.cols = DEFAULT_COLS;
        state.data = emptyData(DEFAULT_ROWS, DEFAULT_COLS);
        render();
        saveState();
    }

    function loadExample() {
        const snap = snapshot();
        state.rows = EXAMPLE.length;
        state.cols = EXAMPLE[0].length;
        state.data = EXAMPLE.map(function (row) { return row.slice(); });
        render();
        saveState();
        showToast(STR.exampleLoaded, { label: STR.undo, fn: function () { restore(snap); showToast(STR.undone); } });
    }

    // ---------------------------------------------------------
    // Excel içe / dışa aktarma
    // ---------------------------------------------------------
    function parseGrid(text) {
        const result = { grid: [], rows: 0, cols: 0, invalid: 0, truncated: false };
        if (!text) return result;

        const lines = text.replace(/\r/g, '').split('\n')
            .map(function (l) { return l.trim(); })
            .filter(function (l) { return l !== ''; });

        for (let i = 0; i < lines.length; i++) {
            const tokens = lines[i].split(/[\t;,]+|\s+/).filter(function (t) { return t !== ''; });
            if (!tokens.length) continue;
            const row = tokens.map(function (t) {
                if (/^[1-3]$/.test(t)) return t;
                result.invalid++;
                return '';
            });
            result.grid.push(row);
        }

        if (result.grid.length > MAX_ROWS) {
            result.grid = result.grid.slice(0, MAX_ROWS);
            result.truncated = true;
        }
        result.rows = result.grid.length;
        result.cols = result.grid.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
        if (result.cols > MAX_COLS) {
            result.grid = result.grid.map(function (r) { return r.slice(0, MAX_COLS); });
            result.cols = MAX_COLS;
            result.truncated = true;
        }
        result.grid = result.grid.map(function (r) {
            while (r.length < result.cols) r.push('');
            return r;
        });
        return result;
    }

    function openPasteModal() {
        el.pasteInput.value = '';
        el.pastePreview.textContent = '';
        el.pasteConfirm.disabled = true;
        el.pasteModal.hidden = false;
        el.pasteInput.focus();
    }

    function closePasteModal() {
        el.pasteModal.hidden = true;
    }

    function updatePastePreview() {
        const parsed = parseGrid(el.pasteInput.value);
        if (!parsed.rows || !parsed.cols) {
            el.pastePreview.innerHTML = el.pasteInput.value.trim()
                ? '<span class="warn">' + STR.noValidData + '</span>'
                : '';
            el.pasteConfirm.disabled = true;
            return;
        }
        let html = '<span class="ok">✓ ' + STR.previewSize(parsed.rows, parsed.cols) + '</span>';
        if (parsed.invalid > 0) html += ' · <span class="warn">' + STR.previewInvalid(parsed.invalid) + '</span>';
        if (parsed.truncated) html += ' · <span class="warn">' + STR.truncated + '</span>';
        el.pastePreview.innerHTML = html;
        el.pasteConfirm.disabled = false;
    }

    function confirmPaste() {
        const parsed = parseGrid(el.pasteInput.value);
        if (!parsed.rows || !parsed.cols) return;
        const snap = snapshot();
        state.rows = parsed.rows;
        state.cols = parsed.cols;
        state.data = parsed.grid;
        render();
        saveState();
        closePasteModal();
        showToast(STR.imported(parsed.rows, parsed.cols), {
            label: STR.undo,
            fn: function () { restore(snap); showToast(STR.undone); }
        });
    }

    function hasAnyValue() {
        for (let i = 0; i < state.rows; i++) {
            for (let j = 0; j < state.cols; j++) {
                if (state.data[i][j] !== '') return true;
            }
        }
        return false;
    }

    function excelNumber(n) {
        return n == null ? '' : n.toFixed(3).replace('.', DEC);
    }

    function copyToExcel() {
        if (!hasAnyValue()) { showToast(STR.nothingToCopy); return; }

        const lines = [];
        const head = [STR.item];
        for (let j = 0; j < state.cols; j++) head.push(STR.expert + ' ' + (j + 1));
        head.push('CVR', 'I-CVI');
        lines.push(head.join('\t'));

        for (let i = 0; i < state.rows; i++) {
            const st = rowStats(i);
            const row = [String(i + 1)];
            for (let j = 0; j < state.cols; j++) row.push(state.data[i][j] || '');
            row.push(excelNumber(st.cvr), excelNumber(st.icvi));
            lines.push(row.join('\t'));
        }

        const s = summaryStats();
        lines.push('');
        lines.push('CVI\t' + excelNumber(s.cvi));
        lines.push('S-CVI/Ave\t' + excelNumber(s.scviAve));
        lines.push('S-CVI/UA\t' + excelNumber(s.scviUA));

        const text = lines.join('\n');

        function fallbackCopy() {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { /* yoksay */ }
            document.body.removeChild(ta);
            showToast(ok ? STR.copied : STR.copyFailed);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(function () { showToast(STR.copied); })
                .catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
    }

    // ---------------------------------------------------------
    // Model
    // ---------------------------------------------------------
    function setModel(model) {
        state.model = model;
        el.modelStrict.classList.toggle('active', model === 'strict');
        el.modelStrict.setAttribute('aria-pressed', model === 'strict');
        el.modelLenient.classList.toggle('active', model === 'lenient');
        el.modelLenient.setAttribute('aria-pressed', model === 'lenient');
        el.modelHint.innerHTML = STR.modelHint[model];
        updateLegend();
        updateComputed();
        saveState();
    }

    // ---------------------------------------------------------
    // Başlatma
    // ---------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        grabElements();
        loadState();
        if (state.rows < 1 || state.cols < 1 || !state.data.length) {
            state.rows = DEFAULT_ROWS;
            state.cols = DEFAULT_COLS;
            state.data = emptyData(DEFAULT_ROWS, DEFAULT_COLS);
        }
        render();

        // Yapı kontrolleri
        el.addRow.addEventListener('click', addRow);
        el.removeRow.addEventListener('click', function () { removeRowAt(state.rows - 1); });
        el.addColumn.addEventListener('click', addColumn);
        el.removeColumn.addEventListener('click', function () { removeColumnAt(state.cols - 1); });
        el.clearTable.addEventListener('click', clearTable);
        el.loadExample.addEventListener('click', loadExample);
        el.copyData.addEventListener('click', copyToExcel);
        el.pasteData.addEventListener('click', openPasteModal);

        // Boş durum eylemleri
        el.emptyCreate.addEventListener('click', createDefault);
        el.emptyExample.addEventListener('click', loadExample);
        el.emptyPaste.addEventListener('click', openPasteModal);

        // Model
        el.modelStrict.addEventListener('click', function () { setModel('strict'); });
        el.modelLenient.addEventListener('click', function () { setModel('lenient'); });

        // Hücre olayları (temsilci dinleyiciler — tablo yeniden kurulsa da çalışır)
        el.tableBody.addEventListener('keydown', onCellKeydown);
        el.tableBody.addEventListener('input', onCellInput);
        el.tableBody.addEventListener('paste', onCellPaste);
        el.tableBody.addEventListener('click', function (e) {
            const del = e.target.closest('.row-del');
            if (del) {
                const idx = parseInt(del.dataset.row, 10);
                removeRowAt(idx);
                showToast(STR.rowDeleted(idx + 1));
            }
        });
        el.headRow.addEventListener('click', function (e) {
            const del = e.target.closest('.col-del');
            if (del) {
                const idx = parseInt(del.dataset.col, 10);
                removeColumnAt(idx);
                showToast(STR.colDeleted(idx + 1));
            }
        });

        // Yapıştırma penceresi
        el.pasteInput.addEventListener('input', updatePastePreview);
        el.pasteConfirm.addEventListener('click', confirmPaste);
        el.pasteCancel.addEventListener('click', closePasteModal);
        el.pasteModal.addEventListener('click', function (e) {
            if (e.target === el.pasteModal) closePasteModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !el.pasteModal.hidden) closePasteModal();
        });
    });
})();
