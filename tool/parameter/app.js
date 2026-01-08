class MaterialManager {
    constructor(config) {
        this.config = config;
        this.mergedContents = [];
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.buttonWall  = document.getElementById('buttonWall');
        this.finishWall  = document.getElementById('finishWall');
        this.mergedDiv   = document.getElementById('mergedContent');
        this.copyFb      = document.getElementById('copyFeedback');
    }

    bindEvents() {
        document.getElementById('clearBtn').addEventListener('click', () => this.clearMerged());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyMerged());
    }

    renderTable() {
        this.config.contents.forEach((t, i) => this.makeButton(t, this.config.buttonNames[i], this.buttonWall));
        FINISH_CONFIG.contents.forEach((t, i) => this.makeButton(t, FINISH_CONFIG.buttonNames[i], this.finishWall));
    }

    makeButton(text, name, container) {
        const btn = document.createElement('button');
        btn.className = 'material-btn';
        btn.innerHTML = `<span class="check"></span>${name}`;
        btn.addEventListener('click', () => this.toggleMerge(text, btn));
        container.appendChild(btn);
    }

    toggleMerge(text, btn) {
        const idx = this.mergedContents.indexOf(text);
        if (idx === -1) {
            this.mergedContents.push(text);
            btn.classList.add('selected');
        } else {
            this.mergedContents.splice(idx, 1);
            btn.classList.remove('selected');
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.mergedDiv.innerText = this.mergedContents.map((c, i) => `${i + 1}、${c}`).join('\n');
    }

    clearMerged() {
        this.mergedContents = [];
        this.updateDisplay();
        document.querySelectorAll('.material-btn.selected').forEach(b => b.classList.remove('selected'));
    }

    async copyMerged() {
        const text = this.mergedDiv.innerText;
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            this.copyFb.textContent = '√ 已复制';
        } catch (e) {
            this.copyFb.textContent = '× 复制失败';
        }
        setTimeout(() => this.copyFb.textContent = '', 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new MaterialManager(MATERIAL_CONFIG);
    app.renderTable();
});