/* ============================================================
   THÁM TỬ KINH TẾ — FORUM SYSTEM
   Threaded comments + upvote/downvote (localStorage)
   ============================================================ */

const FORUM = {
  STORAGE_KEY: 'thamtu_comments',
  VOTES_KEY: 'thamtu_votes',

  /* ── CRUD ───────────────────────────────────────────────── */
  getAll(caseId) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    return all[caseId] || this.getSeededComments(caseId);
  },

  save(caseId, comments) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    all[caseId] = comments;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  },

  addComment(caseId, text, parentId = null) {
    const role = AUTH.getRole();
    if (role === 'guest') {
      showToast('Vui lòng đăng nhập để bình luận!', 'info');
      return null;
    }
    const comments = this.getAll(caseId);
    const newComment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      caseId,
      parentId,
      author: AUTH.getDisplayName(),
      role: AUTH.getRole(),
      badge: AUTH.getRoleInfo().badge,
      text: text.trim(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
      timestamp: new Date().toISOString(),
      isNew: true
    };

    if (parentId) {
      const parent = this.findComment(comments, parentId);
      if (parent) parent.replies.push(newComment);
    } else {
      comments.unshift(newComment);
    }

    this.save(caseId, comments);
    return newComment;
  },

  findComment(comments, id) {
    for (const c of comments) {
      if (c.id === id) return c;
      if (c.replies && c.replies.length) {
        const found = this.findComment(c.replies, id);
        if (found) return found;
      }
    }
    return null;
  },

  vote(caseId, commentId, type) {
    // Track votes per session to prevent spam
    const votes = JSON.parse(sessionStorage.getItem(this.VOTES_KEY) || '{}');
    const key = `${caseId}_${commentId}`;

    if (votes[key] === type) {
      showToast('Bạn đã vote rồi!', 'info');
      return false;
    }

    const comments = this.getAll(caseId);
    const comment = this.findComment(comments, commentId);
    if (!comment) return false;

    // Undo previous vote
    if (votes[key]) {
      comment[votes[key] + 'votes'] = Math.max(0, comment[votes[key] + 'votes'] - 1);
    }

    comment[type + 'votes'] = (comment[type + 'votes'] || 0) + 1;
    votes[key] = type;

    this.save(caseId, comments);
    sessionStorage.setItem(this.VOTES_KEY, JSON.stringify(votes));
    return true;
  },

  getVoteState(caseId, commentId) {
    const votes = JSON.parse(sessionStorage.getItem(this.VOTES_KEY) || '{}');
    return votes[`${caseId}_${commentId}`] || null;
  },

  /* ── Seeded demo comments ───────────────────────────────── */
  getSeededComments(caseId) {
    const seeds = {
      "enron-2001": [
        {
          id: 'seed_e1', caseId, parentId: null,
          author: 'Nguyễn Minh Tú', role: 'author', badge: 'Senior Auditor',
          text: 'Vụ Enron là bài học kinh điển về tầm quan trọng của ISA 550. Điểm mấu chốt mà nhiều người bỏ qua là các SPE không chỉ là công cụ ẩn nợ — chúng còn được dùng để tạo ra "lợi nhuận" từ các giao dịch vòng tròn với chính công ty mẹ. Đây là vi phạm nguyên tắc ghi nhận doanh thu cơ bản nhất.',
          upvotes: 24, downvotes: 1, replies: [
            {
              id: 'seed_e1r1', caseId, parentId: 'seed_e1',
              author: 'Trần Thị Hoa', role: 'member', badge: 'Junior KTV',
              text: 'Thầy ơi, cho em hỏi: khi kiểm toán SPE thì KTV cần xem xét ngưỡng bao nhiêu % sở hữu để hợp nhất ạ? Theo chuẩn mực cũ hay IFRS 10?',
              upvotes: 8, downvotes: 0, replies: [],
              timestamp: '2024-11-15T09:23:00.000Z'
            }
          ],
          timestamp: '2024-11-14T14:30:00.000Z'
        },
        {
          id: 'seed_e2', caseId, parentId: null,
          author: 'Lê Quang Hải (ACCA)', role: 'author', badge: 'Senior Auditor',
          text: 'Mark-to-market accounting đối với hợp đồng phái sinh năng lượng dài hạn là "vũ khí" tàn khốc nhất. Enron ghi nhận lợi nhuận 20 năm vào ngay năm ký hợp đồng. Với ISA 540, KTV phải đánh giá liệu các giả định của ban quản lý có hợp lý không — nhưng với thị trường năng lượng dài hạn, gần như không có cơ sở để phản biện.',
          upvotes: 17, downvotes: 2, replies: [],
          timestamp: '2024-11-15T10:00:00.000Z'
        },
        {
          id: 'seed_e3', caseId, parentId: null,
          author: 'Phạm Như Quỳnh', role: 'member', badge: 'Junior KTV',
          text: 'Em đang học môn Kiểm toán BCTC năm 3. Câu hỏi của em là: Tại sao Arthur Andersen lại biết mà vẫn ký? Áp lực phí kiểm toán $52M/năm có đủ để che mắt cả một hãng Big 5 không?',
          upvotes: 12, downvotes: 0, replies: [],
          timestamp: '2024-11-16T08:15:00.000Z'
        }
      ]
    };

    // Return seeded or empty
    const seeded = seeds[caseId] || [];
    if (seeded.length > 0) this.save(caseId, seeded);
    return seeded;
  },

  /* ── Render ─────────────────────────────────────────────── */
  renderComment(comment, caseId, depth = 0) {
    const maxDepth = 2;
    const voteState = this.getVoteState(caseId, comment.id);
    const timeAgo = this.formatTime(comment.timestamp);
    const roleColors = {
      admin: 'badge-vip',
      author: 'badge-gold',
      member: 'badge-blue',
      guest: ''
    };
    const roleClass = roleColors[comment.role] || '';

    return `
      <div class="comment" id="comment-${comment.id}">
        <div class="avatar">${comment.author.split(' ').slice(-2).map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div>
        <div class="comment-content">
          <div class="comment-author">
            <span class="comment-author-name">${comment.author}</span>
            ${comment.badge ? `<span class="comment-author-badge ${roleClass}">${comment.badge}</span>` : ''}
            ${comment.isNew ? `<span class="badge badge-green" style="font-size:0.65rem">Mới</span>` : ''}
            <span class="comment-time">${timeAgo}</span>
          </div>
          <p class="comment-text">${this.escapeHtml(comment.text)}</p>
          <div class="comment-actions">
            <div class="vote-group">
              <button class="vote-btn ${voteState === 'up' ? 'active' : ''}"
                onclick="FORUM.handleVote('${caseId}', '${comment.id}', 'up', this)">
                ▲ <span class="vote-count">${comment.upvotes || 0}</span>
              </button>
              <button class="vote-btn downvote ${voteState === 'down' ? 'active' : ''}"
                onclick="FORUM.handleVote('${caseId}', '${comment.id}', 'down', this)">
                ▼ <span class="vote-count">${comment.downvotes || 0}</span>
              </button>
            </div>
            ${depth < maxDepth ? `
              <span class="comment-reply-btn"
                onclick="FORUM.showReplyForm('${caseId}', '${comment.id}')">
                💬 Trả lời
              </span>
            ` : ''}
          </div>
          <!-- Reply form (hidden by default) -->
          <div id="reply-form-${comment.id}" style="display:none; margin-top:12px;">
            <textarea class="comment-textarea" style="min-height:70px; font-size:0.85rem;"
              placeholder="Viết câu trả lời của bạn..." id="reply-text-${comment.id}"></textarea>
            <div style="display:flex; gap:8px; margin-top:8px; justify-content:flex-end;">
              <button class="btn btn-ghost btn-sm" onclick="FORUM.hideReplyForm('${comment.id}')">Hủy</button>
              <button class="btn btn-primary btn-sm" onclick="FORUM.submitReply('${caseId}', '${comment.id}')">Gửi</button>
            </div>
          </div>
        </div>
      </div>
      ${comment.replies && comment.replies.length > 0 ? `
        <div class="comment-replies">
          ${comment.replies.map(r => this.renderComment(r, caseId, depth + 1)).join('')}
        </div>
      ` : ''}
    `;
  },

  renderAll(caseId, containerId = 'comments-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const comments = this.getAll(caseId);
    if (comments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💬</div>
          <h3>Chưa có bình luận nào</h3>
          <p>Hãy là người đầu tiên phân tích vụ án này!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = comments.map(c => this.renderComment(c, caseId)).join('');

    // Update comment count
    const countEl = document.getElementById('comment-count');
    if (countEl) countEl.textContent = this.countAll(comments);
  },

  countAll(comments) {
    return comments.reduce((sum, c) => sum + 1 + (c.replies ? this.countAll(c.replies) : 0), 0);
  },

  /* ── Event Handlers ─────────────────────────────────────── */
  handleVote(caseId, commentId, type, btn) {
    const success = this.vote(caseId, commentId, type);
    if (success) {
      const comments = this.getAll(caseId);
      const comment = this.findComment(comments, commentId);
      if (comment) {
        // Update count in DOM
        const commentEl = document.getElementById(`comment-${commentId}`);
        if (commentEl) {
          const upBtn = commentEl.querySelector('.vote-btn:not(.downvote)');
          const downBtn = commentEl.querySelector('.vote-btn.downvote');
          if (upBtn) {
            upBtn.querySelector('.vote-count').textContent = comment.upvotes;
            upBtn.classList.toggle('active', type === 'up');
          }
          if (downBtn) {
            downBtn.querySelector('.vote-count').textContent = comment.downvotes;
            downBtn.classList.toggle('active', type === 'down');
          }
        }
        showToast(type === 'up' ? '👍 Đã upvote!' : '👎 Đã downvote', 'success', 2000);
      }
    }
  },

  showReplyForm(caseId, commentId) {
    if (!AUTH.isMember()) {
      showToast('Vui lòng đăng nhập để trả lời!', 'info');
      return;
    }
    // Hide all other reply forms
    document.querySelectorAll('[id^="reply-form-"]').forEach(f => f.style.display = 'none');
    const form = document.getElementById(`reply-form-${commentId}`);
    if (form) {
      form.style.display = 'block';
      form.querySelector('textarea').focus();
    }
  },

  hideReplyForm(commentId) {
    const form = document.getElementById(`reply-form-${commentId}`);
    if (form) form.style.display = 'none';
  },

  submitReply(caseId, parentId) {
    const textarea = document.getElementById(`reply-text-${parentId}`);
    if (!textarea || !textarea.value.trim()) {
      showToast('Nội dung không được trống!', 'error');
      return;
    }
    const comment = this.addComment(caseId, textarea.value, parentId);
    if (comment) {
      this.renderAll(caseId);
      showToast('✅ Đã đăng câu trả lời!', 'success');
      // Scroll to new comment
      setTimeout(() => {
        document.getElementById(`comment-${comment.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  },

  submitMain(caseId) {
    const textarea = document.getElementById('main-comment-text');
    if (!textarea || !textarea.value.trim()) {
      showToast('Nội dung bình luận không được trống!', 'error');
      return;
    }
    const comment = this.addComment(caseId, textarea.value);
    if (comment) {
      textarea.value = '';
      this.renderAll(caseId);
      showToast('✅ Bình luận đã được đăng!', 'success');
      setTimeout(() => {
        document.getElementById(`comment-${comment.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  },

  /* ── Helpers ────────────────────────────────────────────── */
  formatTime(iso) {
    if (!iso) return 'Vừa xong';
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 30) return `${days} ngày trước`;
    return new Date(iso).toLocaleDateString('vi-VN');
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }
};
