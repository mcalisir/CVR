// Global değişkenler
let tableData = {
    rows: 0,
    columns: 0,
    data: []
};

// Seçili değerlendirme modeli
let currentModel = 'strict'; // 'strict' veya 'lenient'

// Minimum kabul edilebilir CVR değerleri (Lawshe, 1975)
const minCVRValues = {
    3: 0.99, 4: 0.99, 5: 0.99, 6: 0.99, 7: 0.99, 8: 0.75, 9: 0.78, 10: 0.62,
    11: 0.59, 12: 0.56, 13: 0.54, 14: 0.51, 15: 0.49, 16: 0.47, 17: 0.45,
    18: 0.44, 19: 0.42, 20: 0.42, 21: 0.40, 22: 0.39, 23: 0.38, 24: 0.37,
    25: 0.36, 26: 0.35, 27: 0.34, 28: 0.33, 29: 0.32, 30: 0.31, 31: 0.30,
    32: 0.29, 33: 0.28, 34: 0.27, 35: 0.26, 36: 0.25, 37: 0.24, 38: 0.23,
    39: 0.22, 40: 0.21, 41: 0.20, 42: 0.19, 43: 0.18, 44: 0.17, 45: 0.16,
    46: 0.15, 47: 0.14, 48: 0.13, 49: 0.12, 50: 0.11
};

// Eşik değerleri
const thresholds = {
    icvi: {
        excellent: 0.79,  // Mükemmel
        revision: 0.70,   // Revizyon gerekli
        eliminate: 0.70   // Elenmeli
    },
    cvr: {
        // Uzman sayısına göre dinamik
    },
    cvi: {
        excellent: 0.8,   // Mükemmel
        good: 0.7         // İyi
    },
    scviAve: {
        excellent: 0.9    // Mükemmel
    },
    scviUA: {
        excellent: 0.8    // Mükemmel
    }
};

// Değer dönüşümü fonksiyonu (1,2,3 -> 0,1)
function convertValueToBinary(value) {
    const trimmedValue = value.toString().trim();
    let result;
    
    if (currentModel === 'strict') {
        // Sert Model: 1 -> 1, 2,3 -> 0
        result = trimmedValue === '1' ? 1 : 0;
    } else if (currentModel === 'lenient') {
        // Rahat Model: 1,2 -> 1, 3 -> 0
        result = (trimmedValue === '1' || trimmedValue === '2') ? 1 : 0;
    } else {
        result = 0; // Varsayılan
    }
    
    return result;
}

// Model açıklamasını güncelle
function updateModelDescription() {
    const descriptionElement = document.getElementById('modelDescription');
    if (descriptionElement) {
        if (currentModel === 'strict') {
            descriptionElement.innerHTML = '<strong>Sert Model:</strong> Sadece 1 değeri "gerekli" olarak kabul edilir. 2 ve 3 değerleri "gerekli değil" olarak değerlendirilir.';
        } else if (currentModel === 'lenient') {
            descriptionElement.innerHTML = '<strong>Rahat Model:</strong> 1 ve 2 değerleri "gerekli" olarak kabul edilir. Sadece 3 değeri "gerekli değil" olarak değerlendirilir.';
        }
    }
}

