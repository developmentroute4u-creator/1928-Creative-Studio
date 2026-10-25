    // ── 5. STUDIO PROFILE & TEAM ENGINE ──
    function renderProfileView() {
      const teamGrid = document.getElementById('teamGrid');
      const principlesGrid = document.getElementById('principlesGrid');
      const team = window.CMSStore.getTeam();
      const principles = window.CMSStore.getPrinciples();

      document.getElementById('statTeamNum').textContent = team.length;
      document.getElementById('badgeTeamCount').textContent = team.length;

      teamGrid.innerHTML = team.map(m => `
        <div class="client-logo-admin-card" style="cursor:pointer;" onclick="editTeamMember('${m.id}')">
          <div style="width:72px;height:72px;border-radius:50%;overflow:hidden;border:2px solid var(--cr);">
            <img src="${m.photo || 'assets/img/team/team-ami.jpg'}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='assets/img/team/team-ami.jpg';" />
          </div>
          <div>
            <div class="client-title-txt">${m.name}</div>
            <div class="client-sub-txt">${m.role}</div>
          </div>
          <div class="action-row" style="margin-top:auto;gap:6px;" onclick="event.stopPropagation();">
            <button class="btn-action-secondary" style="padding:6px 12px;font-size:11px;" onclick="editTeamMember('${m.id}')">Edit</button>
            <button class="btn-action-danger" onclick="deleteTeamMember('${m.id}')">Delete</button>
          </div>
        </div>
      `).join('');

      principlesGrid.innerHTML = principles.map(p => {
        const tags = Array.isArray(p.tags) ? p.tags : [];
        return `
          <div class="cms-card" style="padding:24px;position:relative;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:border-color 0.2s, transform 0.2s;" onclick="editPrinciple('${p.id}')">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;">
                <span style="font-family:var(--font-mono);font-size:11px;color:var(--cr);font-weight:700;letter-spacing:0.04em;">${p.num} / ${p.pill || 'Think With Purpose'}</span>
                <button type="button" class="btn-action-secondary" style="padding:4px 12px;font-size:11px;border-radius:6px;" onclick="event.stopPropagation(); editPrinciple('${p.id}')">Edit</button>
              </div>
              <h3 style="font-family:var(--font-primary);font-size:16px;font-weight:800;margin:0 0 10px;color:var(--ink);letter-spacing:-0.02em;">${p.title}</h3>
              <p style="font-size:13px;color:var(--ink-mid);line-height:1.55;margin:0;">${p.desc}</p>
            </div>
            <div style="margin-top:20px;padding-top:14px;border-top:1px solid var(--rule);display:flex;flex-wrap:wrap;align-items:center;gap:6px;">
              ${tags.length ? tags.map(t => `<span style="font-family:var(--font-mono);font-size:10px;color:var(--ink-dim);font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">${t}</span>`).join('<span style="color:var(--cr);font-size:9px;">·</span>') : '<span style="font-size:11px;color:var(--ink-dim);font-style:italic;">No pillar tags</span>'}
            </div>
          </div>
        `;
      }).join('');
    }

    function openPrincipleModal(pData = null) {
      if (!pData) return;
      document.getElementById('principleModalTitle').textContent = `Edit Principle ${pData.num || ''}`;
      document.getElementById('principleIdInput').value = pData.id || '';
      document.getElementById('principleNumInput').value = pData.num || '01';
      document.getElementById('principlePillInput').value = pData.pill || '';
      document.getElementById('principleTitleInput').value = pData.title || '';
      document.getElementById('principleDescInput').value = pData.desc || '';
      document.getElementById('principleTagsInput').value = Array.isArray(pData.tags) ? pData.tags.join(', ') : (pData.tags || '');

      document.getElementById('principleModal').classList.add('active');
    }

    function editPrinciple(id) {
      const principle = window.CMSStore.getPrinciples().find(p => p.id === id);
      if (principle) openPrincipleModal(principle);
    }

    document.getElementById('principleForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('principleIdInput').value;
      const tagsRaw = document.getElementById('principleTagsInput').value;
      const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

      const data = {
        id: id || ('p' + Date.now()),
        num: document.getElementById('principleNumInput').value.trim(),
        pill: document.getElementById('principlePillInput').value.trim(),
        title: document.getElementById('principleTitleInput').value.trim().toUpperCase(),
        desc: document.getElementById('principleDescInput').value.trim(),
        tags: tags
      };

      window.CMSStore.savePrinciple(data);
      closeModal('principleModal');
      renderProfileView();
      showToast('Studio principle updated successfully!');
    });

    function openTeamModal(tData = null) {
      document.getElementById('teamModalTitle').textContent = tData ? 'Edit Team Member' : 'Add Team Member';
      document.getElementById('teamIdInput').value = tData ? tData.id : '';
      document.getElementById('teamNameInput').value = tData ? tData.name : '';
      document.getElementById('teamRoleInput').value = tData ? tData.role : '';
      
      const photoVal = tData ? tData.photo : 'assets/img/team/team-ami.jpg';
      document.getElementById('teamPhotoInput').value = photoVal;
      if (teamUploader) teamUploader.refreshUI();

      document.getElementById('teamModal').classList.add('active');
    }

    function editTeamMember(id) {
      const member = window.CMSStore.getTeam().find(m => m.id === id);
      if (member) openTeamModal(member);
    }

    function deleteTeamMember(id) {
      if (confirm('Are you sure you want to remove this team member?')) {
        window.CMSStore.deleteTeamMember(id);
        renderProfileView();
        showToast('Team member removed.');
      }
    }

    document.getElementById('teamForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('teamIdInput').value;
      const data = {
        name: document.getElementById('teamNameInput').value.trim(),
        role: document.getElementById('teamRoleInput').value.trim(),
        photo: document.getElementById('teamPhotoInput').value.trim() || 'assets/img/team/team-ami.jpg'
      };
      if (id) data.id = id;

      window.CMSStore.saveTeamMember(data);
      closeModal('teamModal');
      renderProfileView();
      showToast('Team member saved successfully!');
    });
