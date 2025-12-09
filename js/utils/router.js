import Login from '../pages/Login.js';
import Dashboard from '../pages/Dashboard.js';
import ProductLibrary from '../pages/ProductLibrary.js';

const routes = {
  '/': Login,
  '/dashboard': Dashboard,
  '/products': ProductLibrary,
  // Boshqa sahifalar shu yerga qo'shiladi
};

export function initRouter() {
  const app = document.getElementById('app');

  function navigate() {
    const path = window.location.hash.slice(1) || '/';
    const page = routes[path];

    if (page) {
      app.innerHTML = page.render(); // HTML chizadi
      if (page.afterRender) page.afterRender(); // Event listenerlarni ulaydi
    } else {
      app.innerHTML = '<h1>404 - Sahifa topilmadi</h1>';
    }
  }

  window.addEventListener('hashchange', navigate);
  window.addEventListener('load', navigate);
}