// Renk kodlaması fonksiyonları
function getCVRColor(cvrValue, expertCount) {
    const minCVR = minCVRValues[expertCount] || 0.5;
    if (cvrValue >= minCVR) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

function getICVIColor(icviValue, expertCount) {
    // 1-2 uzman için I-CVI = 1 olmalı
    if (expertCount <= 2) {
        if (icviValue === 1) {
            return 'color-green';
        } else {
            return 'color-red';
        }
    }
    // 3+ uzman için I-CVI >= 0.78 olmalı
    else {
        if (icviValue >= 0.78) {
            return 'color-green';
        } else if (icviValue >= 0.70) {
            return 'color-orange';
        } else {
            return 'color-red';
        }
    }
}

function getCVIColor(cviValue) {
    if (cviValue >= 0.8) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

function getSCVIAveColor(scviAveValue) {
    if (scviAveValue >= 0.90) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

function getSCVIUAColor(scviUAValue) {
    if (scviUAValue >= 0.80) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

// CVR hesaplama fonksiyonu
function calculateCVR(necessaryExperts, totalExperts) {
    if (totalExperts <= 0) return 0;
    return (necessaryExperts - totalExperts / 2) / (totalExperts / 2);
}

// Minimum CVR değerini getir
function getMinCVR(totalExperts) {
    return minCVRValues[totalExperts] || 0.11;
}

// CVR durumunu değerlendir
function evaluateCVRStatus(cvr, minCVR) {
    if (cvr >= minCVR) {
        return { status: 'valid', text: 'Geçerli' };
    } else if (cvr >= minCVR - 0.1) {
        return { status: 'borderline', text: 'Sınırda' };
    } else {
        return { status: 'invalid', text: 'Geçersiz' };
    }
}

// CVI hesaplama fonksiyonu
function calculateCVI() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr:not(.cvi-row)'); // CVI satırını hariç tut
    
    let totalCVR = 0;
    let validItemCount = 0;
    
    rows.forEach((row, index) => {
        const cvrValueCell = row.querySelector('.cvr-value');
        if (cvrValueCell && cvrValueCell.textContent !== '-') {
            const cvrValue = parseFloat(cvrValueCell.textContent);
            if (!isNaN(cvrValue)) {
                totalCVR += cvrValue;
                validItemCount++;
            }
        }
    });
    
    if (validItemCount > 0) {
        return totalCVR / validItemCount;
    }
    return 0;
}

// CVI durumunu değerlendir
function evaluateCVIStatus(cvi) {
    if (cvi >= 0.8) {
        return { status: 'excellent', text: 'Mükemmel', color: '#059669' };
    } else if (cvi >= 0.7) {
        return { status: 'good', text: 'İyi', color: '#0891b2' };
    } else if (cvi >= 0.6) {
        return { status: 'acceptable', text: 'Kabul Edilebilir', color: '#d97706' };
    } else {
        return { status: 'poor', text: 'Yetersiz', color: '#dc2626' };
    }
}

// I-CVR hesaplama (Item-level CVR) - Her madde için ayrı hesaplanır
function calculateICVR() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr:not(.cvi-row)');
    
    let totalCVR = 0;
    let validItemCount = 0;
    
    rows.forEach(row => {
        const cvrValueCell = row.querySelector('.cvr-value');
        if (cvrValueCell && cvrValueCell.textContent !== '-') {
            const cvrValue = parseFloat(cvrValueCell.textContent);
            if (!isNaN(cvrValue)) {
                totalCVR += cvrValue;
                validItemCount++;
            }
        }
    });
    
    if (validItemCount > 0) {
        return totalCVR / validItemCount;
    }
    return 0;
}

// Her madde için I-CVI hesapla (madde bazlı) - I-CVI = ne/N
function calculateItemICVI(rowIndex) {
    const tableBody = document.getElementById('tableBody');
    const row = tableBody.querySelectorAll('tr:not(.cvi-row)')[rowIndex];
    
    if (!row) return 0;
    
    const inputs = row.querySelectorAll('.editable-cell');
    let necessaryCount = 0;
    let totalCount = 0;
    
    inputs.forEach(input => {
        const value = input.textContent.trim();
        if (value === '1' || value === '2' || value === '3') {
            // 1,2,3 değerlerini modele göre 0/1'e çevir
            const binaryValue = convertValueToBinary(value);
            if (binaryValue === 1) {
                necessaryCount++;
            }
            totalCount++;
        } else if (value === '0') {
            totalCount++;
        }
        // Boş hücreler (value === '') hesaplamaya dahil edilmiyor - bu doğru
    });
    
    if (totalCount > 0) {
        return necessaryCount / totalCount; // I-CVI = ne/N
    }
    return 0;
}

// S-CVI/Ave hesaplama (Scale-level CVI/Average)
function calculateSCVIAve() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr:not(.cvi-row)');
    
    let totalICVI = 0;
    let validItemCount = 0;
    
    rows.forEach((row, index) => {
        // I-CVI değerini hesapla (ne/N)
        const icviValue = calculateItemICVI(index);
        if (icviValue !== 0) {
            totalICVI += icviValue;
            validItemCount++;
        }
    });
    
    if (validItemCount > 0) {
        return totalICVI / validItemCount;
    }
    return 0;
}

// S-CVI/UA hesaplama (Scale-level CVI/Universal Agreement)
function calculateSCVIUA() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr:not(.cvi-row)');
    
    let universalAgreementCount = 0;
    let totalItemCount = 0;
    
    rows.forEach(row => {
        const inputs = row.querySelectorAll('.editable-cell');
        let necessaryCount = 0;
        let totalCount = 0;
        
        inputs.forEach(input => {
            const value = input.textContent.trim();
            if (value === '1' || value === '2' || value === '3') {
                // 1,2,3 değerlerini modele göre 0/1'e çevir
                const binaryValue = convertValueToBinary(value);
                if (binaryValue === 1) {
                    necessaryCount++;
                }
                totalCount++;
            } else if (value === '0') {
                totalCount++;
            }
        });
        
        if (totalCount > 0) {
            totalItemCount++;
            // Tüm uzmanlar aynı fikirde mi? (hepsi 1 veya hepsi 0)
            if (necessaryCount === totalCount || necessaryCount === 0) {
                universalAgreementCount++;
            }
        }
    });
    
    if (totalItemCount > 0) {
        return universalAgreementCount / totalItemCount;
    }
    return 0;
}

