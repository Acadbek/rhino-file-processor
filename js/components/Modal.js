export default class Modal {
  constructor() {
    // 1. Modal qobig'ini yaratamiz
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';

    // 2. Ichki HTML (ID ishlatmaymiz, faqat class)
    this.overlay.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">New Item</h2>
                    <button class="btn-close">&times;</button>
                </div>
                <div class="modal-body">
                    </div>
            </div>
        `;

    // 3. Sahifaga qo'shamiz
    document.body.appendChild(this.overlay);

    // 4. Elementlarni xotiraga olib qo'yamiz (tez ishlashi uchun)
    this.titleEl = this.overlay.querySelector('.modal-title');
    this.bodyEl = this.overlay.querySelector('.modal-body');
    this.closeBtn = this.overlay.querySelector('.btn-close');

    // 5. Yopish hodisalarini ulaymiz
    this._initEvents();
  }

  _initEvents() {
    // X tugmasi bosilganda
    this.closeBtn.addEventListener('click', () => this.close());

    // Orqa fonga bosilganda
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  open(title, contentHTML) {
    // Sarlavha va Contentni yangilaymiz
    this.titleEl.textContent = title;
    this.bodyEl.innerHTML = contentHTML;

    // Modalni ko'rsatamiz
    this.overlay.classList.add('open');
  }

  close() {
    this.overlay.classList.remove('open');

    // Yopilganda ichini tozalab tashlash (xotirani tejash uchun)
    setTimeout(() => {
      this.bodyEl.innerHTML = '';
    }, 300); // Animatsiya tugagandan keyin
  }
}
