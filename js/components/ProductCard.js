export default function ProductCard(product) {
  return `
        <div class="product-card" data-id="${product.id}">
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="card-body">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
            <div class="card-footer">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">🗑️</button>
            </div>
        </div>
    `;
}
