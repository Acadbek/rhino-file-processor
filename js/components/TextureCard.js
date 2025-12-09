export default function TextureCard(texture) {
  return `
        <div class="product-card">
            <div class="card-image" style="height: 220px; background-image: url('${texture.image}'); background-size: cover; background-position: center;">
            </div>
            <div class="card-body">
                <h3 style="font-size: 14px; margin-bottom: 4px;">${texture.name}</h3>
                <p style="font-size: 12px; color: #999;">${texture.description}</p>
            </div>
            <div class="card-footer">
                <button class="btn-edit" style="width: 100%;">Edit</button>
            </div>
        </div>
    `;
}
