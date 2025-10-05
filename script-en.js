// Global variables
let tableData = {
    rows: 0,
    columns: 0,
    data: []
};
let currentModel = 'strict'; // 'strict' or 'lenient'

// Lawshe's minimum CVR values
const minCVRValues = {
    5: 0.99, 6: 0.99, 7: 0.99, 8: 0.75, 9: 0.78, 10: 0.62,
    11: 0.59, 12: 0.56, 13: 0.54, 14: 0.51, 15: 0.49,
    20: 0.42, 25: 0.37, 30: 0.33, 35: 0.31, 40: 0.29
};

// Threshold values for color coding
const thresholds = {
    cvi: { good: 0.8 },
    icvi: { 
        excellent: 0.78, 
        needsRevision: 0.70 
    },
    scviAve: { excellent: 0.90 },
    scviUA: { excellent: 0.80 }
};

// Convert input values to binary based on selected model
function convertValueToBinary(value) {
    const trimmedValue = value.toString().trim();
    let result;

    if (currentModel === 'strict') {
        result = trimmedValue === '1' ? 1 : 0;
    } else if (currentModel === 'lenient') {
        result = (trimmedValue === '1' || trimmedValue === '2') ? 1 : 0;
    } else {
        result = 0;
    }
    return result;
}

// Update model description
function updateModelDescription() {
    const modelDesc = document.getElementById('modelDescription');
    if (currentModel === 'strict') {
        modelDesc.innerHTML = '<strong>Strict Model:</strong> Only value 1 is considered "relevant". Values 2 and 3 are evaluated as "not relevant".';
    } else if (currentModel === 'lenient') {
        modelDesc.innerHTML = '<strong>Lenient Model:</strong> Values 1 and 2 are considered "relevant". Only value 3 is evaluated as "not relevant".';
    }
}

