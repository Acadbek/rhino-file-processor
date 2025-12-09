import Sidebar from '../components/Sidebar.js';
import rhino3dm from 'https://unpkg.com/rhino3dm@8.17.0/rhino3dm.module.js';
import Viewer3D from '../components/Viewer3D.js';

let rhino = null;
let viewer = null;
let rawData = [];

// State (Holat)
let state = {
    unit: 'mm',
    search: '',
    sortBy: 'material'
};

async function initRhino() {
    if (!rhino) {
        try { rhino = await rhino3dm(); } catch (e) { console.error(e); }
    }
}

export default {
    render: () => {
        return `
            <div class="dashboard-layout">
                ${Sidebar()}
                <main class="main-content">
                    <header class="page-header">
                        <h2>Production Calculator</h2>
                        <p style="color: #666;">Smart Cutting List & Analysis</p>
                    </header>

                    <div class="calculator-container" style="max-width: 1100px; margin: 0 auto; margin-top: 20px;">
                        
                        <div id="dropZone" class="upload-area">
                            <div class="upload-content">
                                <span style="font-size: 48px;">🪚</span>
                                <h3>Drop .3dm file here</h3>
                                <button class="btn-primary" id="btnSelectFile" style="margin-top:10px;">Select File</button>
                                <input type="file" id="fileInput" hidden accept=".3dm">
                            </div>
                            <div id="loader" style="display:none;">
                                <div class="spinner"></div>
                                <p>Analyzing Geometry...</p>
                            </div>
                        </div>

                        <div id="resultsArea" style="display: none; margin-top: 30px;">
                            
                            <div style="background: white; border-radius: 8px; border: 1px solid #ddd; overflow: hidden; margin-bottom: 20px;">
                                <div style="padding: 10px 15px; background: #f9f9f9; border-bottom: 1px solid #ddd; font-weight: 600;">3D Preview</div>
                                <div id="viewer3d" style="width: 100%; height: 350px;"></div>
                            </div>

                            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                                <div class="stat-card" style="background:white; padding:15px; border-radius:8px; border:1px solid #eee;">
                                    <small style="color:#888;">Total Parts</small>
                                    <h3 id="statTotalParts">0</h3>
                                </div>
                                <div class="stat-card" style="background:white; padding:15px; border-radius:8px; border:1px solid #eee;">
                                    <small style="color:#888;">Unique Materials</small>
                                    <h3 id="statMaterials">0</h3>
                                </div>
                                <div class="stat-card" style="background:#e8f5e9; padding:15px; border-radius:8px; border:1px solid #c8e6c9;">
                                    <small style="color:#2e7d32;">Total Area (Approx)</small>
                                    <h3 id="statArea" style="color:#2e7d32;">0 m²</h3>
                                </div>
                            </div>

                            <div style="display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap; align-items:center; background:white; padding:10px; border-radius:8px;">
                                <input type="text" id="searchInput" placeholder="Search part or material..." style="padding:8px; border:1px solid #ddd; border-radius:4px; flex:1;">
                                
                                <select id="sortSelect" style="padding:8px; border:1px solid #ddd; border-radius:4px;">
                                    <option value="material">Sort by Material</option>
                                    <option value="length">Sort by Length</option>
                                    <option value="qty">Sort by Quantity</option>
                                </select>

                                <div style="display:flex; border:1px solid #ddd; border-radius:4px; overflow:hidden;">
                                    <button class="unit-btn active" data-unit="mm" style="padding:8px 15px; border:none; cursor:pointer; background:#3b7486; color:white;">mm</button>
                                    <button class="unit-btn" data-unit="cm" style="padding:8px 15px; border:none; cursor:pointer; background:white;">cm</button>
                                </div>

                                <button id="btnExport" class="btn-primary" style="background:#27ae60; padding:8px 15px;">⬇ Excel</button>
                            </div>

                            <div style="background: white; border-radius: 8px; border: 1px solid #eee; overflow: hidden;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                    <thead style="background: #3b7486; color: white;">
                                        <tr>
                                            <th style="padding: 12px; text-align: left;">#</th>
                                            <th style="padding: 12px; text-align: left;">Material</th>
                                            <th style="padding: 12px; text-align: left;">Name</th>
                                            <th style="padding: 12px; text-align: right;">L (<span class="unit-label">mm</span>)</th>
                                            <th style="padding: 12px; text-align: right;">W (<span class="unit-label">mm</span>)</th>
                                            <th style="padding: 12px; text-align: center;">Thk (<span class="unit-label">mm</span>)</th>
                                            <th style="padding: 12px; text-align: center;">QTY</th>
                                            <th style="padding: 12px; text-align: right;">Area (m²)</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    afterRender: async () => {
        initRhino();
        const elements = {
            dropZone: document.getElementById('dropZone'),
            fileInput: document.getElementById('fileInput'),
            loader: document.getElementById('loader'),
            content: document.querySelector('.upload-content'),
            resultsArea: document.getElementById('resultsArea'),
            tableBody: document.getElementById('tableBody'),
            searchInput: document.getElementById('searchInput'),
            sortSelect: document.getElementById('sortSelect'),
            unitBtns: document.querySelectorAll('.unit-btn'),
            unitLabels: document.querySelectorAll('.unit-label'),
            stats: {
                total: document.getElementById('statTotalParts'),
                mat: document.getElementById('statMaterials'),
                area: document.getElementById('statArea')
            }
        };

        // 1. Search
        elements.searchInput.addEventListener('input', (e) => {
            state.search = e.target.value.toLowerCase();
            renderTable();
        });

        // 2. Sort
        elements.sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderTable();
        });

        // 3. Unit Toggle (mm/cm)
        elements.unitBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // UI update
                elements.unitBtns.forEach(b => {
                    b.style.background = 'white';
                    b.style.color = 'black';
                });
                e.target.style.background = '#3b7486';
                e.target.style.color = 'white';

                // State update
                state.unit = e.target.dataset.unit;

                // Headerlarni yangilash
                elements.unitLabels.forEach(lbl => lbl.textContent = state.unit);

                renderTable();
            });
        });

        // 4. File Upload
        // Drag Enter (Kirganda)
        elements.dropZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            elements.dropZone.classList.add('drag-active');
        });
        // Drag Over (Ustida ushlab turilganda)
        elements.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy'; // "Copy" ikonkasini chiqarish
            elements.dropZone.classList.add('drag-active');
        });

        // Drag Leave (Chiqib ketganda)
        elements.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Faqat haqiqatan chiqib ketsa classni o'chiramiz
            if (e.relatedTarget && !elements.dropZone.contains(e.relatedTarget)) {
                elements.dropZone.classList.remove('drag-active');
            }
        });

        // DROP (Tashlaganda)
        elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            elements.dropZone.classList.remove('drag-active');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processFile(files[0]);
            }
        });
        // elements.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); elements.dropZone.classList.add('drag-active'); });
        // elements.dropZone.addEventListener('dragleave', () => elements.dropZone.classList.remove('drag-active'));
        // elements.dropZone.addEventListener('drop', (e) => {
        //     e.preventDefault();
        //     elements.dropZone.classList.remove('drag-active');
        //     if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
        // });
        document.getElementById('btnSelectFile').addEventListener('click', () => elements.fileInput.click());
        elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) processFile(e.target.files[0]);
        });

        // 5. Export
        document.getElementById('btnExport').addEventListener('click', () => {
            if (rawData.length === 0) return alert("No data");
            downloadCSV();
        });


        async function processFile(file) {
            elements.content.style.display = 'none';
            elements.loader.style.display = 'block';
            await initRhino();

            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const buffer = e.target.result;
                    const arr = new Uint8Array(buffer);

                    // 1. Ma'lumotlarni o'qish
                    parseRhinoData(arr);

                    // 2. 3D Viewer
                    elements.loader.style.display = 'none';
                    elements.resultsArea.style.display = 'block';
                    if (!viewer) viewer = new Viewer3D('viewer3d');
                    viewer.loadModel(buffer);

                } catch (err) {
                    console.error(err);
                    alert("Error processing file");
                    elements.loader.style.display = 'none';
                    elements.content.style.display = 'block';
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function parseRhinoData(buffer) {
            const doc = rhino.File3dm.fromByteArray(buffer);
            const objects = doc.objects();
            let groups = {};

            for (let i = 0; i < objects.count; i++) {
                const obj = objects.get(i);
                const geometry = obj.geometry();
                if (!geometry) continue;

                const typeName = geometry.objectType.constructor.name;
                if (!typeName.includes('Brep') && !typeName.includes('Extrusion')) continue;

                const attr = obj.attributes();
                const layer = doc.layers().get(attr.layerIndex);
                const material = layer ? layer.name : "Default";
                const partName = attr.name || "Panel";

                const bbox = geometry.getBoundingBox();
                // Base unit har doim MM da saqlanadi
                const dims = [
                    (bbox.max[0] - bbox.min[0]) * 10,
                    (bbox.max[1] - bbox.min[1]) * 10,
                    (bbox.max[2] - bbox.min[2]) * 10
                ].sort((a, b) => b - a);

                // Grouping Key
                const uniqueKey = `${material}|${partName}|${dims[0].toFixed(0)}|${dims[1].toFixed(0)}|${dims[2].toFixed(0)}`;

                if (groups[uniqueKey]) {
                    groups[uniqueKey].qty += 1;
                } else {
                    groups[uniqueKey] = {
                        material,
                        name: partName,
                        length: parseFloat(dims[0]),
                        width: parseFloat(dims[1]),
                        thickness: parseFloat(dims[2]),
                        qty: 1
                    };
                }
            }
            doc.delete();

            // Obyektni arrayga aylantirib, global o'zgaruvchiga saqlaymiz
            rawData = Object.values(groups);

            // Statistikani hisoblash
            calculateStats();

            // Jadvalni chizish
            renderTable();
        }

        function calculateStats() {
            let totalQty = 0;
            let totalArea = 0;
            const materials = new Set();

            rawData.forEach(p => {
                totalQty += p.qty;
                materials.add(p.material);
                // Area = (L * W * Qty) / 1,000,000 (mm -> m)
                totalArea += (p.length * p.width * p.qty) / 1000000;
            });

            elements.stats.total.textContent = totalQty;
            elements.stats.mat.textContent = materials.size;
            elements.stats.area.textContent = totalArea.toFixed(2) + " m²";
        }

        // --- SMART TABLE RENDER LOGIC ---
        function renderTable() {
            let data = [...rawData];

            // 1. FILTER
            if (state.search) {
                data = data.filter(item =>
                    item.material.toLowerCase().includes(state.search) ||
                    item.name.toLowerCase().includes(state.search)
                );
            }

            // 2. SORT
            data.sort((a, b) => {
                if (state.sortBy === 'length') return b.length - a.length;
                if (state.sortBy === 'qty') return b.qty - a.qty;
                return a.material.localeCompare(b.material); // Default: Material
            });

            // 3. UNIT CONVERSION KOEFFITSIYENTI
            const factor = state.unit === 'cm' ? 0.1 : 1;
            const decimals = state.unit === 'cm' ? 1 : 0;

            // 4. CHIZISH
            if (data.length === 0) {
                elements.tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">No matching parts found.</td></tr>';
                return;
            }

            elements.tableBody.innerHTML = data.map((p, index) => {
                // Konversiya
                const displayL = (p.length * factor).toFixed(decimals);
                const displayW = (p.width * factor).toFixed(decimals);
                const displayT = (p.thickness * factor).toFixed(decimals);
                const area = ((p.length * p.width * p.qty) / 1000000).toFixed(2);

                return `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px; color:#888;">${index + 1}</td>
                        <td style="padding: 12px; font-weight:600;">${p.material}</td>
                        <td style="padding: 12px;">${p.name}</td>
                        <td style="padding: 12px; text-align:right;">${displayL}</td>
                        <td style="padding: 12px; text-align:right;">${displayW}</td>
                        <td style="padding: 12px; text-align:center; background:#f9f9f9;">${displayT}</td>
                        <td style="padding: 12px; text-align:center; font-weight:bold; color:var(--primary-color);">${p.qty}</td>
                        <td style="padding: 12px; text-align:right; color:#2e7d32;">${area}</td>
                    </tr>
                `;
            }).join('');
        }

        function downloadCSV() {
            const factor = state.unit === 'cm' ? 0.1 : 1;

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += `No,Material,Name,Length (${state.unit}),Width (${state.unit}),Thickness (${state.unit}),Quantity,Total Area (m2)\n`;

            rawData.forEach((row, index) => {
                const l = (row.length * factor).toFixed(1);
                const w = (row.width * factor).toFixed(1);
                const t = (row.thickness * factor).toFixed(1);
                const area = ((row.length * row.width * row.qty) / 1000000).toFixed(3);

                csvContent += `${index + 1},${row.material},${row.name},${l},${w},${t},${row.qty},${area}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "rhino-file-processor_CuttingList.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};