// I-CVR durumunu değerlendir
function evaluateICVRStatus(icvr) {
    if (icvr >= 0.8) {
        return { status: 'excellent', text: 'Mükemmel', color: '#059669' };
    } else if (icvr >= 0.7) {
        return { status: 'good', text: 'İyi', color: '#0891b2' };
    } else if (icvr >= 0.6) {
        return { status: 'acceptable', text: 'Kabul Edilebilir', color: '#d97706' };
    } else {
        return { status: 'poor', text: 'Yetersiz', color: '#dc2626' };
    }
}

// S-CVI/Ave durumunu değerlendir
function evaluateSCVIAveStatus(scviAve) {
    if (scviAve >= 0.9) {
        return { status: 'excellent', text: 'Mükemmel', color: '#059669' };
    } else if (scviAve >= 0.8) {
        return { status: 'good', text: 'İyi', color: '#0891b2' };
    } else if (scviAve >= 0.7) {
        return { status: 'acceptable', text: 'Kabul Edilebilir', color: '#d97706' };
    } else {
        return { status: 'poor', text: 'Yetersiz', color: '#dc2626' };
    }
}

// S-CVI/UA durumunu değerlendir
function evaluateSCVIUAStatus(scviUA) {
    if (scviUA >= 0.8) {
        return { status: 'excellent', text: 'Mükemmel', color: '#059669' };
    } else if (scviUA >= 0.7) {
        return { status: 'good', text: 'İyi', color: '#0891b2' };
    } else if (scviUA >= 0.6) {
        return { status: 'acceptable', text: 'Kabul Edilebilir', color: '#d97706' };
    } else {
        return { status: 'poor', text: 'Yetersiz', color: '#dc2626' };
    }
}

// Tabloyu oluştur
function createTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    // Eğer satır yoksa varsayılan 5 satır oluştur
    if (tableData.rows === 0) {
        tableData.rows = 5;
    }
    
    for (let row = 0; row < tableData.rows; row++) {
        const tr = document.createElement('tr');
        
        // Satır numarası
        const rowNumberCell = document.createElement('td');
        rowNumberCell.className = 'row-number';
        rowNumberCell.textContent = row + 1;
        tr.appendChild(rowNumberCell);
        
        // Uzman değerlendirme hücreleri (ContentEditable)
        for (let col = 0; col < tableData.columns; col++) {
            const cell = document.createElement('td');
            cell.className = 'expert-header editable-cell';
            cell.contentEditable = 'true';
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            cell.setAttribute('data-placeholder', '0, 1, 2 veya 3');
            cell.textContent = tableData.data[row] && tableData.data[row][col] !== undefined ? tableData.data[row][col] : '';
            
            // 0, 1, 2, 3 değerlerini kabul et
            cell.addEventListener('keypress', function(e) {
                if (e.key !== '0' && e.key !== '1' && e.key !== '2' && e.key !== '3' && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') {
                    e.preventDefault();
                }
            });
            
            // Değer değiştiğinde hesapla
            cell.addEventListener('input', function() {
                const value = this.textContent.trim();
                if (value === '0' || value === '1' || value === '2' || value === '3') {
                    // Değeri kaydet
                    if (!tableData.data[row]) tableData.data[row] = [];
                    tableData.data[row][col] = parseInt(value);
                    
                    // Animasyon
                    this.classList.add('cell-updated');
                    setTimeout(() => this.classList.remove('cell-updated'), 500);
                    
                    // CVR hesapla
                    calculateRowCVR(row);
                } else if (value === '') {
                    // Boş değer
                    if (!tableData.data[row]) tableData.data[row] = [];
                    tableData.data[row][col] = '';
                    calculateRowCVR(row);
                } else {
                    // Geçersiz değer - geri al
                    this.textContent = tableData.data[row] && tableData.data[row][col] !== undefined ? tableData.data[row][col] : '';
                }
                
                // Boş hücre kontrolü
                updateEmptyCellStyles();
            });
            
            tr.appendChild(cell);
        }
        
        // CVR değer hücresi
        const cvrValueCell = document.createElement('td');
        cvrValueCell.className = 'cvr-value';
        cvrValueCell.textContent = '-';
        tr.appendChild(cvrValueCell);
        
        // I-CVR hücresi (her madde için hesaplanır)
        const icvrCell = document.createElement('td');
        icvrCell.className = 'cvr-value icvr-cell';
        icvrCell.setAttribute('data-row', row);
        icvrCell.textContent = '-';
        tr.appendChild(icvrCell);
        
        // S-CVI sütunları artık tabloda yok, özet bölümünde gösterilecek
        
        tableBody.appendChild(tr);
        
        // Her satır için CVR hesapla
        calculateRowCVR(row);
    }
    
    // Boş hücre stillerini güncelle
    updateEmptyCellStyles();
    
    // CVI satırını ekle
    // CVI satırı artık tabloda değil, özet bölümünde gösteriliyor
}

