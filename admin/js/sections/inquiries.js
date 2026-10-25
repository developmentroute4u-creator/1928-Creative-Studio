    // ═══════════════════════════════════════════════════════════
    // 10. INQUIRIES & LEADS MASTER CONTROLLER
    // ═══════════════════════════════════════════════════════════
    let allInquiriesList = [];
    let currentInqFilter = 'all';
    let currentInqSearch = '';
    let currentSelectedInquiry = null;

    function copyText(str) {
      if (!str || str === '-') return;
      navigator.clipboard.writeText(str).then(() => {
        showToast(`Copied to clipboard: ${str}`, 'info');
      }).catch(() => {
        const temp = document.createElement('textarea');
        temp.value = str;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`Copied to clipboard: ${str}`, 'info');
      });
    }

    async function loadContactInquiries(showToastNotice = false) {
      const tbody = document.getElementById('inquiriesTableBody');
      try {
        const queryParams = new URLSearchParams();
        if (currentInqFilter !== 'all') queryParams.append('status', currentInqFilter);
        if (currentInqSearch) queryParams.append('search', currentInqSearch);

        const res = await fetch(`api.php?action=get_contact_inquiries&${queryParams.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data && data.status === 'success') {
          allInquiriesList = data.inquiries || [];
          const counts = data.counts || {};

          // Update Stats Ribbon
          const elTotal = document.getElementById('inqStatTotal');
          const elNew = document.getElementById('inqStatNew');
          const elReview = document.getElementById('inqStatReview');
          const elContacted = document.getElementById('inqStatContacted');
          const elArchived = document.getElementById('inqStatArchived');

          if (elTotal) elTotal.textContent = counts.total || 0;
          if (elNew) elNew.textContent = counts.new || 0;
          if (elReview) elReview.textContent = counts.in_review || 0;
          if (elContacted) elContacted.textContent = counts.contacted || 0;
          if (elArchived) elArchived.textContent = counts.archived || 0;

          // Update Filter Button Count Badges
          const badgeAll = document.getElementById('inqFilterCountAll');
          const badgeNew = document.getElementById('inqFilterCountNew');
          const badgeRev = document.getElementById('inqFilterCountReview');
          const badgeCon = document.getElementById('inqFilterCountContacted');
          const badgeArc = document.getElementById('inqFilterCountArchived');

          if (badgeAll) badgeAll.textContent = counts.total || 0;
          if (badgeNew) badgeNew.textContent = counts.new || 0;
          if (badgeRev) badgeRev.textContent = counts.in_review || 0;
          if (badgeCon) badgeCon.textContent = counts.contacted || 0;
          if (badgeArc) badgeArc.textContent = counts.archived || 0;

          // Update Sidebar Badge & Dashboard Card
          const badgeSidebar = document.getElementById('badgeInquiriesCount');
          if (badgeSidebar) {
            badgeSidebar.textContent = counts.new > 0 ? `${counts.new} New` : (counts.total || 0);
            badgeSidebar.style.background = counts.new > 0 ? 'var(--cr)' : 'var(--rule-heavy)';
          }

          const statDashNum = document.getElementById('statInquiriesNum');
          const statDashSub = document.getElementById('statNewInquiriesSub');
          if (statDashNum) statDashNum.textContent = counts.total || 0;
          if (statDashSub) {
            statDashSub.textContent = counts.new > 0 ? `${counts.new} New / Unread Brief${counts.new === 1 ? '' : 's'}` : 'All caught up';
          }

          // Update Sidebar Contact Badge & Tab Badges
          const badgeContact = document.getElementById('badgeContactCount');
          if (badgeContact) {
            badgeContact.textContent = counts.new > 0 ? `${counts.new} New` : `${counts.total || 0} Briefs`;
            badgeContact.style.background = counts.new > 0 ? 'var(--cr)' : 'var(--rule-heavy)';
          }

          const badgeTabInq = document.getElementById('badgeTabInquiriesCount');
          if (badgeTabInq) {
            badgeTabInq.textContent = counts.new > 0 ? `${counts.new} New` : (counts.total || 0);
          }

          const badgeHdrNew = document.getElementById('badgeContactHeaderNew');
          if (badgeHdrNew) {
            badgeHdrNew.textContent = counts.new > 0 ? `${counts.new} New Briefs Awaiting Review` : `${counts.total || 0} Stored Briefs (Live)`;
          }

          renderInquiriesTable();
          renderDashboardRecentInquiries(allInquiriesList);

          if (showToastNotice) {
            showToast('Refreshed latest client inquiries & briefs directly from MySQL');
          }
        }
      } catch (err) {
        console.error('Database inquiries query error:', err);
        allInquiriesList = [];
        renderInquiriesTable();
      }
    }

    function renderInquiriesTable() {
      const tbody = document.getElementById('inquiriesTableBody');
      if (!tbody) return;

      if (!allInquiriesList || allInquiriesList.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center;padding:68px 24px;">
              <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;">
                <div style="width:52px;height:52px;border-radius:14px;background:rgba(200,16,46,0.06);border:1px solid rgba(200,16,46,0.18);display:flex;align-items:center;justify-content:center;color:var(--cr);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div style="font-family:var(--font-primary);font-size:15px;font-weight:800;color:var(--ink);letter-spacing:-0.01em;">No Client Inquiries Logged Yet</div>
                <p style="font-family:var(--font-secondary);font-size:12.5px;color:var(--ink-mid);margin:0;max-width:420px;line-height:1.5;">New client submissions and strategy session appointments from the contact page will automatically appear here in real-time.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      const statusMap = {
        new: { label: 'New', cls: 'inq-pill-new' },
        in_review: { label: 'In Review', cls: 'inq-pill-review' },
        contacted: { label: 'Contacted', cls: 'inq-pill-contacted' },
        archived: { label: 'Archived', cls: 'inq-pill-archived' }
      };

      tbody.innerHTML = allInquiriesList.map(inq => {
        const st = statusMap[inq.status] || statusMap.new;
        const formattedDate = inq.created_at ? inq.created_at.substring(0, 16) : '-';
        const sessionTime = inq.session_summary || (inq.session_date ? `${inq.session_date} · ${inq.session_time}` : 'Not Specified');
        const escapedName = (inq.name || 'Valued Client').replace(/"/g, '&quot;');
        const escapedCompany = (inq.company || 'Independent Project').replace(/"/g, '&quot;');

        return `
          <tr id="inqRow_${inq.id}">
            <td class="inq-cell-date">${formattedDate}</td>
            <td>
              <div class="inq-cell-client">
                <span class="inq-client-name">${escapedName}</span>
                <span class="inq-client-brand">${escapedCompany} · <a href="mailto:${inq.email}" style="color:var(--ink-mid);text-decoration:none;">${inq.email}</a></span>
              </div>
            </td>
            <td>
              <span class="inq-cell-mandate">${inq.service || 'Creative Direction'}</span>
            </td>
            <td>
              <span class="inq-cell-budget">${inq.budget || 'Undisclosed'}</span>
            </td>
            <td style="font-size:12px;color:var(--ink-mid);">
              ${sessionTime}
            </td>
            <td>
              <span class="inq-pill ${st.cls}">${st.label}</span>
            </td>
            <td style="text-align:right;white-space:nowrap;">
              <button type="button" class="btn-action-primary" onclick="openInquiryDetail(${inq.id})" style="padding:6px 12px;font-size:11px;">
                View Brief
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function renderDashboardRecentInquiries(inquiries) {
      const tbody = document.getElementById('dashRecentInquiriesBody');
      if (!tbody) return;

      if (!inquiries || inquiries.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center;padding:52px 24px;">
              <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
                <div style="width:46px;height:46px;border-radius:12px;background:rgba(200,16,46,0.06);border:1px solid rgba(200,16,46,0.16);display:flex;align-items:center;justify-content:center;color:var(--cr);">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div style="font-family:var(--font-primary);font-size:14px;font-weight:800;color:var(--ink);letter-spacing:-0.01em;">No Recent Inquiries Logged Yet</div>
                <p style="font-family:var(--font-secondary);font-size:12px;color:var(--ink-mid);margin:0;max-width:380px;line-height:1.5;">Live client submissions and strategy session appointments from the contact page will appear here.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      const recent = inquiries.slice(0, 5);
      const statusMap = {
        new: { label: 'New', cls: 'inq-pill-new' },
        in_review: { label: 'In Review', cls: 'inq-pill-review' },
        contacted: { label: 'Contacted', cls: 'inq-pill-contacted' },
        archived: { label: 'Archived', cls: 'inq-pill-archived' }
      };

      tbody.innerHTML = recent.map(inq => {
        const st = statusMap[inq.status] || statusMap.new;
        const formattedDate = inq.created_at ? inq.created_at.substring(0, 10) : '-';
        const sessionTime = inq.session_summary || (inq.session_date ? `${inq.session_date} · ${inq.session_time}` : 'Not Specified');
        const escapedName = (inq.name || 'Valued Client').replace(/"/g, '&quot;');
        const escapedCompany = (inq.company || 'Independent Project').replace(/"/g, '&quot;');

        return `
          <tr>
            <td class="inq-cell-date">${formattedDate}</td>
            <td>
              <div class="inq-cell-client">
                <span class="inq-client-name">${escapedName}</span>
                <span class="inq-client-brand">${escapedCompany}</span>
              </div>
            </td>
            <td><span class="inq-cell-mandate">${inq.service || 'Strategy'}</span></td>
            <td><span class="inq-cell-budget">${inq.budget || 'Undisclosed'}</span></td>
            <td style="font-size:12px;color:var(--ink-mid);">${sessionTime}</td>
            <td><span class="inq-pill ${st.cls}">${st.label}</span></td>
            <td style="text-align:right;">
              <button type="button" class="btn-action-secondary" onclick="openInquiryDetail(${inq.id})" style="padding:4px 10px;font-size:10.5px;">Inspect</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function filterInquiriesStatus(status) {
      currentInqFilter = status;
      document.querySelectorAll('.inq-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-status') === status);
      });
      loadContactInquiries();
    }

    let inqSearchDebounce = null;
    function handleInquiriesSearch(val) {
      currentInqSearch = (val || '').trim();
      clearTimeout(inqSearchDebounce);
      inqSearchDebounce = setTimeout(() => {
        loadContactInquiries();
      }, 250);
    }

    async function openInquiryDetail(id) {
      let inquiry = allInquiriesList.find(i => String(i.id) === String(id));
      if (!inquiry) {
        try {
          const res = await fetch(`api.php?action=get_inquiry_detail&id=${id}`);
          const json = await res.json();
          if (json && json.status === 'success') {
            inquiry = json.data;
          }
        } catch (e) {}
      }

      if (!inquiry) {
        showToast('Could not load inquiry details.', 'error');
        return;
      }

      currentSelectedInquiry = inquiry;

      // Populate Modal Fields
      document.getElementById('modalInquiryIdInput').value = inquiry.id;
      document.getElementById('modalInquiryIdBadge').textContent = `Inquiry #${inquiry.id}`;
      document.getElementById('modalInquiryTitle').textContent = `${inquiry.name} · ${inquiry.company || 'Project Brief'}`;
      document.getElementById('modalInquirySubtitle').textContent = `Received on ${inquiry.created_at || 'Recent date'}`;

      const statusMap = {
        new: { label: 'New', cls: 'inq-pill-new' },
        in_review: { label: 'In Review', cls: 'inq-pill-review' },
        contacted: { label: 'Contacted', cls: 'inq-pill-contacted' },
        archived: { label: 'Archived', cls: 'inq-pill-archived' }
      };
      const st = statusMap[inquiry.status] || statusMap.new;
      const statusPill = document.getElementById('modalInquiryStatusPill');
      if (statusPill) {
        statusPill.textContent = st.label;
        statusPill.className = `inq-pill ${st.cls}`;
      }

      document.getElementById('mInqName').textContent = inquiry.name || '-';
      document.getElementById('mInqCompany').textContent = inquiry.company || 'Independent Project';

      const emailLink = document.getElementById('mInqEmailLink');
      if (emailLink) {
        emailLink.textContent = inquiry.email || '-';
        emailLink.href = inquiry.email ? `mailto:${inquiry.email}` : '#';
      }

      const phoneLink = document.getElementById('mInqPhoneLink');
      if (phoneLink) {
        phoneLink.textContent = inquiry.phone || 'Not Specified';
        phoneLink.href = inquiry.phone ? `tel:${inquiry.phone.replace(/\s+/g, '')}` : '#';
      }

      document.getElementById('mInqService').textContent = inquiry.service || 'Creative Direction';
      document.getElementById('mInqBudget').textContent = inquiry.budget || 'Undisclosed Allocation';
      document.getElementById('mInqTimeline').textContent = inquiry.timeline || '< 1 Month (Immediate)';
      document.getElementById('mInqSession').textContent = inquiry.session_summary || (inquiry.session_date ? `${inquiry.session_date} · ${inquiry.session_time}` : 'Not Specified');
      document.getElementById('mInqNda').textContent = inquiry.nda || 'Standard Review';
      document.getElementById('mInqCreated').textContent = inquiry.created_at || '-';
      document.getElementById('mInqVision').textContent = inquiry.vision || 'No project vision written in submission.';

      const selStatus = document.getElementById('mInqStatusSelect');
      if (selStatus) selStatus.value = inquiry.status || 'new';

      const statusLabels = {
        new: 'New (Unread / Needs Review)',
        in_review: 'In Review (Evaluating Scope)',
        contacted: 'Contacted (Meeting Scheduled)',
        archived: 'Archived (Completed / Closed)'
      };
      const curStatus = inquiry.status || 'new';
      selectGenericDropdownOption('customDropdown_mInqStatus', 'mInqStatusSelect', curStatus, statusLabels[curStatus] || 'New (Unread / Needs Review)');

      const txtNotes = document.getElementById('mInqAdminNotes');
      if (txtNotes) txtNotes.value = inquiry.admin_notes || '';

      const tel = document.getElementById('mInqTelemetry');
      if (tel) {
        tel.textContent = `Client IP: ${inquiry.ip_address || '127.0.0.1'} · System: ${inquiry.user_agent ? inquiry.user_agent.substring(0, 45) + '...' : 'Browser Web'}`;
      }

      const replyBtn = document.getElementById('mInqDirectReplyBtn');
      if (replyBtn) {
        const subject = encodeURIComponent(`1928 Creative Studio · Re: ${inquiry.service || 'Project'} Brief (${inquiry.company || inquiry.name})`);
        const body = encodeURIComponent(`Hi ${inquiry.name},\n\nThank you for reaching out to 1928 Creative Studio and sharing your project brief for ${inquiry.company || 'your brand'}.\n\nOur creative directors have reviewed your mandate (${inquiry.service}) and would like to confirm our strategy consultation window:\n${inquiry.session_summary || ''}\n\nWarm regards,\nTeam 1928\n1928 Creative Studio\nhttps://1928creativestudio.com`);
        replyBtn.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
      }

      document.getElementById('modalInquiryDetail').classList.add('active');
    }

    async function saveCurrentInquiryDetail() {
      const id = document.getElementById('modalInquiryIdInput').value;
      const newStatus = document.getElementById('mInqStatusSelect').value;
      const notes = document.getElementById('mInqAdminNotes').value;

      if (!id) return;

      try {
        const res = await fetch('api.php?action=update_inquiry_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(id), status: newStatus, admin_notes: notes })
        });
        const json = await res.json();
        if (json && json.status === 'success') {
          showToast('Inquiry status and notes saved to MySQL database!');
          closeModal('modalInquiryDetail');
          loadContactInquiries();
        } else {
          showToast((json && json.message) ? json.message : 'Failed to update inquiry', 'error');
        }
      } catch (err) {
        showToast(`Save error: ${err.message}`, 'error');
      }
    }

    async function confirmDeleteCurrentInquiry() {
      const id = document.getElementById('modalInquiryIdInput').value;
      if (!id) return;

      if (!confirm('Are you sure you want to permanently delete this client inquiry? This action cannot be undone.')) {
        return;
      }

      try {
        const res = await fetch('api.php?action=delete_inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(id) })
        });
        const json = await res.json();
        if (json && json.status === 'success') {
          showToast('Inquiry deleted successfully.');
          closeModal('modalInquiryDetail');
          loadContactInquiries();
        } else {
          showToast((json && json.message) ? json.message : 'Failed to delete inquiry', 'error');
        }
      } catch (err) {
        showToast(`Delete error: ${err.message}`, 'error');
      }
    }
