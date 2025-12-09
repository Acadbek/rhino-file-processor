import Login from './pages/Login.js';
import ProductLibrary from './pages/ProductLibrary.js';
import TextureLibrary from './pages/TextureLibrary.js';
import Calculator from './pages/Calculator.js';
import Settings from './pages/Settings.js';

const routes = {
  '/': Login,
  '/products': ProductLibrary,
  '/textures': TextureLibrary,

  '/calculator': Calculator,
  '/settings': Settings
};

export function initRouter() {
  const app = document.getElementById('app');

  function render() {
    // Hashni olamiz (masalan: #/products -> /products)
    const path = window.location.hash.slice(1) || '/';

    // Sahifani topamiz
    const page = routes[path] || Login;

    // Sahifani chizamiz
    app.innerHTML = page.render();

    // Agar sahifaning eventlari bo'lsa (click, submit), ularni ulaymiz
    if (page.afterRender) {
      page.afterRender();
    }
  }

  // URL o'zgarganda ishga tushadi
  window.addEventListener('hashchange', render);
  window.addEventListener('load', render);
}