// CVI satırı artık tabloda değil, özet bölümünde gösteriliyor

// createTableWithoutListener fonksiyonu kaldırıldı - artık createTable kullanılıyor

// Doğrudan yapıştırma özelliği kaldırıldı - sadece "Excel'den Yapıştır" butonu kullanın

// Tablo başlıklarını güncelle
function updateTableHeaders() {
    const expertHeader = document.querySelector('.expert-header');
    const headerRow = document.querySelector('thead tr:last-child');
    
    if (!expertHeader || !headerRow) return;
    
    // Mevcut uzman başlıklarını temizle
    const existingExpertHeaders = headerRow.querySelectorAll('.expert-header');
    existingExpertHeaders.forEach(header => {
        if (header.textContent.startsWith('U')) {
            header.remove();
        }
    });
    
    if (tableData.columns > 0) {
        expertHeader.setAttribute('colspan', tableData.columns);
        expertHeader.textContent = `Uzmanlar (${tableData.columns})`;
        
        // Uzman başlıklarını ekle
        const resultHeaders = headerRow.querySelectorAll('.result-header');
        
        for (let i = 1; i <= tableData.columns; i++) {
            const th = document.createElement('th');
            th.className = 'expert-header';
            th.textContent = `Uzman ${i}`;
            headerRow.insertBefore(th, resultHeaders[0]);
        }
    } else {
        expertHeader.setAttribute('colspan', '0');
        expertHeader.textContent = 'Uzmanlar';
    }
}

// Tek satır CVR hesapla
function calculateRowCVR(rowIndex) {
    const tableBody = document.getElementById('tableBody');
    const row = tableBody.querySelectorAll('tr')[rowIndex];
    
    if (!row) return;
    
    const inputs = row.querySelectorAll('.editable-cell');
    const cvrValueCell = row.querySelector('.cvr-value');
    
    // Bu satırdaki değerleri topla
    let necessaryCount = 0;
    let totalCount = 0;
    
    inputs.forEach(input => {
        const value = input.textContent.trim();
        if (value === '1' || value === '2' || value === '3') {
            // 1,2,3 değerlerini modele göre 0/1'e çevir
            const binaryValue = convertValueToBinary(value);
            if (binaryValue === 1) {
                necessaryCount++;
            }
            totalCount++;
        } else if (value === '0') {
            totalCount++;
        }
        // Boş hücreler (value === '') hesaplamaya dahil edilmiyor - bu doğru
    });
    
    if (totalCount > 0) {
        const cvr = calculateCVR(necessaryCount, totalCount);
        
        // CVR renk kodlaması
        const cvrColorClass = getCVRColor(cvr, totalCount);
        cvrValueCell.textContent = cvr.toFixed(3);
        cvrValueCell.className = 'cvr-value ' + cvrColorClass;
        
        // I-CVI hesapla ve göster (I-CVI = ne/N)
        const icviValue = calculateItemICVI(rowIndex);
        const icvrCell = row.querySelector('.icvr-cell');
        if (icvrCell) {
            const icviColorClass = getICVIColor(icviValue, totalCount);
            icvrCell.textContent = icviValue.toFixed(3);
            icvrCell.className = 'icvr-cell ' + icviColorClass;
        }
        
        console.log(`Row ${rowIndex}: CVR=${cvr.toFixed(3)}, I-CVI=${icviValue.toFixed(3)}`);
        
        // CVI'yi güncelle
        updateCVI();
    } else {
        cvrValueCell.textContent = '-';
        
        // I-CVR'yi temizle
        const icvrCell = row.querySelector('.icvr-cell');
        if (icvrCell) {
            icvrCell.textContent = '-';
        }
        
        // CVI'yi güncelle
        updateCVI();
    }
}

