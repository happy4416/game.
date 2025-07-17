class MemoApp {
    constructor() {
        this.memos = JSON.parse(localStorage.getItem('memos')) || [];
        this.currentMemoId = null;
        this.isModified = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderMemoList();
        this.showEmptyState();
    }
    
    setupEventListeners() {
        // 새 메모 버튼
        document.getElementById('newMemoBtn').addEventListener('click', () => {
            this.createNewMemo();
        });
        
        // 저장 버튼
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveMemo();
        });
        
        // 삭제 버튼
        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.showDeleteConfirm();
        });
        
        // 내보내기 버튼
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportMemos();
        });
        
        // 검색 입력
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchMemos(e.target.value);
        });
        
        // 제목 입력
        document.getElementById('memoTitle').addEventListener('input', () => {
            this.markAsModified();
            this.updateCharCount();
        });
        
        // 내용 입력
        document.getElementById('memoContent').addEventListener('input', () => {
            this.markAsModified();
            this.updateCharCount();
        });
        
        // 모달 이벤트
        document.getElementById('confirmYes').addEventListener('click', () => {
            this.deleteMemo();
        });
        
        document.getElementById('confirmNo').addEventListener('click', () => {
            this.hideModal();
        });
        
        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveMemo();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.createNewMemo();
            }
        });
        
        // 페이지 떠날 때 경고
        window.addEventListener('beforeunload', (e) => {
            if (this.isModified) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }
    
    createNewMemo() {
        const newMemo = {
            id: Date.now(),
            title: '',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.memos.unshift(newMemo);
        this.currentMemoId = newMemo.id;
        this.isModified = false;
        
        this.renderMemoList();
        this.loadMemo(newMemo);
        this.focusTitle();
    }
    
    saveMemo() {
        if (!this.currentMemoId) return;
        
        const title = document.getElementById('memoTitle').value.trim();
        const content = document.getElementById('memoContent').value;
        
        if (!title && !content) {
            alert('제목이나 내용을 입력해주세요.');
            return;
        }
        
        const memo = this.memos.find(m => m.id === this.currentMemoId);
        if (memo) {
            memo.title = title || '제목 없음';
            memo.content = content;
            memo.updatedAt = new Date().toISOString();
            
            this.saveMemos();
            this.renderMemoList();
            this.isModified = false;
            this.updateLastSaved();
        }
    }
    
    deleteMemo() {
        if (!this.currentMemoId) return;
        
        this.memos = this.memos.filter(m => m.id !== this.currentMemoId);
        this.saveMemos();
        this.renderMemoList();
        this.showEmptyState();
        this.currentMemoId = null;
        this.isModified = false;
        this.hideModal();
    }
    
    loadMemo(memo) {
        this.currentMemoId = memo.id;
        document.getElementById('memoTitle').value = memo.title;
        document.getElementById('memoContent').value = memo.content;
        this.isModified = false;
        this.updateCharCount();
        this.updateLastSaved();
        this.hideEmptyState();
    }
    
    renderMemoList() {
        const memoList = document.getElementById('memoList');
        memoList.innerHTML = '';
        
        if (this.memos.length === 0) {
            memoList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">메모가 없습니다</div>';
            return;
        }
        
        this.memos.forEach(memo => {
            const memoItem = document.createElement('div');
            memoItem.className = 'memo-item';
            if (memo.id === this.currentMemoId) {
                memoItem.classList.add('active');
            }
            
            const title = memo.title || '제목 없음';
            const preview = memo.content.substring(0, 100);
            const date = new Date(memo.updatedAt).toLocaleDateString('ko-KR');
            
            memoItem.innerHTML = `
                <h3>${this.escapeHtml(title)}</h3>
                <p>${this.escapeHtml(preview)}</p>
                <div class="memo-date">${date}</div>
            `;
            
            memoItem.addEventListener('click', () => {
                this.selectMemo(memo);
            });
            
            memoList.appendChild(memoItem);
        });
    }
    
    selectMemo(memo) {
        document.querySelectorAll('.memo-item').forEach(item => {
            item.classList.remove('active');
        });
        
        event.currentTarget.classList.add('active');
        this.loadMemo(memo);
    }
    
    searchMemos(query) {
        const filteredMemos = this.memos.filter(memo => 
            memo.title.toLowerCase().includes(query.toLowerCase()) ||
            memo.content.toLowerCase().includes(query.toLowerCase())
        );
        
        const memoList = document.getElementById('memoList');
        memoList.innerHTML = '';
        
        if (filteredMemos.length === 0) {
            memoList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">검색 결과가 없습니다</div>';
            return;
        }
        
        filteredMemos.forEach(memo => {
            const memoItem = document.createElement('div');
            memoItem.className = 'memo-item';
            if (memo.id === this.currentMemoId) {
                memoItem.classList.add('active');
            }
            
            const title = memo.title || '제목 없음';
            const preview = memo.content.substring(0, 100);
            const date = new Date(memo.updatedAt).toLocaleDateString('ko-KR');
            
            memoItem.innerHTML = `
                <h3>${this.escapeHtml(title)}</h3>
                <p>${this.escapeHtml(preview)}</p>
                <div class="memo-date">${date}</div>
            `;
            
            memoItem.addEventListener('click', () => {
                this.selectMemo(memo);
            });
            
            memoList.appendChild(memoItem);
        });
    }
    
    exportMemos() {
        if (this.memos.length === 0) {
            alert('내보낼 메모가 없습니다.');
            return;
        }
        
        const dataStr = JSON.stringify(this.memos, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `memos_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
    
    showDeleteConfirm() {
        if (!this.currentMemoId) return;
        
        const memo = this.memos.find(m => m.id === this.currentMemoId);
        const title = memo.title || '제목 없음';
        
        document.getElementById('confirmMessage').textContent = `"${title}" 메모를 삭제하시겠습니까?`;
        document.getElementById('confirmModal').style.display = 'block';
    }
    
    hideModal() {
        document.getElementById('confirmModal').style.display = 'none';
    }
    
    showEmptyState() {
        const editorArea = document.querySelector('.editor-area');
        if (this.memos.length === 0 || !this.currentMemoId) {
            editorArea.innerHTML = `
                <div class="empty-state">
                    <h2>📝 메모장에 오신 것을 환영합니다!</h2>
                    <p>새 메모를 작성하여 시작해보세요.</p>
                    <button class="btn btn-primary" onclick="app.createNewMemo()">첫 번째 메모 작성하기</button>
                </div>
            `;
        }
    }
    
    hideEmptyState() {
        const editorArea = document.querySelector('.editor-area');
        if (editorArea.querySelector('.empty-state')) {
            editorArea.innerHTML = `
                <div class="editor-header">
                    <input type="text" id="memoTitle" placeholder="메모 제목을 입력하세요..." class="title-input">
                    <div class="editor-controls">
                        <button id="saveBtn" class="btn btn-success">저장</button>
                        <button id="deleteBtn" class="btn btn-danger">삭제</button>
                    </div>
                </div>
                <textarea id="memoContent" placeholder="여기에 메모를 작성하세요..."></textarea>
                <div class="editor-footer">
                    <span id="charCount">0자</span>
                    <span id="lastSaved"></span>
                </div>
            `;
            this.setupEventListeners();
        }
    }
    
    updateCharCount() {
        const title = document.getElementById('memoTitle').value;
        const content = document.getElementById('memoContent').value;
        const totalChars = title.length + content.length;
        
        const charCountElement = document.getElementById('charCount');
        if (charCountElement) {
            charCountElement.textContent = `${totalChars}자`;
        }
    }
    
    updateLastSaved() {
        const lastSavedElement = document.getElementById('lastSaved');
        if (lastSavedElement) {
            const now = new Date().toLocaleTimeString('ko-KR');
            lastSavedElement.textContent = `마지막 저장: ${now}`;
        }
    }
    
    markAsModified() {
        this.isModified = true;
    }
    
    focusTitle() {
        setTimeout(() => {
            document.getElementById('memoTitle').focus();
        }, 100);
    }
    
    saveMemos() {
        localStorage.setItem('memos', JSON.stringify(this.memos));
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 앱 시작
const app = new MemoApp();