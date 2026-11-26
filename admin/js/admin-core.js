
    /* ═══════════════════════════════════════════════════════════
       CMS ADMIN APP CONTROLLER
       ═══════════════════════════════════════════════════════════ */
    let currentActiveView = 'dashboard';

    function showToast(message, type = 'success') {
      const wrap = document.getElementById('toast-wrap');
      const toast = document.createElement('div');
      toast.className = `toast-pill ${type}`;
      toast.textContent = message;
      wrap.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    function switchView(viewName) {
      if (viewName === 'contact') {
        switchContactSubTab(currentContactTab || 'scope');
        renderContactAdminView();
      }

      currentActiveView = viewName;
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

      const targetPanel = document.getElementById(`view-${viewName}`);
      const targetNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

      if (targetPanel) targetPanel.classList.add('active');
      if (targetNav) targetNav.classList.add('active');

      const titleMap = {
        dashboard: 'Dashboard',
        inquiries: 'Inquiries & Client Briefs',
        contact: 'Contact Page & Brief Engine',
        seo: 'SEO & Metadata',
        blogs: 'Perspectives / Blogs',
        portfolio: 'Work & Portfolio',
        about: 'About Page',
        profile: 'Studio & Team Minds',
        services: 'Core Services',
        clients: 'Client Logos',
      };
      document.getElementById('topbarCurrentViewName').textContent = titleMap[viewName] || 'Dashboard';

      document.getElementById('sidebar').classList.remove('open');
      if (viewName === 'inquiries') {
        loadContactInquiries();
        loadStudioContactSettings();
      }
      if (viewName === 'services') {
        renderHomeServicesGrid();
      }
      if (viewName === 'about' && typeof renderAboutWorksView === 'function') {
        // Show the saved picks each time the section is opened (unless there are unsaved changes)
        renderAboutWorksView(typeof aboutWorksDirty === 'undefined' || !aboutWorksDirty);
      }
      if (viewName === 'seo') {
        if (typeof window.loadSEOForm === 'function') {
          window.loadSEOForm();
        }
      }
      refreshAllViews();
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
    }

    // ── 0. BLOG ARTICLE EDITOR (visual editor: toolbar, smart paste, images, live contents list) ──
    function beEditor() { return document.getElementById('blogVisualEditor'); }

    function beEscape(str) {
      return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function beSlugify(text) {
      return String(text || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
    }

    // Make sure toolbar actions apply inside the editor (put the caret at the end if focus is elsewhere)
    let beSavedRange = null;
    function beEnsureSelection() {
      const editor = beEditor();
      if (!editor) return null;
      const sel = window.getSelection();
      if (sel && sel.rangeCount && editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        editor.focus();
        return sel;
      }
      editor.focus();
      const range = document.createRange();
      if (beSavedRange && editor.contains(beSavedRange.commonAncestorContainer)) {
        range.setStart(beSavedRange.startContainer, beSavedRange.startOffset);
        range.setEnd(beSavedRange.endContainer, beSavedRange.endOffset);
      } else {
        range.selectNodeContents(editor);
        range.collapse(false);
      }
      sel.removeAllRanges();
      sel.addRange(range);
      return sel;
    }

    function beInsertHtml(html) {
      beEnsureSelection();
      document.execCommand('insertHTML', false, html);
    }

    function afterEditorChange() {
      syncVisualEditorToInput();
      updateEditorWordCount();
      beRefreshToolbarState();
    }

    // Highlight the toolbar buttons that apply where the cursor is (Text / Heading / Subheading, bold, italic, lists)
    function beRefreshToolbarState() {
      const editor = beEditor();
      const toolbar = document.getElementById('blogEditorToolbar');
      if (!editor || !toolbar) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.getRangeAt(0).commonAncestorContainer)) return;
      const block = String(document.queryCommandValue('formatBlock') || '').toLowerCase();
      toolbar.querySelectorAll('[data-block]').forEach(b => b.classList.toggle('is-active', b.dataset.block === (block || 'p')));
      const inHeading = /^h[1-6]$/.test(block);
      toolbar.querySelectorAll('[data-state]').forEach(b => {
        let on = false;
        // Headings are bold by design, so "Bold" is not shown as switched on there
        if (!(inHeading && b.dataset.state === 'bold')) {
          try { on = document.queryCommandState(b.dataset.state); } catch (e) {}
        }
        b.classList.toggle('is-on', !!on);
      });
    }

    function execEditorCommand(command, value = null) {
      if (!beEditor()) return;
      beEnsureSelection();
      document.execCommand(command, false, value);
      afterEditorChange();
    }

    function formatEditorHeading(level) {
      if (!beEditor()) return;
      beEnsureSelection();
      const target = level === 'p' ? 'p' : `h${level}`;
      const current = String(document.queryCommandValue('formatBlock') || '').toLowerCase();
      // Clicking "Heading" on a heading turns it back into normal text
      document.execCommand('formatBlock', false, current === target && target !== 'p' ? 'p' : target);
      afterEditorChange();
    }

    function beSelectedText() {
      const sel = window.getSelection();
      return sel ? sel.toString().trim() : '';
    }

    function insertEditorPullquote() {
      if (!beEditor()) return;
      beEnsureSelection();
      const text = beSelectedText().replace(/^["“]|["”]$/g, '') || 'Write the quote here';
      beInsertHtml(`<div class="reader-pullquote"><p>“${beEscape(text)}”</p></div><p><br></p>`);
      afterEditorChange();
    }

    function insertEditorTakeaway() {
      if (!beEditor()) return;
      beEnsureSelection();
      const text = beSelectedText() || 'Write the key point here';
      beInsertHtml(`<div class="reader-takeaway-box"><div class="rtb-title">Key point</div><p>${beEscape(text)}</p></div><p><br></p>`);
      afterEditorChange();
    }

    function insertEditorDivider() {
      if (!beEditor()) return;
      beInsertHtml('<hr class="editorial-divider"><p><br></p>');
      afterEditorChange();
    }

    function insertEditorLink() {
      if (!beEditor()) return;
      beEnsureSelection();
      const sel = window.getSelection();
      const range = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
      const selected = beSelectedText();
      let url = prompt('Paste the link (for example https://example.com or a page like contact):', 'https://');
      if (!url || !url.trim() || url.trim() === 'https://') return;
      url = url.trim();
      if (!/^(https?:|mailto:|tel:|\/|#)/i.test(url) && /\.[a-z]{2,}/i.test(url)) url = 'https://' + url;
      const editor = beEditor();
      editor.focus();
      if (range) { sel.removeAllRanges(); sel.addRange(range); }
      if (selected) {
        document.execCommand('createLink', false, url);
      } else {
        document.execCommand('insertHTML', false, `<a href="${beEscape(url)}">${beEscape(url)}</a>&nbsp;`);
      }
      // Links to other websites open in a new tab
      editor.querySelectorAll('a[href]').forEach(a => {
        if (/^https?:/i.test(a.getAttribute('href'))) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
      });
      afterEditorChange();
    }

    // ── Images inside the article ──
    async function beUploadImage(fileOrBlob, fileName) {
      const fd = new FormData();
      fd.append('file', fileOrBlob, fileName || fileOrBlob.name || 'image.png');
      const res = await fetch('api.php?action=upload_asset', { method: 'POST', body: fd });
      const data = await res.json();
      if (data && data.status === 'success' && data.filePath) return data.filePath;
      throw new Error((data && data.message) || 'Upload failed');
    }

    function beInsertUploadingImage(file) {
      const tempId = 'be-img-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const previewUrl = URL.createObjectURL(file);
      beInsertHtml(`<figure class="is-uploading" id="${tempId}"><img src="${previewUrl}" alt=""></figure><p><br></p>`);
      afterEditorChange();
      beUploadImage(file).then(path => {
        const fig = document.getElementById(tempId);
        if (fig) {
          fig.querySelector('img').setAttribute('src', path);
          fig.classList.remove('is-uploading');
          fig.removeAttribute('id');
        }
        URL.revokeObjectURL(previewUrl);
        afterEditorChange();
      }).catch(err => {
        const fig = document.getElementById(tempId);
        if (fig) fig.remove();
        showToast('Image upload failed: ' + err.message, 'error');
        afterEditorChange();
      });
    }

    function insertEditorImage() {
      const input = document.getElementById('blogEditorImageFile');
      if (!input) return;
      const sel = window.getSelection();
      const editor = beEditor();
      beSavedRange = (sel && sel.rangeCount && editor && editor.contains(sel.getRangeAt(0).commonAncestorContainer)) ? sel.getRangeAt(0).cloneRange() : null;
      input.value = '';
      input.onchange = () => {
        Array.from(input.files || []).filter(f => f.type.startsWith('image/')).forEach(beInsertUploadingImage);
      };
      input.click();
    }

    // Pasted images that live on other websites (e.g. Google Docs) or inside the clipboard are copied to our own server
    async function beRehostImages() {
      const editor = beEditor();
      if (!editor) return;
      const imgs = Array.from(editor.querySelectorAll('img')).filter(img => {
        const src = img.getAttribute('src') || '';
        return src.startsWith('data:image/') || (/^https?:/i.test(src) && !src.startsWith(window.location.origin));
      });
      for (const img of imgs) {
        const src = img.getAttribute('src');
        try {
          const blob = await (await fetch(src, { mode: 'cors' })).blob();
          if (!blob.type.startsWith('image/')) continue;
          const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg').replace('svg+xml', 'svg');
          const path = await beUploadImage(blob, `article-image.${ext}`);
          img.setAttribute('src', path);
        } catch (e) {
          // The other website does not allow copying; the image keeps pointing to it
        }
      }
      afterEditorChange();
    }

    // ── Cleaning pasted content (Word / Google Docs / web pages) ──
    const BE_BOLD_RE = /font-weight\s*:\s*(bold|[6-9]00)/i;
    const BE_ITALIC_RE = /font-style\s*:\s*italic/i;

    function cleanEditorHtml(rawHtml) {
      const doc = new DOMParser().parseFromString(`<div id="be-root">${rawHtml}</div>`, 'text/html');
      const root = doc.getElementById('be-root');
      if (!root) return '';
      root.querySelectorAll('script, style, meta, link, title, xml, head, noscript, iframe, object, embed').forEach(n => n.remove());
      const out = doc.createElement('div');
      let droppedImages = 0;

      const BLOCK_TAGS = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'FIGURE', 'HR', 'TABLE', 'TR', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN', 'ASIDE', 'PRE']);

      function safeHref(href) {
        href = (href || '').trim();
        if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return href;
        if (/^[a-z0-9][a-z0-9/_-]*(\.html)?([?#].*)?$/i.test(href)) return href;
        return '';
      }

      function walk(src, dest) {
        Array.from(src.childNodes).forEach(n => {
          if (n.nodeType === 3) {
            const t = n.nodeValue.replace(/ /g, ' ');
            if (t) dest.appendChild(doc.createTextNode(t));
            return;
          }
          if (n.nodeType !== 1) return;
          const tag = n.tagName;
          const style = n.getAttribute('style') || '';
          const cls = (n.getAttribute('class') || '');

          // Keep the editor's own special blocks as they are
          if (/\b(reader-pullquote|reader-takeaway-box)\b/.test(cls)) {
            const keep = doc.createElement('div');
            keep.className = /reader-pullquote/.test(cls) ? 'reader-pullquote' : 'reader-takeaway-box';
            keep.innerHTML = n.innerHTML;
            dest.appendChild(keep);
            return;
          }

          let el = null;
          switch (tag) {
            case 'H1': case 'H2': el = doc.createElement('h2'); break;
            case 'H3': case 'H4': case 'H5': case 'H6': el = doc.createElement('h3'); break;
            case 'P': case 'PRE': el = doc.createElement('p'); break;
            case 'UL': el = doc.createElement('ul'); break;
            case 'OL': el = doc.createElement('ol'); break;
            case 'LI': el = doc.createElement('li'); break;
            case 'BLOCKQUOTE': {
              const q = doc.createElement('div');
              q.className = 'reader-pullquote';
              const p = doc.createElement('p');
              walk(n, p);
              if (p.textContent.trim()) { q.appendChild(p); dest.appendChild(q); }
              return;
            }
            case 'HR': { const hr = doc.createElement('hr'); hr.className = 'editorial-divider'; dest.appendChild(hr); return; }
            case 'BR': dest.appendChild(doc.createElement('br')); return;
            case 'IMG': {
              const src = n.getAttribute('src') || '';
              if (/^(https?:|data:image\/|assets\/|\/)/i.test(src)) {
                const fig = doc.createElement('figure');
                const img = doc.createElement('img');
                img.setAttribute('src', src);
                img.setAttribute('alt', n.getAttribute('alt') || '');
                fig.appendChild(img);
                dest.appendChild(fig);
              } else {
                droppedImages++;
              }
              return;
            }
            case 'A': {
              const href = safeHref(n.getAttribute('href'));
              if (!href) { walk(n, dest); return; }
              el = doc.createElement('a');
              el.setAttribute('href', href);
              if (/^https?:/i.test(href)) { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
              break;
            }
            case 'STRONG': el = doc.createElement('strong'); break;
            case 'B':
              // Google Docs wraps everything in <b style="font-weight:normal">
              if (/font-weight\s*:\s*(normal|[1-4]00)/i.test(style)) { walk(n, dest); return; }
              el = doc.createElement('strong'); break;
            case 'EM': case 'I': el = doc.createElement('em'); break;
            case 'U': el = doc.createElement('u'); break;
            case 'SPAN': case 'FONT': {
              let target = dest;
              if (BE_BOLD_RE.test(style)) { const s = doc.createElement('strong'); target.appendChild(s); target = s; }
              if (BE_ITALIC_RE.test(style)) { const e = doc.createElement('em'); target.appendChild(e); target = e; }
              walk(n, target);
              return;
            }
            case 'TD': case 'TH': el = doc.createElement('p'); break;
            default:
              walk(n, dest); // div, section, table wrappers, etc. are flattened
              return;
          }
          walk(n, el);
          dest.appendChild(el);
        });
      }
      walk(root, out);

      // Wrap loose text at the top level into paragraphs
      const final = doc.createElement('div');
      let para = null;
      Array.from(out.childNodes).forEach(n => {
        const isBlock = n.nodeType === 1 && (BLOCK_TAGS.has(n.tagName) || n.tagName === 'FIGURE' || n.tagName === 'HR');
        if (isBlock) { para = null; final.appendChild(n); return; }
        if (n.nodeType === 1 && n.tagName === 'BR' && para) { para.appendChild(n); return; }
        if (!para) { para = doc.createElement('p'); final.appendChild(para); }
        para.appendChild(n);
      });

      // Tidy: nested blocks inside paragraphs, empty paragraphs, bullet-text paragraphs, bold "title" lines
      final.querySelectorAll('p').forEach(p => {
        if (p.querySelector('h2, h3, ul, ol, figure, div, p')) {
          const frag = doc.createDocumentFragment();
          Array.from(p.childNodes).forEach(c => frag.appendChild(c));
          p.replaceWith(frag);
        }
      });
      Array.from(final.querySelectorAll('p, h2, h3, li')).forEach(el => {
        // trim leading/trailing <br>
        while (el.firstChild && el.firstChild.nodeType === 1 && el.firstChild.tagName === 'BR') el.firstChild.remove();
        while (el.lastChild && el.lastChild.nodeType === 1 && el.lastChild.tagName === 'BR') el.lastChild.remove();
        if (!el.textContent.trim() && !el.querySelector('img')) el.remove();
      });

      // Word-style bullet paragraphs ("• item") → real lists
      const BULLET_RE = /^\s*([•·▪◦\-–*]|o(?=\s)|§)\s+/;
      let list = null;
      Array.from(final.children).forEach(el => {
        if (el.tagName === 'P' && BULLET_RE.test(el.textContent)) {
          if (!list) { list = doc.createElement('ul'); el.before(list); }
          const li = doc.createElement('li');
          li.innerHTML = el.innerHTML.replace(/^(\s|&nbsp;)*([•·▪◦\-–*]|o|§)(\s|&nbsp;)+/, '');
          list.appendChild(li);
          el.remove();
        } else {
          list = null;
        }
      });

      // Headings written as bold lines or "## Title" / "01. Title" → real headings
      const kids = Array.from(final.children);
      kids.forEach((el, i) => {
        if (el.tagName !== 'P') return;
        const text = el.textContent.trim();
        if (!text) return;
        const md = text.match(/^(#{1,3})\s+(.+)$/);
        if (md) {
          const h = doc.createElement(md[1].length === 3 ? 'h3' : 'h2');
          h.textContent = md[2].trim();
          el.replaceWith(h);
          return;
        }
        const boldText = Array.from(el.querySelectorAll('strong, b')).map(s => s.textContent).join('').trim();
        const allBold = boldText && boldText.replace(/\s+/g, ' ') === text.replace(/\s+/g, ' ');
        const shortLine = text.length <= 90 && text.split(/\s+/).length <= 14 && !/[.!?,;]$/.test(text);
        const numberedTitle = /^\d{1,2}[.)]\s+\S/.test(text) && shortLine;
        const hasNext = i < kids.length - 1;
        if ((allBold && shortLine && hasNext) || (numberedTitle && hasNext && kids[i + 1] && kids[i + 1].tagName === 'P' && kids[i + 1].textContent.trim().length > text.length)) {
          const h = doc.createElement('h2');
          h.textContent = text.replace(/:$/, '');
          el.replaceWith(h);
        }
      });

      if (droppedImages) {
        setTimeout(() => showToast(`${droppedImages} image(s) could not be copied from the document. Add them with the Image button.`, 'info'), 50);
      }
      return final.innerHTML;
    }

    // Plain text → paragraphs, headings and lists
    function textToEditorHtml(text) {
      const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
      const blocks = [];
      lines.forEach(raw => {
        const line = raw.trim();
        if (!line) { blocks.push({ type: 'gap' }); return; }
        if (/^[-*•·▪]\s+/.test(line)) { blocks.push({ type: 'ul', text: line.replace(/^[-*•·▪]\s+/, '') }); return; }
        if (/^\d{1,3}[.)]\s+/.test(line)) { blocks.push({ type: 'num', text: line.replace(/^\d{1,3}[.)]\s+/, ''), raw: line }); return; }
        const md = line.match(/^(#{1,3})\s+(.+)$/);
        if (md) { blocks.push({ type: md[1].length === 3 ? 'h3' : 'h2', text: md[2] }); return; }
        blocks.push({ type: 'p', text: line });
      });

      const inline = (t) => beEscape(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|\s)_(.+?)_(?=\s|$)/g, '$1<em>$2</em>');
      const real = blocks.filter(b => b.type !== 'gap');
      let html = '';
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.type === 'gap') continue;
        if (b.type === 'ul' || b.type === 'num') {
          // consecutive list lines become one list; a single short numbered line is a heading
          const kind = b.type;
          const run = [];
          while (i < blocks.length && blocks[i].type === kind) { run.push(blocks[i]); i++; }
          i--;
          if (kind === 'num' && run.length === 1) {
            const t = run[0].raw;
            const isTitle = t.length <= 90 && !/[.!?,;]$/.test(t);
            html += isTitle ? `<h2>${inline(t)}</h2>` : `<p>${inline(t)}</p>`;
            continue;
          }
          const tag = kind === 'ul' ? 'ul' : 'ol';
          html += `<${tag}>${run.map(r => `<li>${inline(r.text)}</li>`).join('')}</${tag}>`;
          continue;
        }
        if (b.type === 'h2' || b.type === 'h3') { html += `<${b.type}>${inline(b.text)}</${b.type}>`; continue; }
        // A short line without ending punctuation, followed by a longer paragraph, reads as a heading
        const idx = real.indexOf(b);
        const next = real[idx + 1];
        const looksLikeTitle = b.text.length <= 80 && b.text.split(/\s+/).length <= 12 && !/[.!?,;:]$/.test(b.text) && next && next.type === 'p' && next.text.length > b.text.length + 20;
        if (/^["“].+["”]$/.test(b.text) && b.text.length > 20) { html += `<div class="reader-pullquote"><p>${inline(b.text)}</p></div>`; continue; }
        html += looksLikeTitle ? `<h2>${inline(b.text)}</h2>` : `<p>${inline(b.text)}</p>`;
      }
      return html;
    }

    function handleEditorPaste(e) {
      const cd = e.clipboardData;
      if (!cd) return;
      const html = cd.getData('text/html');
      const text = cd.getData('text/plain');
      const files = Array.from(cd.files || []).filter(f => f.type.startsWith('image/'));

      // A copied image (e.g. a screenshot)
      if (files.length && !(html && html.trim()) && !(text && text.trim())) {
        e.preventDefault();
        files.forEach(beInsertUploadingImage);
        return;
      }

      e.preventDefault();
      if (html && html.trim()) {
        let clean = cleanEditorHtml(html);
        // A small inline snippet (one paragraph) is inserted as text into the current paragraph
        const single = clean.match(/^<p>([\s\S]*)<\/p>$/);
        if (single && !/<\/?(p|h2|h3|ul|ol|figure|div)\b/i.test(single[1])) clean = single[1];
        beInsertHtml(clean || beEscape(text));
      } else if (text) {
        if (!/\n/.test(text.trim())) {
          document.execCommand('insertText', false, text);
        } else {
          beInsertHtml(textToEditorHtml(text));
        }
      }
      afterEditorChange();
      beRehostImages();
    }

    // "Tidy up" button: cleans the whole article and turns title-like lines into headings
    function autoFormatEditorContent() {
      const editor = beEditor();
      if (!editor) return;
      if (!editor.textContent.trim()) {
        showToast('The article is empty. Write or paste your text first.', 'info');
        return;
      }
      const before = editor.querySelectorAll('h2').length;
      const blocks = editor.querySelectorAll('p, h2, h3, ul, ol, div, figure').length;
      const brCount = editor.querySelectorAll('br').length;
      // Text that arrived as one big block with line breaks is rebuilt from its lines
      if (blocks <= 2 && brCount >= 3) {
        editor.innerHTML = textToEditorHtml(editor.innerText);
      } else {
        editor.innerHTML = cleanEditorHtml(editor.innerHTML);
      }
      afterEditorChange();
      const after = editor.querySelectorAll('h2').length;
      showToast(after > before
        ? `Tidied up. Found ${after - before} new heading(s).`
        : 'Tidied up. Tip: put the cursor on a title line and click "Heading" to make it a heading.');
    }

    function toggleCodeView() {
      const visualEditor = beEditor();
      const codeEditor = document.getElementById('blogContentInput');
      const btn = document.getElementById('btnToggleEditorCode');
      if (!visualEditor || !codeEditor) return;
      const toolbar = document.getElementById('blogEditorToolbar');

      if (visualEditor.style.display === 'none') {
        visualEditor.innerHTML = codeEditor.value || '<p><br></p>';
        visualEditor.style.display = 'block';
        codeEditor.style.display = 'none';
        if (toolbar) toolbar.style.display = '';
        if (btn) { btn.classList.remove('active'); btn.textContent = 'Edit as HTML'; }
      } else {
        codeEditor.value = getCleanHtmlFromVisualEditor();
        visualEditor.style.display = 'none';
        codeEditor.style.display = 'block';
        if (toolbar) toolbar.style.display = 'none';
        if (btn) { btn.classList.add('active'); btn.textContent = 'Back to the visual editor'; }
      }
      updateEditorWordCount();
    }

    function getCleanHtmlFromVisualEditor() {
      const editor = beEditor();
      if (!editor) return '';
      const html = (editor.innerHTML || '').trim();
      if (!html || html === '<p><br></p>' || html === '<p></p>' || html === '<br>') return '';
      return html;
    }

    function syncVisualEditorToInput() {
      const visualEditor = beEditor();
      const codeEditor = document.getElementById('blogContentInput');
      if (!visualEditor || !codeEditor) return;
      if (visualEditor.style.display !== 'none') {
        codeEditor.value = getCleanHtmlFromVisualEditor();
      }
    }

    // Adds a stable id to every main heading and returns the contents list built from them
    function beHeadingsAndIds(html) {
      const doc = new DOMParser().parseFromString(`<div id="be-root">${html || ''}</div>`, 'text/html');
      const root = doc.getElementById('be-root');
      const used = new Set();
      const sections = [];
      root.querySelectorAll('h2').forEach((h, i) => {
        const title = h.textContent.trim();
        if (!title) return;
        let id = h.getAttribute('id') || `sec-${beSlugify(title) || (i + 1)}`;
        while (used.has(id)) id = `${id}-${i + 1}`;
        used.add(id);
        h.setAttribute('id', id);
        sections.push({ id, title });
      });
      return { html: root.innerHTML, sections };
    }

    function beArticleText() {
      const visualEditor = beEditor();
      const codeEditor = document.getElementById('blogContentInput');
      if (visualEditor && visualEditor.style.display !== 'none') return visualEditor.innerText || '';
      const tmp = document.createElement('div');
      tmp.innerHTML = codeEditor ? codeEditor.value : '';
      return tmp.textContent || '';
    }

    function beAutoReadTime() {
      const words = beArticleText().trim() ? beArticleText().trim().split(/\s+/).length : 0;
      return { words, minutes: Math.max(1, Math.round(words / 200)) };
    }

    // Word count, read time and the live contents list
    function updateEditorWordCount() {
      const { words, minutes } = beAutoReadTime();
      const badge = document.getElementById('editorWordCountBadge');
      if (badge) badge.textContent = `${words} word${words === 1 ? '' : 's'}`;
      const rt = document.getElementById('editorReadTimeBadge');
      if (rt) rt.textContent = `${minutes} min read`;
      const rtInput = document.getElementById('blogReadTimeInput');
      if (rtInput) rtInput.placeholder = `Auto: ${minutes} min`;

      const toc = document.getElementById('blogTOCPreview');
      if (toc) {
        const source = beEditor() && beEditor().style.display !== 'none' ? beEditor().innerHTML : (document.getElementById('blogContentInput')?.value || '');
        const { sections } = beHeadingsAndIds(source);
        toc.innerHTML = sections.length
          // Headings that already start with a number ("01. ...") don't get a second one
          ? sections.map(s => `<li${/^\s*\d+[.):-]/.test(s.title) ? ' class="be-toc-numbered"' : ''}>${beEscape(s.title)}</li>`).join('')
          : '<li class="be-toc-empty">No headings yet. Put the cursor on a title line and click <strong>Heading</strong>, or click <strong>Tidy up</strong> after pasting.</li>';
      }
    }

    // Highlight Text / Heading / Subheading for the current line
    document.addEventListener('selectionchange', () => {
      const editor = beEditor();
      const toolbar = document.getElementById('blogEditorToolbar');
      if (!editor || !toolbar) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.getRangeAt(0).commonAncestorContainer)) return;
      beSavedRange = sel.getRangeAt(0).cloneRange();
      beRefreshToolbarState();
    });

    // Keep the text selection when a toolbar button is pressed; enable smart paste
    document.addEventListener('DOMContentLoaded', () => {
      const toolbar = document.getElementById('blogEditorToolbar');
      if (toolbar) toolbar.addEventListener('mousedown', (e) => { if (e.target.closest('.be-tool')) e.preventDefault(); });
      const editor = beEditor();
      if (editor) {
        editor.addEventListener('paste', handleEditorPaste);
        editor.addEventListener('drop', (e) => {
          const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []).filter(f => f.type.startsWith('image/'));
          if (!files.length) return;
          e.preventDefault();
          files.forEach(beInsertUploadingImage);
        });
      }
      const codeEditor = document.getElementById('blogContentInput');
      if (codeEditor) codeEditor.addEventListener('input', updateEditorWordCount);
    });

    // ── 0.1 TEXTAREA & MANUAL INPUT HELPERS ──
    function insertTagIntoTextarea(textareaId, openTag, closeTag) {
      const el = document.getElementById(textareaId);
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;
      const selected = val.substring(start, end);
      const replacement = openTag + selected + (closeTag || '');
      el.value = val.substring(0, start) + replacement + val.substring(end);
      el.focus();
      el.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }

    function toggleManualInput(wrapId) {
      const el = document.getElementById(wrapId);
      if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }

    function syncManualToHidden(manualInputId, hiddenInputId, previewBoxId, previewImgId, pathTxtId, dropzoneId) {
      const val = document.getElementById(manualInputId).value.trim();
      document.getElementById(hiddenInputId).value = val;
      const previewBox = document.getElementById(previewBoxId);
      const previewImg = document.getElementById(previewImgId);
      const pathTxt = document.getElementById(pathTxtId);
      const dropzone = document.getElementById(dropzoneId);

      if (val) {
        previewBox.style.display = 'flex';
        dropzone.style.display = 'none';
        previewImg.src = val;
        pathTxt.textContent = val;
      } else {
        previewBox.style.display = 'none';
        dropzone.style.display = 'flex';
        previewImg.src = '';
        pathTxt.textContent = '';
      }
    }

    // ── STRUCTURED ASSET UPLOADER CONTROLLER (CORE PHP -> ASSETS/UPLOADS/) ──
    function setupMediaUploader({
      hiddenInputId,
      fileInputId,
      previewBoxId,
      previewImgId,
      pathTxtId,
      dropzoneId,
      changeBtnId,
      deleteBtnId,
      manualInputId
    }) {
      const hiddenInput = document.getElementById(hiddenInputId);
      const fileInput = document.getElementById(fileInputId);
      const previewBox = document.getElementById(previewBoxId);
      const previewImg = document.getElementById(previewImgId);
      const pathTxt = document.getElementById(pathTxtId);
      const dropzone = document.getElementById(dropzoneId);
      const changeBtn = document.getElementById(changeBtnId);
      const deleteBtn = document.getElementById(deleteBtnId);
      const manualInput = manualInputId ? document.getElementById(manualInputId) : null;

      const isVideoAsset = (url) => {
        if (!url || typeof url !== 'string') return false;
        const clean = url.split('?')[0].split('#')[0].toLowerCase();
        return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.endsWith('.m4v') || clean.endsWith('.ogg') || url.startsWith('data:video/');
      };

      // Create or locate companion video element for real-time video thumbnail preview
      let previewVideo = null;
      if (previewImg && previewImg.parentElement) {
        previewVideo = previewImg.parentElement.querySelector('video.media-preview-video');
        if (!previewVideo) {
          previewVideo = document.createElement('video');
          previewVideo.className = 'media-small-thumbnail media-preview-video';
          previewVideo.muted = true;
          previewVideo.playsInline = true;
          previewVideo.preload = 'auto';
          previewVideo.autoplay = false;
          previewVideo.style.display = 'none';
          previewVideo.style.objectFit = 'cover';
          previewVideo.style.background = '#000';
          previewVideo.style.cursor = 'pointer';
          previewVideo.title = 'Hover to preview video snippet';

          previewVideo.addEventListener('mouseenter', () => {
            previewVideo.play().catch(() => {});
          });
          previewVideo.addEventListener('mouseleave', () => {
            previewVideo.pause();
            try { previewVideo.currentTime = 0.1; } catch (e) {}
          });

          previewImg.parentElement.insertBefore(previewVideo, previewImg);
        }
      }

      function refreshUI() {
        const val = hiddenInput ? hiddenInput.value.trim() : '';
        if (val) {
          if (previewBox) previewBox.style.display = 'flex';
          if (dropzone) dropzone.style.display = 'none';
          if (pathTxt) pathTxt.textContent = val;
          if (manualInput) manualInput.value = val;

          if (isVideoAsset(val)) {
            // Video asset: Show real video frame thumbnail derived from the video itself
            if (previewVideo) {
              previewVideo.style.display = 'block';
              const vidSrc = val.includes('#') ? val : (val + '#t=0.1');
              if (!previewVideo.src.endsWith(val) && previewVideo.src !== vidSrc) {
                previewVideo.src = vidSrc;
                previewVideo.load();
                previewVideo.onerror = () => {
                  previewVideo.style.display = 'none';
                  if (previewImg) {
                    previewImg.style.display = 'block';
                    previewImg.src = 'assets/img/branding/1928-logo.png';
                  }
                };
                previewVideo.onloadeddata = () => {
                  try { previewVideo.currentTime = 0.1; } catch (e) {}
                  try {
                    const canvas = document.createElement('canvas');
                    canvas.width = previewVideo.videoWidth || 320;
                    canvas.height = previewVideo.videoHeight || 180;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
                    const snap = canvas.toDataURL('image/jpeg', 0.85);
                    if (snap && snap.length > 100 && previewImg) {
                      previewImg.src = snap;
                    }
                  } catch (err) {}
                };
              }
            }
            if (previewImg) {
              previewImg.style.display = 'none';
            }
          } else {
            // Standard image asset
            if (previewVideo) {
              previewVideo.style.display = 'none';
              previewVideo.pause();
              previewVideo.removeAttribute('src');
            }
            if (previewImg) {
              previewImg.style.display = 'block';
              previewImg.src = val;
            }
          }
        } else {
          if (previewBox) previewBox.style.display = 'none';
          if (dropzone) dropzone.style.display = 'flex';
          if (previewVideo) {
            previewVideo.style.display = 'none';
            previewVideo.pause();
            previewVideo.removeAttribute('src');
          }
          if (previewImg) {
            previewImg.style.display = 'block';
            previewImg.src = '';
          }
          if (pathTxt) pathTxt.textContent = '';
          if (manualInput) manualInput.value = '';
        }
      }

      async function uploadFile(file) {
        if (!file) return;
        const previousImage = hiddenInput.value;
        showToast(`Uploading ${file.name} to /assets/uploads/...`, 'info');

        const formData = new FormData();
        formData.append('file', file);
        if (previousImage) {
          formData.append('previousImage', previousImage);
        }

        try {
          const res = await fetch('api.php?action=upload_asset', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data && data.status === 'success' && data.filePath) {
            hiddenInput.value = data.filePath;
            refreshUI();
            if (data.deletedPrevious) {
              showToast('✅ New image stored, previous image removed from storage!');
            } else {
              showToast('✅ Asset stored in /assets/ folder & path saved to database!');
            }
            return;
          } else {
            throw new Error(data.message || 'Server rejected file upload');
          }
        } catch (err) {
          // Fallback to json base64 or FileReader
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const res2 = await fetch('api.php?action=upload_asset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  base64: e.target.result,
                  fileName: file.name,
                  previousImage: previousImage
                })
              });
              const data2 = await res2.json();
              if (data2 && data2.status === 'success' && data2.filePath) {
                hiddenInput.value = data2.filePath;
                refreshUI();
                showToast('✅ Asset saved & previous image removed!');
                return;
              }
            } catch (e2) {}

            hiddenInput.value = e.target.result;
            refreshUI();
            showToast('Loaded in preview mode.');
          };
          reader.readAsDataURL(file);
        }
      }

      if (dropzone) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
          if (e.dataTransfer.files && e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]);
        });
      }

      if (changeBtn) changeBtn.addEventListener('click', () => fileInput.click());
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          const oldPath = hiddenInput.value;
          if (oldPath) {
            await fetch('api.php?action=delete_asset', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filePath: oldPath })
            }).catch(() => {});
          }
          hiddenInput.value = '';
          refreshUI();
          showToast('Image removed and deleted from storage.', 'info');
        });
      }

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) uploadFile(e.target.files[0]);
        });
      }

      return { refreshUI };
    }

    let blogUploader, blogSpecimenUploader, projectUploader, teamUploader, clientUploader, serviceUploader, homeCardUploader;

    function initAllUploaders() {
      blogUploader = setupMediaUploader({
        hiddenInputId: 'blogCoverInput',
        fileInputId: 'blogCoverFileInput',
        previewBoxId: 'blogCoverPreviewBox',
        previewImgId: 'blogCoverPreviewImg',
        pathTxtId: 'blogCoverPathTxt',
        dropzoneId: 'blogCoverDropzone',
        changeBtnId: 'blogChangeCoverBtn',
        deleteBtnId: 'blogDeleteCoverBtn',
        manualInputId: 'blogCoverManualInput'
      });

      blogSpecimenUploader = setupMediaUploader({
        hiddenInputId: 'blogSpecimenInput',
        fileInputId: 'blogSpecimenFileInput',
        previewBoxId: 'blogSpecimenPreviewBox',
        previewImgId: 'blogSpecimenPreviewImg',
        pathTxtId: 'blogSpecimenPathTxt',
        dropzoneId: 'blogSpecimenDropzone',
        changeBtnId: 'blogChangeSpecimenBtn',
        deleteBtnId: 'blogDeleteSpecimenBtn',
        manualInputId: 'blogSpecimenManualInput'
      });

      projectUploader = setupMediaUploader({
        hiddenInputId: 'projectCoverInput',
        fileInputId: 'projectCoverFileInput',
        previewBoxId: 'projectCoverPreviewBox',
        previewImgId: 'projectCoverPreviewImg',
        pathTxtId: 'projectCoverPathTxt',
        dropzoneId: 'projectCoverDropzone',
        changeBtnId: 'projectChangeCoverBtn',
        deleteBtnId: 'projectDeleteCoverBtn',
        manualInputId: 'projectCoverManualInput'
      });

      teamUploader = setupMediaUploader({
        hiddenInputId: 'teamPhotoInput',
        fileInputId: 'teamPhotoFileInput',
        previewBoxId: 'teamPhotoPreviewBox',
        previewImgId: 'teamPhotoPreviewImg',
        pathTxtId: 'teamPhotoPathTxt',
        dropzoneId: 'teamPhotoDropzone',
        changeBtnId: 'teamChangePhotoBtn',
        deleteBtnId: 'teamDeletePhotoBtn',
        manualInputId: 'teamPhotoManualInput'
      });

      clientUploader = setupMediaUploader({
        hiddenInputId: 'clientImgInput',
        fileInputId: 'clientLogoFileInput',
        previewBoxId: 'clientLogoPreviewBox',
        previewImgId: 'clientLogoPreviewImg',
        pathTxtId: 'clientLogoPathTxt',
        dropzoneId: 'clientLogoDropzone',
        changeBtnId: 'clientChangeLogoBtn',
        deleteBtnId: 'clientDeleteLogoBtn'
      });

      serviceUploader = setupMediaUploader({
        hiddenInputId: 'serviceImageInput',
        fileInputId: 'serviceImageFileInput',
        previewBoxId: 'serviceImagePreviewBox',
        previewImgId: 'serviceImagePreviewImg',
        pathTxtId: 'serviceImagePathTxt',
        dropzoneId: 'serviceImageDropzone',
        changeBtnId: 'serviceChangeImageBtn',
        deleteBtnId: 'serviceDeleteImageBtn'
      });

      homeCardUploader = setupMediaUploader({
        hiddenInputId: 'homeCardMediaUrl',
        fileInputId: 'homeCardFileInput',
        previewBoxId: 'homeCardPreviewBox',
        previewImgId: 'homeCardPreviewImg',
        pathTxtId: 'homeCardPathTxt',
        dropzoneId: 'homeCardDropzone',
        changeBtnId: 'homeCardChangeBtn',
        deleteBtnId: 'homeCardDeleteBtn'
      });
    }

    // ── 1. CUSTOM LUXURY DROPDOWN LOGIC ──
    function initCustomDropdown() {
      const dropdownWrap = document.getElementById('seoCustomDropdown');
      const trigger = document.getElementById('seoDropdownTrigger');
      const options = document.querySelectorAll('.custom-option');
      const hiddenInput = document.getElementById('seoPageSelector');
      const selectedText = document.getElementById('seoDropdownSelectedText');

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownWrap.classList.toggle('open');
      });

      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = opt.getAttribute('data-value');
          hiddenInput.value = val;
          selectedText.innerHTML = opt.innerHTML;

          options.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          dropdownWrap.classList.remove('open');

          loadSEOForm();
        });
      });

      document.addEventListener('click', () => {
        dropdownWrap.classList.remove('open');
      });
    }
