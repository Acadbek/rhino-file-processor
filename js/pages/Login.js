export default {
  render: () => {
    return `
            <div class="login-container">
                <div style="background: white; padding: 40px; border-radius: 12px; width: 400px; text-align: center;">
                    <h2 style="color: #3b7486; margin-bottom: 10px;">rhino-file-processor</h2>
                    <p>Welcome to the Future of Design</p>
                    <br>
                    <button onclick="window.location.hash = '#/products'" style="width: 100%; padding: 10px; background: #3b7486; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Sign In (Demo)
                    </button>
                </div>
            </div>
        `;
  }
};