// Tüm CVR'leri hesapla
function calculateAllCVRs() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');
    
    let validCount = 0;
    let borderlineCount = 0;
    let invalidCount = 0;
    
    rows.forEach((row, rowIndex) => {
        const inputs = row.querySelectorAll('.editable-cell');
        const cvrValueCell = row.querySelector('.cvr-value');
        
        // Bu satırdaki değerleri topla
        let necessaryCount = 0;
        let totalCount = 0;
        
        inputs.forEach(input => {
            const value = input.textContent.trim();
            if (value === '1' || value === '2' || value === '3') {
                // 1,2,3 değerlerini modele göre 0/1'e çevir
                const binaryValue = convertValueToBinary(value);
                if (binaryValue === 1) {
                    necessaryCount++;
                }
                totalCount++;
            } else if (value === '0') {
                totalCount++;
            }
        });
        
        if (totalCount > 0) {
            const cvr = calculateCVR(necessaryCount, totalCount);
            
            // CVR renk kodlaması
            const cvrColorClass = getCVRColor(cvr, totalCount);
            cvrValueCell.textContent = cvr.toFixed(3);
            cvrValueCell.className = 'cvr-value ' + cvrColorClass;
            
            // I-CVR'yi hesapla ve göster
            const icvrValue = calculateItemICVI(rowIndex);
            const icvrCell = row.querySelector('.icvr-cell');
            if (icvrCell) {
                const icviColorClass = getICVIColor(icvrValue, totalCount);
                icvrCell.textContent = icvrValue.toFixed(3);
                icvrCell.className = 'icvr-cell ' + icviColorClass;
            }
            
    } else {
        cvrValueCell.textContent = '-';
        cvrValueCell.className = 'cvr-value';
        
        // I-CVR'yi temizle
        const icvrCell = row.querySelector('.icvr-cell');
        if (icvrCell) {
            icvrCell.textContent = '-';
            icvrCell.className = 'icvr-cell';
        }
    }
    });
    
    // Özet istatistiklerini güncelle
    // updateSummaryStats kaldırıldı - artık sadece hesaplama yapıyoruz
    
    // CVI'yi güncelle
    updateCVI();
}

// Sonuç özeti bölümü kaldırıldı

// Boş hücre stillerini güncelle
function updateEmptyCellStyles() {
    const cells = document.querySelectorAll('.editable-cell');
    cells.forEach(cell => {
        const value = cell.textContent.trim();
        if (value === '' || value === undefined) {
            cell.classList.add('empty-cell');
        } else {
            cell.classList.remove('empty-cell');
        }
    });
}

// CVI'yi güncelle
function updateCVI() {
    const cvi = calculateCVI();
    const scviAve = calculateSCVIAve();
    const scviUA = calculateSCVIUA();
    
    // I-CVI değerleri artık sadece tabloda gösteriliyor, özet bölümünde yok
    
    // Debug logları kaldırıldı
    
    
    // CVI değerleri
    const cviValueElement = document.getElementById('cviValue');
    if (cviValueElement) {
        const cviColorClass = getCVIColor(cvi);
        cviValueElement.textContent = cvi.toFixed(3);
        cviValueElement.className = cviColorClass;
    }
    
    // S-CVI/Ave değerleri
    const scviAveValueElement = document.getElementById('scviAveValue');
    if (scviAveValueElement) {
        const scviAveColorClass = getSCVIAveColor(scviAve);
        scviAveValueElement.textContent = scviAve.toFixed(3);
        scviAveValueElement.className = scviAveColorClass;
    }
    
    // S-CVI/UA değerleri
    const scviUAValueElement = document.getElementById('scviUAValue');
    if (scviUAValueElement) {
        const scviUAColorClass = getSCVIUAColor(scviUA);
        scviUAValueElement.textContent = scviUA.toFixed(3);
        scviUAValueElement.className = scviUAColorClass;
    }
}

