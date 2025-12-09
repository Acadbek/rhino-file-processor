export default function Sidebar() {
    const path = window.location.hash.slice(1);

    return `
        <aside class="sidebar">
            <h2 style="margin-bottom: 30px; color: #3b7486;">PINFORM</h2>
            <nav>
                <a href="#/products" class="${path === '/products' ? 'active' : ''}">Product Library</a>
                <a href="#/textures" class="${path === '/textures' ? 'active' : ''}">Texture Library</a>
                <a href="#/calculator" class="${path === '/calculator' ? 'active' : ''}">Calculator</a>
                <a href="#/settings" class="${path === '/settings' ? 'active' : ''}">Factory Settings</a>
                <a href="#/" style="margin-top: auto; color: red;">Logout</a>
            </nav>
        </aside>
    `;
}
