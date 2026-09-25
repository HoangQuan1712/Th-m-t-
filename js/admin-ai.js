/* ============================================================
   THÁM TỬ KINH TẾ — ADMIN AI EXTRACTION ENGINE
   Gemini API integration for PDF/URL case auto-extraction
   ============================================================ */

const ADMIN_AI = {
  GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  API_KEY_STORAGE: 'thamtu_gemini_key', // sessionStorage key
  STATUS_STEPS: [
    { id: 'read',     label: 'Đang đọc & phân tích tài liệu...',      icon: '📄' },
    { id: 'extract',  label: 'Đang trích xuất thông tin vụ án...',     icon: '🔍' },
    { id: 'standard', label: 'Đang đối chiếu chuẩn mực VSA/ISA...',   icon: '📋' },
    { id: 'format',   label: 'Đang định dạng dữ liệu đầu ra...',       icon: '✨' }
  ],

  EXTRACTION_PROMPT: `Bạn là Trợ lý Thám tử Kinh tế chuyên phân tích vụ gian lận tài chính.
Hãy đọc tài liệu/bài báo sau và bóc tách thành định dạng JSON chuẩn.
QUAN TRỌNG: Chỉ trả về JSON thuần túy, không có markdown code block, không có giải thích thêm.

Cấu trúc JSON yêu cầu:
{
  "title": "Tên vụ án / Tên doanh nghiệp",
  "year": 2024,
  "country": "VN",
  "sector": "Lĩnh vực ngành",
  "damage": "Mức thiệt hại ước tính (ví dụ: 500 tỷ VNĐ hoặc $1.2B USD)",
  "damageValue": 500000000,
  "severity": "critical",
  "icon": "🏢",
  "trickShort": "Tóm tắt ngắn mánh khóe kế toán trong 1-2 câu",
  "categories": ["trai-phieu", "bat-dong-san"],
  "standards": ["VSA 240", "ISA 505"],
  "timeline": {
    "context": "Bối cảnh doanh nghiệp và thị trường (2-3 đoạn)",
    "trick": "Mánh khóe kế toán chi tiết đã sử dụng (2-3 đoạn)",
    "audit_failure": "Sơ hở và lỗi của kiểm toán viên (2-3 đoạn)",
    "consequence": "Hậu quả pháp lý, hình phạt và bài học (2-3 đoạn)"
  },
  "lessons": [
    "Bài học 1 kèm chuẩn mực liên quan",
    "Bài học 2 kèm chuẩn mực liên quan",
    "Bài học 3 kèm chuẩn mực liên quan"
  ]
}

Danh sách categories hợp lệ: ["doanh-thu", "hang-ton-kho", "no-phai-tra", "tien-mat", "bat-dong-san", "trai-phieu", "tai-san-co-dinh", "chi-phi", "ngan-hang", "tai-san-ao", "dau-tu", "cong-ty-lien-ket"]
Severity: "critical" (>$1B), "high" ($100M-$1B), "medium" ($10M-$100M), "low" (<$10M)

Tài liệu cần phân tích:
---
`,

  /* ── API Key Management ─────────────────────────────────── */
  getApiKey() {
    return sessionStorage.getItem(this.API_KEY_STORAGE) || '';
  },

  saveApiKey(key) {
    if (!key || key.length < 20) return false;
    sessionStorage.setItem(this.API_KEY_STORAGE, key.trim());
    return true;
  },

  clearApiKey() {
    sessionStorage.removeItem(this.API_KEY_STORAGE);
  },

  /* ── File Reader ────────────────────────────────────────── */
  async readPdfAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // For demo: read as text (works for .txt files)
        // For real PDF: would need PDF.js library
        try {
          const text = e.target.result;
          resolve(typeof text === 'string' ? text : `[Nội dung file: ${file.name}]`);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      if (file.type === 'application/pdf') {
        // PDF.js would be used here; for demo, read as ArrayBuffer and notify
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          resolve(`[Nội dung file PDF: ${file.name} - ${(file.size / 1024).toFixed(1)} KB]\n` +
                  `Đây là file PDF. Trong bản demo, vui lòng copy-paste nội dung văn bản từ PDF vào ô URL hoặc sử dụng file .txt.`);
        };
      } else {
        reader.readAsText(file, 'utf-8');
      }
    });
  },

  /* ── URL Content Fetch ──────────────────────────────────── */
  async fetchUrlContent(url) {
    // Use allorigins.win as CORS proxy for demo
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(15000) });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      // Strip HTML tags
      const text = data.contents
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 8000); // Limit to 8000 chars
      return text;
    } catch (err) {
      throw new Error(`Không thể tải URL: ${err.message}. Thử dán trực tiếp nội dung bài báo vào ô bên dưới.`);
    }
  },

  /* ── Call Gemini API ────────────────────────────────────── */
  async callGemini(content) {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error('Chưa nhập Gemini API Key!');

    const body = {
      contents: [{
        parts: [{ text: this.EXTRACTION_PROMPT + content }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096
      }
    };

    const resp = await fetch(`${this.GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000)
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const msg = err?.error?.message || `API Error ${resp.status}`;
      if (resp.status === 400) throw new Error('API Key không hợp lệ hoặc nội dung vi phạm chính sách.');
      if (resp.status === 429) throw new Error('Đã vượt giới hạn API. Vui lòng thử lại sau 1 phút.');
      throw new Error(msg);
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('AI không trả về kết quả. Thử lại với nội dung rõ ràng hơn.');
    return text;
  },

  /* ── Parse AI Response ──────────────────────────────────── */
  parseResponse(text) {
    let json = text.trim();
    // Remove possible markdown code fences
    json = json.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
    // Try to find JSON object in response
    const match = json.match(/\{[\s\S]*\}/);
    if (match) json = match[0];
    return JSON.parse(json);
  },

  /* ── Status UI Helpers ──────────────────────────────────── */
  setStatusStep(stepId, state) {
    const el = document.getElementById(`ai-step-${stepId}`);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (state === 'active') el.classList.add('active');
    if (state === 'done') {
      el.classList.add('done');
      el.querySelector('.step-icon').textContent = '✅';
    }
  },

  showLoading(show = true) {
    const loader = document.getElementById('ai-loading');
    const btn = document.getElementById('btn-ai-extract');
    if (loader) loader.style.display = show ? 'flex' : 'none';
    if (btn) {
      btn.disabled = show;
      btn.innerHTML = show
        ? '<span class="spinner"></span> Đang phân tích...'
        : '🪄 Phân tích & Bóc tách bằng AI';
    }
  },

  showResult(show = true) {
    const result = document.getElementById('ai-result-section');
    if (result) result.style.display = show ? 'block' : 'none';
  },

  /* ── Fill form with AI data ─────────────────────────────── */
  fillForm(data) {
    const fields = {
      'field-title':        data.title || '',
      'field-year':         data.year || new Date().getFullYear(),
      'field-country':      data.country || '',
      'field-sector':       data.sector || '',
      'field-damage':       data.damage || '',
      'field-trick-short':  data.trickShort || '',
      'field-context':      data.timeline?.context || '',
      'field-trick':        data.timeline?.trick || '',
      'field-audit':        data.timeline?.audit_failure || '',
      'field-consequence':  data.timeline?.consequence || '',
      'field-lessons':      (data.lessons || []).join('\n')
    };

    Object.entries(fields).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = value;
        el.classList.add('ai-filled');
        // Remove highlight after 5s
        setTimeout(() => el.classList.remove('ai-filled'), 5000);
      }
    });

    // Standards multi-select
    if (data.standards?.length) {
      const standardsList = document.getElementById('field-standards-display');
      if (standardsList) {
        standardsList.innerHTML = data.standards.map(s =>
          `<span class="badge badge-red">${s} <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:4px;">×</button></span>`
        ).join('');
      }
    }

    // Categories
    if (data.categories?.length) {
      data.categories.forEach(cat => {
        const checkbox = document.querySelector(`input[name="category"][value="${cat}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    // Severity
    const severityEl = document.getElementById('field-severity');
    if (severityEl && data.severity) severityEl.value = data.severity;

    // Store for export
    window._aiExtractedData = data;
  },

  /* ── Main Extraction Flow ───────────────────────────────── */
  async extract(inputType, inputValue) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      showToast('⚠️ Chưa nhập Gemini API Key!', 'error');
      document.getElementById('admin-api-key')?.focus();
      return;
    }

    this.showLoading(true);
    this.showResult(false);

    // Reset steps
    this.STATUS_STEPS.forEach(s => this.setStatusStep(s.id, ''));

    try {
      // Step 1: Read document
      this.setStatusStep('read', 'active');
      let content = '';
      if (inputType === 'url') {
        content = await this.fetchUrlContent(inputValue);
      } else if (inputType === 'text') {
        content = inputValue;
      } else if (inputType === 'file') {
        content = await this.readPdfAsText(inputValue);
      }
      this.setStatusStep('read', 'done');

      if (!content || content.length < 50) {
        throw new Error('Nội dung quá ngắn để phân tích. Vui lòng cung cấp thêm thông tin.');
      }

      // Step 2: AI Extract
      this.setStatusStep('extract', 'active');
      const rawResponse = await this.callGemini(content);
      this.setStatusStep('extract', 'done');

      // Step 3: Map standards
      this.setStatusStep('standard', 'active');
      await new Promise(r => setTimeout(r, 800)); // UX delay
      this.setStatusStep('standard', 'done');

      // Step 4: Format
      this.setStatusStep('format', 'active');
      const parsed = this.parseResponse(rawResponse);
      // Generate ID
      parsed.id = (parsed.title || 'case').toLowerCase()
        .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40)
        + '-' + (parsed.year || Date.now());
      parsed.slug = parsed.id;
      parsed.featured = false;
      parsed.views = 0;
      parsed.comments = 0;
      parsed.downloads = [];
      this.setStatusStep('format', 'done');

      // Fill form
      this.fillForm(parsed);
      this.showResult(true);

      showToast('✅ Bóc tách thành công! Kiểm tra và chỉnh sửa trước khi xuất bản.', 'success', 5000);

    } catch (err) {
      console.error('AI extraction error:', err);
      showToast(`❌ Lỗi: ${err.message}`, 'error', 6000);
    } finally {
      this.showLoading(false);
    }
  },

  /* ── Save to localStorage ───────────────────────────────── */
  saveCase() {
    const data = window._aiExtractedData || this.collectFormData();
    if (!data || !data.title) {
      showToast('❌ Chưa có dữ liệu để lưu!', 'error');
      return;
    }

    const existing = JSON.parse(localStorage.getItem('thamtu_cases') || '[]');
    const idx = existing.findIndex(c => c.id === data.id);
    if (idx >= 0) {
      existing[idx] = data;
    } else {
      existing.unshift(data);
    }
    localStorage.setItem('thamtu_cases', JSON.stringify(existing));

    showToast(`✅ Đã lưu vụ án "${data.title}" vào kho dữ liệu!`, 'success', 4000);

    // Show export JSON
    const exportEl = document.getElementById('export-json');
    if (exportEl) {
      exportEl.textContent = JSON.stringify(data, null, 2);
      exportEl.parentElement.style.display = 'block';
    }
  },

  collectFormData() {
    const get = (id) => document.getElementById(id)?.value?.trim() || '';
    const lessons = get('field-lessons').split('\n').filter(Boolean);
    const standards = Array.from(document.querySelectorAll('#field-standards-display .badge'))
      .map(el => el.textContent.replace('×', '').trim());
    const categories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
      .map(el => el.value);

    return {
      id: (get('field-title') || 'case').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40) + '-' + get('field-year'),
      slug: (get('field-title') || 'case').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40) + '-' + get('field-year'),
      title: get('field-title'),
      year: parseInt(get('field-year')) || new Date().getFullYear(),
      country: get('field-country'),
      sector: get('field-sector'),
      damage: get('field-damage'),
      damageValue: 0,
      damageVND: get('field-country') === 'VN' ? get('field-damage') : null,
      severity: get('field-severity') || 'high',
      icon: '📋',
      trickShort: get('field-trick-short'),
      categories,
      standards,
      featured: false,
      views: 0,
      comments: 0,
      countryFlag: get('field-country') === 'VN' ? '🇻🇳' : '🌐',
      timeline: {
        context: get('field-context'),
        trick: get('field-trick'),
        audit_failure: get('field-audit'),
        consequence: get('field-consequence')
      },
      lessons,
      downloads: []
    };
  },

  /* ── Export JSON ────────────────────────────────────────── */
  copyJson() {
    const el = document.getElementById('export-json');
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
      showToast('✅ Đã copy JSON vào clipboard!', 'success', 2000);
    });
  },

  /* ── Init drag & drop ───────────────────────────────────── */
  initDropZone() {
    const zone = document.getElementById('pdf-drop-zone');
    if (!zone) return;

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) this.handleFileSelect(file);
    });

    const fileInput = document.getElementById('pdf-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) this.handleFileSelect(e.target.files[0]);
      });
    }

    zone.addEventListener('click', () => fileInput?.click());
  },

  handleFileSelect(file) {
    const zone = document.getElementById('pdf-drop-zone');
    if (zone) {
      zone.innerHTML = `
        <div class="drop-zone-icon">📄</div>
        <p><span>${file.name}</span></p>
        <p class="text-xs text-muted">${(file.size / 1024).toFixed(1)} KB · ${file.type || 'file'}</p>
      `;
    }
    window._selectedFile = file;
    showToast(`📄 Đã chọn file: ${file.name}`, 'info', 2500);
  }
};
