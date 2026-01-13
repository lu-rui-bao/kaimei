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
       
        // 材料参数按钮 + 标签
        this.config.contents.forEach((t, i) =>
            this.makeButton(t, this.config.buttonNames[i], this.buttonWall, this.config, i)
        );

        // 成品参数按钮 + 标签
        FINISH_CONFIG.contents.forEach((t, i) =>
            this.makeButton(t, FINISH_CONFIG.buttonNames[i], this.finishWall, FINISH_CONFIG, i)
        );
    }

    makeButton(text, name, container, cfg, idx){
        const btn = document.createElement('button');
        btn.className = 'material-btn';

        /* 勾选框 */
        const check = document.createElement('span');
        check.className = 'check';

        /* 右侧内容区 */
        const content = document.createElement('div');
        content.className = 'btn-content';
        content.innerHTML = `<span class="btn-text">${name}</span>`;

        /* 标签条 */
        const tagBar = document.createElement('div');
        tagBar.className = 'tag-bar';
        (cfg.tags?.[idx] || []).forEach(t => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = t;
            // 简单换色：把“环保|blue”这种写法拆开
            if (t.includes('|')) {
                const [txt, color] = t.split('|');
                tag.textContent = txt;
                tag.dataset.color = color;
            }
            tagBar.appendChild(tag);
        });
        content.appendChild(tagBar);

        btn.append(check, content);
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