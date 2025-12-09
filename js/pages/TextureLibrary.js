import Sidebar from '../components/Sidebar.js';
import TextureCard from '../components/TextureCard.js';
import { mockTextures } from '../services/mockData.js';
import Modal from '../components/Modal.js';

const textureModal = new Modal();

// Modal ichidagi Formaning HTML kodi
const getTextureFormHTML = () => `
    <form id="createTextureForm" class="texture-form">
        
        <div class="upload-box" style="height: 200px; background: #eef2f5; border: none; margin-bottom: 20px; display:flex; justify-content:center; align-items:center;">
             <div style="text-align:center; color: #888;">
                <span style="font-size:30px;">📷</span>
                <p>Click to upload Texture Image</p>
             </div>
        </div>

        <div class="form-group">
            <input type="text" class="form-control" placeholder="Texture Name" required>
        </div>
        
        <div class="form-group">
            <textarea class="form-control" placeholder="Texture Description" style="height: 60px;"></textarea>
        </div>

        <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px;">
            <input type="number" class="form-control" placeholder="Height">
            <input type="number" class="form-control" placeholder="Width">
            
            <div class="toggle-wrapper">
                <label class="switch">
                    <input type="checkbox" id="rotatableCheck">
                    <span class="slider round"></span>
                </label>
                <span style="font-size: 13px; margin-left: 8px; color: #666;">Rotatable</span>
            </div>
        </div>

        <div class="form-group">
            <input type="text" class="form-control" placeholder="Overwrite ID">
        </div>

        <div class="form-group">
            <select class="form-control">
                <option>Select Category</option>
                <option>Wood</option>
                <option>Stone</option>
                <option>Solid Color</option>
            </select>
        </div>

        <div style="display: flex; gap: 5px; margin-bottom: 20px;">
            <span class="chip">#WoodGrain x</span>
            <span class="chip">#Matte x</span>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%;">Create Texture</button>
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
                            <h2>Texture Library</h2>
                            <span class="badge">${mockTextures.length} textures</span>
                        </div>
                        <div class="header-actions">
                             <button class="btn-primary" id="btnAddTexture">+ Add Texture</button>
                        </div>
                    </header>
                    
                    <div id="textureGrid" class="products-grid">
                        </div>
                </main>
            </div>
        `;
  },

  afterRender: () => {
    const grid = document.getElementById('textureGrid');
    grid.innerHTML = mockTextures.map(t => TextureCard(t)).join('');

    // Modalni ochish
    document.getElementById('btnAddTexture').addEventListener('click', () => {
      textureModal.open('Create a New Texture', getTextureFormHTML());

      // Form submit logikasi
      setTimeout(() => {
        document.getElementById('createTextureForm').addEventListener('submit', (e) => {
          e.preventDefault();
          alert("Texture Created!");
          textureModal.close();
        });
      }, 100);
    });
  }
};
