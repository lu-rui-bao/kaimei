class MaterialManager {
    constructor(config) {
        this.config = config;
        this.mergedContents = [];
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.tableBody = document.getElementById('tableBody');
        this.mergedContentDiv = document.getElementById('mergedContent');
        this.copyFeedback = document.getElementById('copyFeedback');
    }

    bindEvents() {
        // 绑定按钮事件
        document.getElementById('clearBtn').addEventListener('click', () => this.clearMergedContent());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyMergedContent());
    }

    renderTable() {
        this.config.contents.forEach((content, index) => {
            const row = this.createTableRow(content, index);
            this.tableBody.appendChild(row);
        });
    }

    createTableRow(content, index) {
        const row = document.createElement('tr');

        const cell1 = document.createElement('td');
        cell1.textContent = index + 1;

        const cell2 = document.createElement('td');
        cell2.textContent = content;
        cell2.id = `content${index + 1}`;

        const cell3 = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = this.config.buttonNames[index];
        button.className = 'add';                             // ★ 1. 加 class
        button.addEventListener('click', () => this.toggleMergeContent(index + 1));
        cell3.appendChild(button);

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        return row;
    }

    toggleMergeContent(rowNumber) {
        const contentId = `content${rowNumber}`;
        const content = document.getElementById(contentId).innerText;
        const contentIndex = this.mergedContents.indexOf(content);

        /* ★ 新增 ★ */
        const btn = document.querySelector(`#tableBody tr:nth-child(${rowNumber}) button.add`);
        btn.classList.toggle('selected', contentIndex === -1);

        if (contentIndex === -1) {
            this.mergedContents.push(content);
        } else {
            this.mergedContents.splice(contentIndex, 1);
        }
        this.updateMergedDisplay();
    }

    updateMergedDisplay() {
        this.mergedContentDiv.innerText = '';
        this.mergedContents.forEach((content, index) => {
            this.mergedContentDiv.innerText += `${index + 1}、${content}\n`;
        });
    }

    clearMergedContent() {
        this.mergedContentDiv.innerText = '';
        this.mergedContents = [];
    }

    copyMergedContent() {
        const textArea = document.createElement('textarea');
        textArea.value = this.mergedContentDiv.innerText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            this.copyFeedback.textContent = successful ? '√' : '×';

            setTimeout(() => {
                this.copyFeedback.textContent = '';
            }, 2000);
        } catch (err) {
            console.error('无法复制', err);
            this.copyFeedback.textContent = '×';
        }

        document.body.removeChild(textArea);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new MaterialManager(MATERIAL_CONFIG);
    app.renderTable();
});