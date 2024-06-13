document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);
document.getElementById('processButton').addEventListener('click', processCSV);

let csvContent = '';
let csvHeaders = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            csvContent = e.target.result;
            parseCSVHeaders(csvContent);
        };
        reader.readAsText(file);
    }
}

function parseCSVHeaders(csvContent) {
    const lines = csvContent.split('\n');
    if (lines.length > 0) {
        csvHeaders = lines[0].split(',');
        populateHeaderSelect(csvHeaders);
    }
}

function populateHeaderSelect(headers) {
    const headerSelect = document.getElementById('headerSelect');
    headerSelect.innerHTML = '';

    headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = header;
        headerSelect.appendChild(option);
    });

    document.getElementById('headerSelectContainer').classList.remove('hidden');
    document.getElementById('processButton').classList.remove('hidden');
}

function processCSV() {
    const selectedHeaderIndex = document.getElementById('headerSelect').value;
    const lines = csvContent.split('\n');
    let gmailCount = 0;
    
    const filteredLines = lines.filter((line, index) => {
        if (index === 0) return true; // Keep the header row
        const columns = line.split(',');
        const email = columns[selectedHeaderIndex].trim();
        if (email.toLowerCase().includes('@gmail.com')) {
            gmailCount++;
            return false;
        }
        return true;
    });

    const cleanedCSVContent = filteredLines.join('\n');
    displayRemovedCount(gmailCount);
    downloadCSV(cleanedCSVContent);
}

function displayRemovedCount(count) {
    const resultCard = document.getElementById('resultCard');
    resultCard.innerHTML = `
        <div class="card">
            <h3>Processing Results</h3>
            <p>Number of Gmail addresses removed: <strong>${count}</strong></p>
        </div>
    `;
    resultCard.classList.remove('hidden');
}

function downloadCSV(content) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById('downloadLink');
    
    link.href = url;
    link.download = 'cleaned-Google.csv';
    link.classList.remove('hidden');

    // Hide process button and show download button
    document.getElementById('processButton').classList.add('hidden');
}
