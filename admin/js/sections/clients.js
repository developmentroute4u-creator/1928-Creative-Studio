    // ── 7. CLIENT LOGOS ENGINE ──
    function renderClientsGrid() {
      const grid = document.getElementById('clientsGrid');
      const clients = window.CMSStore.getClients();

      document.getElementById('statClientsNum').textContent = clients.length;
      document.getElementById('badgeClientsCount').textContent = clients.length;

      grid.innerHTML = clients.map(c => `
        <div class="client-logo-admin-card" style="cursor:pointer;" onclick="editClient('${c.id}')">
          <div class="client-preview-box">
            ${c.type === 'svg' && c.svgCode ? c.svgCode : (c.imageUrl ? `<img src="${c.imageUrl}" alt="${c.name}" style="max-height:50px;max-width:90%;object-fit:contain;border-radius:4px;" onerror="this.style.opacity='0.2';" />` : `<strong>${c.name}</strong>`)}
          </div>
          <div>
            <div class="client-title-txt">${c.name}</div>
            <div class="client-sub-txt">${c.subtitle || 'Client Partner'}</div>
          </div>
          <div class="action-row" style="margin-top:auto;gap:6px;" onclick="event.stopPropagation();">
            <button class="btn-action-secondary" style="padding:6px 12px;font-size:11px;" onclick="editClient('${c.id}')">Edit</button>
            <button class="btn-action-danger" onclick="deleteClient('${c.id}')">Delete</button>
          </div>
        </div>
      `).join('');
    }

    function toggleClientTypeInputs() {
      const type = document.getElementById('clientTypeInput').value;
      document.getElementById('clientSvgGroup').style.display = type === 'svg' ? 'block' : 'none';
      document.getElementById('clientImageGroup').style.display = type === 'image' ? 'block' : 'none';
      updateClientLivePreview();
    }

    function updateClientLivePreview() {
      const type = document.getElementById('clientTypeInput').value;
      const preview = document.getElementById('clientLivePreview');
      if (type === 'svg') {
        const svg = document.getElementById('clientSvgInput').value;
        preview.innerHTML = svg || '<span style="color:var(--ink-dim);font-size:12px;">Paste valid SVG to preview</span>';
      } else {
        const img = document.getElementById('clientImgInput').value;
        preview.innerHTML = img ? `<img src="${img}" alt="Preview" style="max-height:40px;" />` : '<span style="color:var(--ink-dim);font-size:12px;">Image preview will render here</span>';
      }
    }

    document.getElementById('clientSvgInput').addEventListener('input', updateClientLivePreview);

    function openClientModal(cData = null) {
      document.getElementById('clientModalTitle').textContent = cData ? 'Edit Client Logo' : 'Add Client Logo';
      document.getElementById('clientIdInput').value = cData ? cData.id : '';
      document.getElementById('clientNameInput').value = cData ? cData.name : '';
      document.getElementById('clientSubtitleInput').value = cData ? (cData.subtitle || '') : '';
      document.getElementById('clientUrlInput').value = cData ? (cData.websiteUrl || '') : '';
      const typeVal = cData ? (cData.type || 'svg') : 'svg';
      const typeLabels = { 'svg': 'Inline Vector SVG Code', 'image': 'Image File Upload (Assets Folder)' };
      setCustomDropdownValue('customDropdown_clientType', typeVal, typeLabels[typeVal] || typeVal);
      document.getElementById('clientSvgInput').value = cData ? (cData.svgCode || '') : '';
      
      const imgVal = cData ? (cData.imageUrl || '') : '';
      document.getElementById('clientImgInput').value = imgVal;
      if (clientUploader) clientUploader.refreshUI();

      toggleClientTypeInputs();
      document.getElementById('clientModal').classList.add('active');
    }

    function editClient(id) {
      const client = window.CMSStore.getClientById(id);
      if (client) openClientModal(client);
    }

    function deleteClient(id) {
      if (confirm('Are you sure you want to remove this client logo?')) {
        const client = window.CMSStore.getClientById(id);
        if (client && client.imageUrl && !client.imageUrl.includes('Client Logos-')) {
          fetch('api.php?action=delete_asset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath: client.imageUrl })
          }).catch(() => {});
        }
        window.CMSStore.deleteClient(id);
        renderClientsGrid();
        showToast('Client logo removed.');
      }
    }

    document.getElementById('clientForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('clientIdInput').value;
      const data = {
        name: document.getElementById('clientNameInput').value.trim(),
        subtitle: document.getElementById('clientSubtitleInput').value.trim(),
        websiteUrl: document.getElementById('clientUrlInput').value.trim(),
        type: document.getElementById('clientTypeInput').value,
        svgCode: document.getElementById('clientSvgInput').value.trim(),
        imageUrl: document.getElementById('clientImgInput').value.trim(),
        active: true
      };
      if (id) data.id = id;

      window.CMSStore.saveClient(data);
      closeModal('clientModal');
      renderClientsGrid();
      showToast('Client logo saved successfully!');
    });