// Satır ekle
function addRow() {
    tableData.rows++;
    createTable();
    // updateSummaryStats kaldırıldı - artık sadece hesaplama yapıyoruz
    updateButtonStates();
}

// Sütun ekle
function addColumn() {
    if (tableData.columns < 50) {
        tableData.columns++;
        updateTableHeaders();
        createTable();
        // updateSummaryStats kaldırıldı - artık sadece hesaplama yapıyoruz
        updateButtonStates();
    } else {
        alert('Maksimum 50 uzman eklenebilir');
    }
}

// Satır sil
function removeRow() {
    if (tableData.rows > 0) {
        if (confirm('Son maddeyi silmek istediğinizden emin misiniz?')) {
            tableData.rows--;
            // Son satırın verilerini sil
            if (tableData.data[tableData.rows]) {
                tableData.data.splice(tableData.rows, 1);
            }
            createTable();
            calculateAllCVRs();
            updateButtonStates();
        }
    }
}

// Sütun sil
function removeColumn() {
    if (tableData.columns > 0) {
        if (confirm('Son uzman sütununu silmek istediğinizden emin misiniz?')) {
            tableData.columns--;
            
            // Tüm satırlardan son sütunu sil
            tableData.data.forEach(row => {
                if (row && row.length > tableData.columns) {
                    row.splice(tableData.columns, 1);
                }
            });
            
            updateTableHeaders();
            createTable();
            calculateAllCVRs();
            updateButtonStates();
        }
    }
}

// Buton durumlarını güncelle
function updateButtonStates() {
    const removeRowBtn = document.getElementById('removeRow');
    const removeColumnBtn = document.getElementById('removeColumn');
    
    // Madde sil butonunu güncelle
    if (tableData.rows <= 0) {
        removeRowBtn.disabled = true;
    } else {
        removeRowBtn.disabled = false;
    }
    
    // Uzman sil butonunu güncelle
    if (tableData.columns <= 0) {
        removeColumnBtn.disabled = true;
    } else {
        removeColumnBtn.disabled = false;
    }
}

// Tabloyu temizle
function clearTable() {
    if (confirm('Tüm tabloyu temizlemek istediğinizden emin misiniz?')) {
        tableData.rows = 5; // Varsayılan 5 satır
        tableData.columns = 3; // Varsayılan 3 sütun
        tableData.data = [];
        updateTableHeaders(); // Tablo başlıklarını güncelle
        createTable();
        calculateAllCVRs(); // Hesaplamaları temizle
        updateCVI(); // CVI'yi güncelle
        // updateSummaryStats kaldırıldı - artık sadece hesaplama yapıyoruz
        updateButtonStates();
    }
}

// Excel'den yapıştır
function pasteFromExcel() {
    navigator.clipboard.readText().then(text => {
        if (!text.trim()) {
            alert('Panoda veri bulunamadı');
            return;
        }
        
        // Excel'den gelen veriyi temizle (çift tab karakterlerini düzelt)
        const cleanText = text.replace(/\t\t+/g, '\t').replace(/\n\s*\n/g, '\n');
        
        const rows = cleanText.split('\n').filter(row => row.trim());
        if (rows.length === 0) {
            alert('Geçerli veri bulunamadı');
            return;
        }
        
        // Veriyi parse et - her satırı tab ile böl
        const data = rows.map(row => {
            return row.split('\t').map(cell => cell.trim());
        });
        
        // Tablo boyutunu ayarla - Excel'den gelen sütun sayısına göre
        const maxColumns = Math.max(...data.map(row => row.length));
        tableData.columns = Math.min(maxColumns, 50);
        updateTableHeaders();
        
        if (data.length > tableData.rows) {
            tableData.rows = data.length;
        }
        
        // Veriyi tabloya aktar
        data.forEach((rowData, rowIndex) => {
            if (rowIndex < tableData.rows) {
                if (!tableData.data[rowIndex]) tableData.data[rowIndex] = [];
                
                rowData.forEach((cellValue, colIndex) => {
                    if (colIndex < tableData.columns) {
                        // 0, 1, 2, 3 değerlerini kabul et
                        if (cellValue === '0' || cellValue === '1' || cellValue === '2' || cellValue === '3') {
                            tableData.data[rowIndex][colIndex] = parseInt(cellValue);
                        } else if (cellValue === '') {
                            tableData.data[rowIndex][colIndex] = '';
                        } else {
                            // Geçersiz değer - boş bırak
                            tableData.data[rowIndex][colIndex] = '';
                        }
                    }
                });
            }
        });
        
        // Tabloyu yeniden oluştur
        createTable();
        calculateAllCVRs();
        
        // Boş hücre stillerini güncelle
        updateEmptyCellStyles();
        
        console.log(`${data.length} satır, ${maxColumns} sütun veri Excel'den yapıştırıldı`);
        alert(`${data.length} satır veri başarıyla yapıştırıldı!`);
    }).catch(err => {
        console.log('Modern Clipboard API başarısız, fallback yöntemi deneniyor:', err);
        // Fallback: Kullanıcıdan manuel giriş iste
        showPasteDialog();
    });
}