// Get CVR color based on value and expert count
function getCVRColor(cvrValue, expertCount) {
    const minCVR = minCVRValues[expertCount] || 0;
    if (cvrValue >= minCVR) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

// Get I-CVI color based on value and expert count
function getICVIColor(icviValue, expertCount) {
    // For 1-2 experts, I-CVI must be 1
    if (expertCount <= 2) {
        if (icviValue === 1) {
            return 'color-green';
        } else {
            return 'color-red';
        }
    }
    // For 3+ experts, I-CVI >= 0.78 is good
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

// Get CVI color based on value
function getCVIColor(cviValue) {
    if (cviValue >= 0.8) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

// Get S-CVI/Ave color based on value
function getSCVIAveColor(scviAveValue) {
    if (scviAveValue >= 0.90) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

// Get S-CVI/UA color based on value
function getSCVIUAColor(scviUAValue) {
    if (scviUAValue >= 0.80) {
        return 'color-green';
    } else {
        return 'color-red';
    }
}

// CVR calculation function
function calculateCVR(necessaryExperts, totalExperts) {
    if (totalExperts <= 0) return 0;
    return (necessaryExperts - totalExperts / 2) / (totalExperts / 2);
}

// Calculate I-CVI for a specific item
function calculateItemICVI(rowIndex) {
    const row = tableData.data[rowIndex];
    if (!row) return 0;
    
    let relevantCount = 0;
    let totalCount = 0;
    
    for (let i = 0; i < row.length; i++) {
        const value = row[i];
        if (value !== '' && value !== null && value !== undefined) {
            const binaryValue = convertValueToBinary(value);
            if (binaryValue === 1) {
                relevantCount++;
            }
            totalCount++;
        }
    }
    
    return totalCount > 0 ? relevantCount / totalCount : 0;
}

// Calculate S-CVI/Ave
function calculateSCVIAve() {
    let totalICVI = 0;
    let validItems = 0;
    
    for (let i = 0; i < tableData.rows; i++) {
        const icvi = calculateItemICVI(i);
        if (!isNaN(icvi)) {
            totalICVI += icvi;
            validItems++;
        }
    }
    
    return validItems > 0 ? totalICVI / validItems : 0;
}

// Calculate S-CVI/UA
function calculateSCVIUA() {
    let universalAgreementItems = 0;
    
    for (let i = 0; i < tableData.rows; i++) {
        const row = tableData.data[i];
        if (!row) continue;
        
        let allRelevant = true;
        let hasData = false;
        
        for (let j = 0; j < row.length; j++) {
            const value = row[j];
            if (value !== '' && value !== null && value !== undefined) {
                hasData = true;
                const binaryValue = convertValueToBinary(value);
                if (binaryValue !== 1) {
                    allRelevant = false;
                    break;
                }
            }
        }
        
        if (hasData && allRelevant) {
            universalAgreementItems++;
        }
    }
    
    return tableData.rows > 0 ? universalAgreementItems / tableData.rows : 0;
}

// Create table
function createTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    // Initialize with 5 rows if no data
    if (tableData.rows === 0) {
        tableData.rows = 5;
        tableData.data = Array(5).fill().map(() => Array(tableData.columns).fill(''));
    }
    
    for (let i = 0; i < tableData.rows; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="row-number">${i + 1}</td>`;
        
        // Add expert columns
        for (let j = 0; j < tableData.columns; j++) {
            const cell = document.createElement('td');
            cell.className = 'data-cell';
            cell.contentEditable = 'true';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.setAttribute('data-placeholder', '0, 1, 2 or 3');
            cell.textContent = tableData.data[i] ? (tableData.data[i][j] || '') : '';
            
            // Add event listeners
            cell.addEventListener('keypress', function(e) {
                if (!['0', '1', '2', '3'].includes(e.key)) {
                    e.preventDefault();
                }
            });
            
            cell.addEventListener('input', function() {
                const row = parseInt(this.dataset.row);
                const col = parseInt(this.dataset.col);
                if (!tableData.data[row]) {
                    tableData.data[row] = Array(tableData.columns).fill('');
                }
                tableData.data[row][col] = this.textContent;
                updateEmptyCellStyles();
                calculateRowCVR(row);
                calculateAllCVRs();
                updateCVI();
            });
            
            row.appendChild(cell);
        }
        
        // Add CVR and I-CVI columns
        const cvrCell = document.createElement('td');
        cvrCell.className = 'result-cell cvr-cell';
        cvrCell.id = `cvr-${i}`;
        row.appendChild(cvrCell);
        
        const icviCell = document.createElement('td');
        icviCell.className = 'result-cell icvi-cell';
        icviCell.id = `icvi-${i}`;
        row.appendChild(icviCell);
        
        tableBody.appendChild(row);
        
        // Calculate CVR and I-CVI for this row
        calculateRowCVR(i);
    }
}

// Update table headers
function updateTableHeaders() {
    const expertHeader = document.querySelector('.expert-header');
    const headerRow = document.querySelector('thead tr:last-child');
    
    if (!expertHeader || !headerRow) return;
    
    // Mevcut uzman başlıklarını temizle
    const existingExpertHeaders = headerRow.querySelectorAll('.expert-header');
    existingExpertHeaders.forEach(header => {
        if (header.textContent.startsWith('E')) {
            header.remove();
        }
    });
    
    if (tableData.columns > 0) {
        expertHeader.setAttribute('colspan', tableData.columns);
        expertHeader.textContent = `Experts (${tableData.columns})`;
        
        // Uzman başlıklarını ekle
        const resultHeaders = headerRow.querySelectorAll('.result-header');
        
        for (let i = 1; i <= tableData.columns; i++) {
            const th = document.createElement('th');
            th.className = 'expert-header';
            th.textContent = `Expert ${i}`;
            headerRow.insertBefore(th, resultHeaders[0]);
        }
    } else {
        expertHeader.setAttribute('colspan', '0');
        expertHeader.textContent = 'Experts';
    }
}

// Calculate CVR and I-CVI for a specific row
function calculateRowCVR(rowIndex) {
    const row = tableData.data[rowIndex];
    if (!row) return;
    
    let relevantCount = 0;
    let totalCount = 0;
    
    for (let i = 0; i < row.length; i++) {
        const value = row[i];
        if (value !== '' && value !== null && value !== undefined) {
            const binaryValue = convertValueToBinary(value);
            if (binaryValue === 1) {
                relevantCount++;
            }
            totalCount++;
        }
    }
    
    const cvr = calculateCVR(relevantCount, totalCount);
    const icvi = calculateItemICVI(rowIndex);
    
    // Update CVR cell
    const cvrCell = document.getElementById(`cvr-${rowIndex}`);
    if (cvrCell) {
        cvrCell.textContent = totalCount > 0 ? cvr.toFixed(3) : '-';
        cvrCell.className = `result-cell cvr-cell ${getCVRColor(cvr, totalCount)}`;
    }
    
    // Update I-CVI cell
    const icviCell = document.getElementById(`icvi-${rowIndex}`);
    if (icviCell) {
        icviCell.textContent = totalCount > 0 ? icvi.toFixed(3) : '-';
        icviCell.className = `result-cell icvi-cell ${getICVIColor(icvi, totalCount)}`;
    }
}

// Calculate all CVRs
function calculateAllCVRs() {
    for (let i = 0; i < tableData.rows; i++) {
        calculateRowCVR(i);
    }
    
    // Calculate overall CVI
    let totalCVR = 0;
    let validItems = 0;
    
    for (let i = 0; i < tableData.rows; i++) {
        const row = tableData.data[i];
        if (!row) continue;
        
        let relevantCount = 0;
        let totalCount = 0;
        
        for (let j = 0; j < row.length; j++) {
            const value = row[j];
            if (value !== '' && value !== null && value !== undefined) {
                const binaryValue = convertValueToBinary(value);
                if (binaryValue === 1) {
                    relevantCount++;
                }
                totalCount++;
            }
        }
        
        if (totalCount > 0) {
            const cvr = calculateCVR(relevantCount, totalCount);
            totalCVR += cvr;
            validItems++;
        }
    }
    
    const cvi = validItems > 0 ? totalCVR / validItems : 0;
    const scviAve = calculateSCVIAve();
    const scviUA = calculateSCVIUA();
    
    // Update CVI display
    document.getElementById('cviValue').textContent = cvi.toFixed(3);
    document.getElementById('cviValue').className = `summary-value ${getCVIColor(cvi)}`;
    
    document.getElementById('scviAveValue').textContent = scviAve.toFixed(3);
    document.getElementById('scviAveValue').className = `summary-value ${getSCVIAveColor(scviAve)}`;
    
    document.getElementById('scviUAValue').textContent = scviUA.toFixed(3);
    document.getElementById('scviUAValue').className = `summary-value ${getSCVIUAColor(scviUA)}`;
}

// Update empty cell styles
function updateEmptyCellStyles() {
    const cells = document.querySelectorAll('.data-cell');
    cells.forEach(cell => {
        if (cell.textContent.trim() === '') {
            cell.classList.add('empty-cell');
        } else {
            cell.classList.remove('empty-cell');
        }
    });
}

// Update CVI
function updateCVI() {
    calculateAllCVRs();
}

// Clear table
function clearTable() {
    tableData = {
        rows: 0,
        columns: 0,
        data: []
    };
    updateTableHeaders();
    createTable();
    calculateAllCVRs();
    updateCVI();
    updateButtonStates();
}

// Paste from Excel
function pasteFromExcel() {
    const data = prompt('Paste your data from Excel (tab-separated):');
    if (!data) return;
    
    const lines = data.trim().split('\n');
    const rows = lines.map(line => line.split('\t'));
    
    // Clean up empty rows and columns
    const cleanedRows = rows.filter(row => row.some(cell => cell.trim() !== ''));
    if (cleanedRows.length === 0) return;
    
    const maxCols = Math.max(...cleanedRows.map(row => row.length));
    
    // Update table data
    tableData.rows = cleanedRows.length;
    tableData.columns = maxCols;
    tableData.data = cleanedRows.map(row => {
        const paddedRow = [...row];
        while (paddedRow.length < maxCols) {
            paddedRow.push('');
        }
        return paddedRow;
    });
    
    updateTableHeaders();
    createTable();
    calculateAllCVRs();
    updateCVI();
    updateButtonStates();
}

// Copy to Excel
function copyToExcel() {
    let csvContent = '';
    
    // Add headers
    csvContent += 'Item,';
    for (let i = 1; i <= tableData.columns; i++) {
        csvContent += `Expert ${i},`;
    }
    csvContent += 'CVR,I-CVI\n';
    
    // Add data rows
    for (let i = 0; i < tableData.rows; i++) {
        csvContent += `${i + 1},`;
        for (let j = 0; j < tableData.columns; j++) {
            const value = tableData.data[i] ? (tableData.data[i][j] || '') : '';
            csvContent += `${value},`;
        }
        
        // Add CVR and I-CVI values
        const cvrCell = document.getElementById(`cvr-${i}`);
        const icviCell = document.getElementById(`icvi-${i}`);
        const cvrValue = cvrCell ? cvrCell.textContent : '-';
        const icviValue = icviCell ? icviCell.textContent : '-';
        csvContent += `${cvrValue},${icviValue}\n`;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(csvContent).then(() => {
        alert('Data copied to clipboard! You can paste it into Excel.');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy data. Please try again.');
    });
}

// Update button states
function updateButtonStates() {
    const removeRowBtn = document.getElementById('removeRow');
    const removeColumnBtn = document.getElementById('removeColumn');
    
    removeRowBtn.disabled = tableData.rows <= 1;
    removeColumnBtn.disabled = tableData.columns <= 1;
}

// Toggle accordion
function toggleAccordion(accordionId) {
    const content = document.getElementById(accordionId);
    const icon = document.getElementById(accordionId + '-icon');
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize table
    createTable();
    calculateAllCVRs();
    updateCVI();
    updateButtonStates();
    
    // Add event listeners
    document.getElementById('addRow').addEventListener('click', function() {
        tableData.rows++;
        tableData.data.push(Array(tableData.columns).fill(''));
        createTable();
        calculateAllCVRs();
        updateCVI();
        updateButtonStates();
    });
    
    document.getElementById('removeRow').addEventListener('click', function() {
        if (tableData.rows > 1) {
            tableData.rows--;
            tableData.data.pop();
            createTable();
            calculateAllCVRs();
            updateCVI();
            updateButtonStates();
        }
    });
    
    document.getElementById('addColumn').addEventListener('click', function() {
        tableData.columns++;
        for (let i = 0; i < tableData.rows; i++) {
            if (!tableData.data[i]) {
                tableData.data[i] = Array(tableData.columns).fill('');
            } else {
                tableData.data[i].push('');
            }
        }
        updateTableHeaders();
        createTable();
        calculateAllCVRs();
        updateCVI();
        updateButtonStates();
    });
    
    document.getElementById('removeColumn').addEventListener('click', function() {
        if (tableData.columns > 1) {
            tableData.columns--;
            for (let i = 0; i < tableData.rows; i++) {
                if (tableData.data[i]) {
                    tableData.data[i].pop();
                }
            }
            updateTableHeaders();
            createTable();
            calculateAllCVRs();
            updateCVI();
            updateButtonStates();
        }
    });
    
    document.getElementById('clearTable').addEventListener('click', clearTable);
    document.getElementById('pasteData').addEventListener('click', pasteFromExcel);
    document.getElementById('copyData').addEventListener('click', copyToExcel);
    
    // Model selector
    document.getElementById('evaluationModel').addEventListener('change', function() {
        currentModel = this.value;
        updateModelDescription();
        calculateAllCVRs();
        updateCVI();
    });
    
    // Initialize model description
    updateModelDescription();
});
