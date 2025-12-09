import Sidebar from '../components/Sidebar.js';
import ProductCard from '../components/ProductCard.js';
import { mockProducts } from '../services/mockData.js';
import Modal from '../components/Modal.js';

const productModal = new Modal();

const getCreateFormHTML = () => `
    <form id="createProductForm" class="form-layout">
        <div class="left-col">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Product Name" required>
            </div>
            <div class="form-group">
                <textarea class="form-control" placeholder="Product Description"></textarea>
            </div>

            <label style="font-size:12px; color:#666;">Dimensions</label>
            <div class="grid-inputs">
                <input type="number" class="form-control" placeholder="Min X">
                <input type="number" class="form-control" placeholder="Min Y">
                <input type="number" class="form-control" placeholder="Min Z">
                <input type="number" class="form-control" placeholder="Max X">
                <input type="number" class="form-control" placeholder="Max Y">
                <input type="number" class="form-control" placeholder="Max Z">
            </div>

            <div class="form-group">
                <input type="number" class="form-control" placeholder="Starting Price ($)">
            </div>

            <label style="font-size:12px; color:#666;">Multipliers</label>
            <div class="grid-inputs">
                <input type="number" class="form-control" placeholder="Mlt X">
                <input type="number" class="form-control" placeholder="Mlt Y">
                <input type="number" class="form-control" placeholder="Mlt Z">
            </div>

            <div class="form-group">
                <select class="form-control">
                    <option>Select Category</option>
                    <option>Storage</option>
                    <option>Kitchen</option>
                    <option>Office</option>
                </select>
            </div>
        </div>

        <div class="right-col">
            <label style="font-size:12px; color:#666;">Product Manual</label>
            <div class="upload-box">
                <span class="upload-icon">📄</span>
                <span class="upload-label">Click to upload PDF</span>
            </div>

            <label style="font-size:12px; color:#666;">Featured Photos</label>
            <div class="photos-grid">
                <div class="photo-slot">+</div>
                <div class="photo-slot">+</div>
                <div class="photo-slot">+</div>
            </div>

            <label style="font-size:12px; color:#666;">Rhino File (.3dm)</label>
            <div class="upload-box" style="height: 150px; display: flex; flex-direction: column; justify-content: center;">
                <span class="upload-icon">📦</span>
                <span class="upload-label">Drag or Click to upload 3D Model</span>
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px;">Submit</button>
        </div>
    </form>
`;

export default {
    render: () => {
        return `
            <div class="dashboard-layout">
                ${Sidebar()}
                
                <main class="main-content">
                    <header class="page-header">
                        <div class="header-title">
                            <h2>Product Library</h2>
                            <span class="badge">${mockProducts.length} products</span>
                        </div>
                        
                        <div class="header-actions">
                            <input type="text" id="searchInput" placeholder="Search products..." class="search-input">
                            <button class="btn-primary" id="btnAdd">+ Add Product</button>
                        </div>
                    </header>
                    
                    <div id="productsGrid" class="products-grid">
                        </div>
                </main>
            </div>
        `;
    },

    afterRender: () => {
        const grid = document.getElementById('productsGrid');
        const searchInput = document.getElementById('searchInput');

        // 1. Mahsulotlarni chizish funksiyasi
        function renderList(items) {
            if (items.length === 0) {
                grid.innerHTML = '<p style="text-align:center; width:100%;">No products found.</p>';
                return;
            }
            // Har bir item uchun ProductCard chaqiramiz va birlashtiramiz
            grid.innerHTML = items.map(item => ProductCard(item)).join('');
        }

        // Boshlanishida hamma mahsulotni chiqaramiz
        renderList(mockProducts);

        document.getElementById('btnAdd').addEventListener('click', () => {
            // Modalni ochamiz va ichiga Formani joylaymiz
            productModal.open('Create a New Product', getCreateFormHTML());

            // Modal ochilgandan keyin, ichidagi "Submit" knopkaga event ulaymiz
            // Chunki HTML endi paydo bo'ldi
            const form = document.getElementById('createProductForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Forma yuborildi! (Hozircha faqat alert)');
                productModal.close();
            });
        });

        // 2. Search (Qidiruv) Logikasi
        searchInput.addEventListener('input', (e) => {
            const text = e.target.value.toLowerCase();

            // Filter qilish
            const filtered = mockProducts.filter(p =>
                p.name.toLowerCase().includes(text) ||
                p.description.toLowerCase().includes(text)
            );

            renderList(filtered);
        });

        // 3. Add tugmasi (Keyinchalik Modal ochamiz)
        // document.getElementById('btnAdd').addEventListener('click', () => {
        //     alert("Keyingi qadamda bu yerda katta Forma ochiladi!");
        // });
    }
};