function showPasteDialog() {
    const text = prompt('Excel\'den kopyaladığınız veriyi buraya yapıştırın (Ctrl+V):\n\nNot: Verilerinizi Excel\'den kopyalayıp bu pencereye yapıştırın.');
    if (text && text.trim()) {
        processPastedData(text);
    } else if (text !== null) {
        alert('Veri girişi iptal edildi');
    }
}

function processPastedData(text) {
    if (!text.trim()) {
        alert('Panoda veri bulunamadı');
        return;
    }
    
    // Excel'den gelen veriyi temizle (çift tab karakterlerini düzelt)
    const cleanText = text.replace(/\t\t+/g, '\t').replace(/\n\s*\n/g, '\n');
    
    const rows = cleanText.split('\n').filter(row => row.trim());
    if (rows.length === 0) {
        alert('Geçerli veri bulunamadı');
        return;
    }
    
    // Veriyi parse et - her satırı tab ile böl
    const data = rows.map(row => {
        return row.split('\t').map(cell => cell.trim());
    });
    
    // Tablo boyutunu ayarla - Excel'den gelen sütun sayısına göre
    const maxColumns = Math.max(...data.map(row => row.length));
    tableData.columns = Math.min(maxColumns, 50);
    updateTableHeaders();
    
    if (data.length > tableData.rows) {
        tableData.rows = data.length;
    }
    
    // Veriyi tabloya aktar
    data.forEach((rowData, rowIndex) => {
        if (rowIndex < tableData.rows) {
            if (!tableData.data[rowIndex]) tableData.data[rowIndex] = [];
            
            rowData.forEach((cellValue, colIndex) => {
                if (colIndex < tableData.columns) {
                    // Sadece 0 ve 1 değerlerini kabul et
                    if (cellValue === '0' || cellValue === '1') {
                        tableData.data[rowIndex][colIndex] = parseInt(cellValue);
                    } else if (cellValue === '') {
                        tableData.data[rowIndex][colIndex] = '';
                    } else {
                        // Geçersiz değer - boş bırak
                        tableData.data[rowIndex][colIndex] = '';
                    }
                }
            });
        }
    });
    
    // Tabloyu yeniden oluştur
    createTable();
    calculateAllCVRs();
    updateCVI();
    
    // Boş hücre stillerini güncelle
    updateEmptyCellStyles();
    
    console.log(`${data.length} satır, ${maxColumns} sütun veri Excel'den yapıştırıldı`);
    alert(`${data.length} satır veri başarıyla yapıştırıldı!`);
}

// Excel'e kopyala
function copyToExcel() {
    if (tableData.rows === 0) {
        alert('Kopyalanacak veri bulunamadı');
        return;
    }
    
    let textContent = '';
    
    // Veri satırlarını oluştur
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('.editable-cell');
        const rowData = [];
        
        cells.forEach(cell => {
            // ContentEditable hücrelerden textContent al
            rowData.push(cell.textContent.trim() || '');
        });
        
        textContent += rowData.join('\t') + '\n';
    });
    
    // Panoya kopyala
    navigator.clipboard.writeText(textContent).then(() => {
        alert('Veriler panoya kopyalandı. Excel\'e yapıştırabilirsiniz.');
    }).catch(err => {
        alert('Veriler panoya kopyalanamadı');
        console.error('Copy error:', err);
    });
}

