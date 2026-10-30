
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
        profile: 'Studio & Team Minds',
        services: 'Core Services',
        clients: 'Client Logos',
        backup: 'Backup & Database'
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

    // ── 0. EDITORIAL VISUAL WYSIWYG CONTROLLER ──
    function execEditorCommand(command, value = null) {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return;
      editor.focus();
      document.execCommand(command, false, value);
      syncVisualEditorToInput();
      updateEditorWordCount();
    }

    function formatEditorHeading(level) {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return;
      editor.focus();
      if (level === 'p') {
        document.execCommand('formatBlock', false, '<p>');
      } else {
        document.execCommand('formatBlock', false, `<h${level}>`);
      }
      syncVisualEditorToInput();
      updateEditorWordCount();
    }

    function insertEditorPullquote() {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return;
      editor.focus();
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      const quoteText = text || 'Highlight a key perspective or architectural takeaway quote here...';
      const quoteHtml = `<div class="reader-pullquote"><p>“${quoteText.replace(/^["“]|["”]$/g, '')}”</p></div><p></p>`;
      document.execCommand('insertHTML', false, quoteHtml);
      syncVisualEditorToInput();
      updateEditorWordCount();
    }

    function insertEditorTakeaway() {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return;
      editor.focus();
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      const boxText = text || 'Core thesis takeaway for executive readers.';
      const boxHtml = `<div class="reader-takeaway-box"><div class="rtb-title">Key Principle</div><p>${boxText}</p></div><p></p>`;
      document.execCommand('insertHTML', false, boxHtml);
      syncVisualEditorToInput();
      updateEditorWordCount();
    }

    function insertEditorDivider() {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return;
      editor.focus();
      document.execCommand('insertHTML', false, '<hr class="editorial-divider" /><p></p>');
      syncVisualEditorToInput();
    }

    function insertEditorLink() {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return;
      editor.focus();
      const url = prompt('Enter website URL or internal link (e.g. https://... or portfolio.html):');
      if (url && url.trim()) {
        document.execCommand('createLink', false, url.trim());
        syncVisualEditorToInput();
      }
    }

    function toggleCodeView() {
      const visualEditor = document.getElementById('blogVisualEditor');
      const codeEditor = document.getElementById('blogContentInput');
      const btn = document.getElementById('btnToggleEditorCode');
      if (!visualEditor || !codeEditor) return;

      if (visualEditor.style.display === 'none') {
        visualEditor.innerHTML = codeEditor.value || '<p></p>';
        visualEditor.style.display = 'block';
        codeEditor.style.display = 'none';
        if (btn) btn.classList.remove('active');
        showToast('Visual Editor active', 'info');
      } else {
        codeEditor.value = getCleanHtmlFromVisualEditor();
        visualEditor.style.display = 'none';
        codeEditor.style.display = 'block';
        if (btn) btn.classList.add('active');
        showToast('HTML Code view active', 'info');
      }
      updateEditorWordCount();
    }

    function getCleanHtmlFromVisualEditor() {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return '';
      let html = editor.innerHTML || '';
      if (!html.trim() || html === '<p><br></p>' || html === '<p></p>' || html === '<br>') return '';
      return html.trim();
    }

    function syncVisualEditorToInput() {
      const visualEditor = document.getElementById('blogVisualEditor');
      const codeEditor = document.getElementById('blogContentInput');
      if (!visualEditor || !codeEditor) return;
      if (visualEditor.style.display !== 'none') {
        codeEditor.value = getCleanHtmlFromVisualEditor();
      }
    }

    function updateEditorWordCount() {
      const visualEditor = document.getElementById('blogVisualEditor');
      const badge = document.getElementById('editorWordCountBadge');
      if (!visualEditor || !badge) return;
      const text = visualEditor.innerText || visualEditor.textContent || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      badge.textContent = `${words} word${words === 1 ? '' : 's'}`;
    }

    function autoFormatEditorContent() {
      const editor = document.getElementById('blogVisualEditor');
      if (!editor) return;
      let raw = editor.innerText || editor.textContent || '';
      if (!raw.trim()) {
        showToast('Editor is empty. Paste or write your article text first.', 'info');
        return;
      }
      
      const blocks = raw.split(/\n\s*\n/);
      const formattedBlocks = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (/^#{1,3}\s+(.+)$/m.test(trimmed)) {
          const heading = trimmed.replace(/^#{1,3}\s+/, '');
          return `<h2>${heading}</h2>`;
        }
        if (/^(0[1-9]|[1-9][0-9]?)\.\s+[A-Z]/m.test(trimmed) && trimmed.length < 90 && !trimmed.includes('\n')) {
          return `<h2>${trimmed}</h2>`;
        }
        if (/^[-*•]\s+/m.test(trimmed)) {
          const items = trimmed.split(/\n/).map(l => `  <li>${l.replace(/^[-*•]\s+/, '').trim()}</li>`).join('\n');
          return `<ul>\n${items}\n</ul>`;
        }
        if (/^["“]/.test(trimmed) && /["”]$/.test(trimmed)) {
          return `<div class="reader-pullquote">\n  <p>${trimmed}</p>\n</div>`;
        }
        const pContent = trimmed.replace(/\n/g, '<br />');
        return `<p>${pContent}</p>`;
      });

      const finalHtml = formattedBlocks.filter(Boolean).join('\n\n');
      editor.innerHTML = finalHtml;
      syncVisualEditorToInput();
      updateEditorWordCount();
      showToast('⚡ Article automatically formatted into clean visual headings & paragraphs!');
    }

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