// CSV fonksiyonları kaldırıldı

// CSV fonksiyonları kaldırıldı

// Verileri kaydet
function saveData() {
    localStorage.setItem('cvrTableData', JSON.stringify(tableData));
}

// Verileri yükle
function loadData() {
    const saved = localStorage.getItem('cvrTableData');
    if (saved) {
        tableData = JSON.parse(saved);
        updateTableHeaders();
        createTable();
        calculateAllCVRs();
    }
    
    // Model açıklamasını güncelle
    updateModelDescription();
}

// Accordion işlevselliği
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(id + '-icon');
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('show');
        icon.style.transform = 'rotate(180deg)';
    }
}

// Event listener'ları ekle
document.addEventListener('DOMContentLoaded', function() {
    // Buton event listener'ları
    document.getElementById('addRow').addEventListener('click', addRow);
    document.getElementById('removeRow').addEventListener('click', removeRow);
    document.getElementById('addColumn').addEventListener('click', addColumn);
    document.getElementById('removeColumn').addEventListener('click', removeColumn);
    // Hesapla butonu kaldırıldı - otomatik hesaplama yapılıyor
    document.getElementById('clearTable').addEventListener('click', clearTable);
    document.getElementById('pasteData').addEventListener('click', pasteFromExcel);
    document.getElementById('copyData').addEventListener('click', copyToExcel);
    // CSV butonları kaldırıldı
    
    // Model seçici event listener
    document.getElementById('evaluationModel').addEventListener('change', function() {
        currentModel = this.value;
        updateModelDescription();
        
        // Tabloyu yeniden oluştur ve hesapla
        createTable();
        calculateAllCVRs();
    });
    
    // Sayfa yüklendiğinde verileri yükle
    loadData();
    
    // Doğrudan yapıştırma özelliği kaldırıldı - sadece "Excel'den Yapıştır" butonu kullanın
    
    // İlk buton durumlarını ayarla
    updateButtonStates();
    
    // Otomatik kaydetme
    setInterval(saveData, 30000); // 30 saniyede bir kaydet
    
    // Sayfa kapatılırken kaydet
    window.addEventListener('beforeunload', saveData);
});

// Klavye kısayolları
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter: Tüm CVR'leri hesapla
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        calculateAllCVRs();
    }
    
    // Ctrl + N: Yeni satır ekle
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        addRow();
    }
    
    // Ctrl + M: Yeni sütun ekle
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        addColumn();
    }
    
    // Ctrl + S: Kaydet
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveData();
        alert('Veriler kaydedildi');
    }
});

// Hücre seçimi
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cell-input')) {
        // Önceki seçimi temizle
        document.querySelectorAll('.cell-selected').forEach(cell => {
            cell.classList.remove('cell-selected');
        });
        
        // Yeni seçimi işaretle
        e.target.parentElement.classList.add('cell-selected');
        e.target.select();
    }
});

// Tab ile hücreler arasında geçiş
document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('cell-input') && e.key === 'Tab') {
        e.preventDefault();
        
        const currentCell = e.target;
        const currentRow = currentCell.closest('tr');
        const currentIndex = Array.from(currentRow.querySelectorAll('.cell-input')).indexOf(currentCell);
        
        if (e.shiftKey) {
            // Shift + Tab: Önceki hücre
            if (currentIndex > 0) {
                const prevCell = currentRow.querySelectorAll('.cell-input')[currentIndex - 1];
                prevCell.focus();
                prevCell.select();
            }
        } else {
            // Tab: Sonraki hücre
            const nextCell = currentRow.querySelectorAll('.cell-input')[currentIndex + 1];
            if (nextCell) {
                nextCell.focus();
                nextCell.select();
            }
        }
    }
});

// Konsol için yardımcı fonksiyonlar
window.CVRTable = {
    addRow: addRow,
    removeRow: removeRow,
    addColumn: addColumn,
    removeColumn: removeColumn,
    // calculateAll butonu kaldırıldı
    clearTable: clearTable,
    pasteData: pasteFromExcel,
    copyData: copyToExcel,
    // CSV fonksiyonları kaldırıldı
    saveData: saveData,
    loadData: loadData,
    getData: () => tableData
};