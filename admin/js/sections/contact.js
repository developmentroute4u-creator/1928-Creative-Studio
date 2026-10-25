// ═══════════════════════════════════════════════════════════
    // 7.5 CONTACT & MULTI-STEP BRIEF CONTROLLER
    // ═══════════════════════════════════════════════════════════
    let currentContactTab = 'scope';

    function switchContactSubTab(tabName) {
      currentContactTab = tabName;
      const tabBtns = {
        scope: 'tabBtnContactScope',
        disciplines: 'tabBtnContactDisc',
        allocation: 'tabBtnContactAlloc',
        session: 'tabBtnContactSession',
        credentials: 'tabBtnContactCreds'
      };
      const subPanes = {
        scope: 'contactSubpaneScope',
        disciplines: 'contactSubpaneDisciplines',
        allocation: 'contactSubpaneAllocation',
        session: 'contactSubpaneSession',
        credentials: 'contactSubpaneCredentials'
      };

      document.querySelectorAll('#view-contact .subnav-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('#view-contact .subnav-pane').forEach(pane => pane.classList.remove('active'));

      const activeBtn = document.getElementById(tabBtns[tabName]);
      const activePane = document.getElementById(subPanes[tabName]);

      if (activeBtn) activeBtn.classList.add('active');
      if (activePane) activePane.classList.add('active');
    }

    // Dynamic Lists State
    let contactDisciplinesState = [];
    let contactTimelinesState = [];
    let contactSlotsState = [];
    let contactTopicsState = [];
    let contactDateSlotsState = {};
    let selectedSlotDateKey = 'default';
    let adminCalMonth = 9; // October (0-indexed)
    let adminCalYear = 2026;

    function renderContactAdminView() {
      if (!window.CMSStore || typeof window.CMSStore.getContactBrief !== 'function') return;
      const brief = window.CMSStore.getContactBrief();
      if (!brief) return;

      // ── Subpane 1: Scope ──
      const s1 = brief.step1 || {};
      const elS1Rail = document.getElementById('contactStep1RailWord');
      const elS1Head = document.getElementById('contactStep1Headline');
      const elS1Cap = document.getElementById('contactStep1Caption');
      if (elS1Rail) elS1Rail.value = s1.railWord || 'Scope';
      if (elS1Head) elS1Head.value = s1.headline || 'Engagement Classification';
      if (elS1Cap) elS1Cap.value = s1.caption || 'Select the primary service for this project.';

      const cards = Array.isArray(s1.cards) ? s1.cards : [];
      for (let i = 0; i < 5; i++) {
        const c = cards[i] || {};
        const elIdx = document.getElementById(`scopeCardIndex_${i}`);
        const elT = document.getElementById(`scopeCardTitle_${i}`);
        const elKw = document.getElementById(`scopeCardKw_${i}`);

        if (elIdx) elIdx.value = c.index || '';
        if (elT) elT.value = c.title || '';
        if (elKw) elKw.value = Array.isArray(c.keywords) ? c.keywords.join(', ') : (c.keywords || '');
      }

      // ── Subpane 2: Disciplines ──
      const s2 = brief.step2 || {};
      const elS2Rail = document.getElementById('contactStep2RailWord');
      const elS2Head = document.getElementById('contactStep2Headline');
      const elS2Cap = document.getElementById('contactStep2Caption');
      if (elS2Rail) elS2Rail.value = s2.railWord || 'Disciplines';
      if (elS2Head) elS2Head.value = s2.headline || 'Specialized Disciplines';
      if (elS2Cap) elS2Cap.value = s2.caption || 'Choose all deliverables and capabilities required for this engagement.';

      contactDisciplinesState = Array.isArray(s2.disciplines) ? JSON.parse(JSON.stringify(s2.disciplines)) : [];
      renderContactDisciplinesList();

      // ── Subpane 3: Capital Allocation ──
      const s3 = brief.step3 || {};
      const elS3Rail = document.getElementById('contactStep3RailWord');
      const elS3Head = document.getElementById('contactStep3Headline');
      const elS3Cap = document.getElementById('contactStep3Caption');
      if (elS3Rail) elS3Rail.value = s3.railWord || 'Allocation';
      if (elS3Head) elS3Head.value = s3.headline || 'Capital Allocation (INR ₹)';
      if (elS3Cap) elS3Cap.value = s3.caption || 'Select your target budget tier and optional consultation window.';

      const tiers = Array.isArray(s3.tiers) ? s3.tiers : [];
      for (let i = 0; i < 4; i++) {
        const t = tiers[i] || {};
        const elAmt = document.getElementById(`contactTierAmount_${i}`);
        const elName = document.getElementById(`contactTierName_${i}`);
        const elRad = document.getElementById(`contactTierDefault_${i}`);
        if (elAmt) elAmt.value = t.amount || '';
        if (elName) elName.value = t.name || '';
        if (elRad) elRad.checked = !!t.defaultSelected || (i === 1 && !tiers.some(x => x.defaultSelected));
      }

      const elTlTitle = document.getElementById('contactStep3TlTitle');
      if (elTlTitle) elTlTitle.value = s3.timelineTitle || 'Target Engagement Timeline';
      contactTimelinesState = Array.isArray(s3.timelines) ? JSON.parse(JSON.stringify(s3.timelines)) : [];
      renderContactTimelinesList();

      // ── Subpane 4: Strategy Session & Dynamic Calendar ──
      const s4 = brief.step4 || {};
      const elS4Rail = document.getElementById('contactStep4RailWord');
      const elS4Head = document.getElementById('contactStep4Headline');
      const elS4Cap = document.getElementById('contactStep4Caption');
      if (elS4Rail) elS4Rail.value = s4.railWord || 'Session';
      if (elS4Head) elS4Head.value = s4.headline || 'Strategy Session Window';
      if (elS4Cap) elS4Cap.value = s4.caption || 'Select your preferred 30-minute consultation window with our design leadership.';

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const currentDay = now.getDate();

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const isLegacyDemo = (s4.defaultMonth === 8 && s4.defaultDay === 29);

      adminCalMonth = (s4.defaultMonth !== undefined && s4.defaultMonth !== null && !isLegacyDemo) ? s4.defaultMonth : currentMonth;
      adminCalYear = (s4.defaultYear && s4.defaultYear >= currentYear) ? s4.defaultYear : currentYear;

      selectGenericDropdownOption('customDropdown_contactMonth', 'contactStep4Month', String(adminCalMonth), monthNames[adminCalMonth] || 'October');

      const elYear = document.getElementById('contactStep4Year');
      if (elYear) elYear.value = adminCalYear;

      let initDay = s4.defaultDay;
      if (!initDay || isLegacyDemo || (adminCalYear === currentYear && adminCalMonth === currentMonth && initDay < currentDay)) {
        initDay = currentDay;
      }
      const elDay = document.getElementById('contactStep4Day');
      if (elDay) elDay.value = initDay;

      const selTz = s4.timezone || 'Asia/Kolkata (IST · GMT+5:30)';
      selectGenericDropdownOption('customDropdown_contactTimezone', 'contactStep4Timezone', selTz, selTz);

      const elBooked = document.getElementById('contactStep4BookedDays');
      if (elBooked) elBooked.value = Array.isArray(s4.bookedDays) ? s4.bookedDays.join(', ') : '';

      contactSlotsState = Array.isArray(s4.slots) ? [...s4.slots] : ['11:00 AM IST', '02:30 PM IST', '04:30 PM IST', '06:00 PM IST', '08:00 PM IST'];
      contactDateSlotsState = (s4.dateSlots && typeof s4.dateSlots === 'object') ? JSON.parse(JSON.stringify(s4.dateSlots)) : {};
      
      // Default selected slot date brings admin to today or initial configured day
      selectedSlotDateKey = String(initDay || 'default');

      renderInteractiveBlockedDaysGrid();
      renderAdminSlotsDateScroller();
      renderContactSlotsList();

      const elFocusLabel = document.getElementById('contactStep4FocusLabel');
      if (elFocusLabel) elFocusLabel.value = s4.focusLabel || 'Consultation Focus Area';
      contactTopicsState = Array.isArray(s4.focusTopics) ? [...s4.focusTopics] : [
        'Logo Design & Visual Identity',
        'Brand Identity Development',
        'Website Design & Development',
        'Social Media & Digital Marketing',
        'Content Creation & Influencer Marketing',
        'Full 360° Studio Creative Partnership'
      ];
      renderContactTopicsList();

      // ── Subpane 5: Credentials & Success ──
      const s5 = brief.step5 || {};
      const elS5Rail = document.getElementById('contactStep5RailWord');
      const elS5Head = document.getElementById('contactStep5Headline');
      const elS5Cap = document.getElementById('contactStep5Caption');
      if (elS5Rail) elS5Rail.value = s5.railWord || 'Credentials';
      if (elS5Head) elS5Head.value = s5.headline || 'Credentials & Brief';
      if (elS5Cap) elS5Cap.value = s5.caption || 'Your particulars and project brief.';

      const setVal = (id, val, fallback) => {
        const el = document.getElementById(id);
        if (el) el.value = (val !== undefined && val !== null) ? val : fallback;
      };

      setVal('contactField_nameLabel', s5.nameLabel, 'Full Name *');
      setVal('contactField_namePlaceholder', s5.namePlaceholder, 'e.g. Alexander Vance');
      setVal('contactField_emailLabel', s5.emailLabel, 'Corporate Email *');
      setVal('contactField_emailPlaceholder', s5.emailPlaceholder, 'e.g. example@gmail.com');
      setVal('contactField_orgLabel', s5.orgLabel, 'Enterprise / Brand *');
      setVal('contactField_orgPlaceholder', s5.orgPlaceholder, 'e.g. 1928 Creative Studio');
      setVal('contactField_phoneLabel', s5.phoneLabel, 'Contact Number *');
      setVal('contactField_phonePlaceholder', s5.phonePlaceholder, '98765 00000');
      setVal('contactField_visionLabel', s5.visionLabel, 'Project Vision & Strategic Ambition *');
      setVal('contactField_visionPlaceholder', s5.visionPlaceholder, 'Describe the strategic objectives...');

      setVal('contactStep5NdaText', s5.ndaText, 'Execute Bilateral Non-Disclosure Agreement (NDA) prior to review.');
      setVal('contactStep5SubmitBtnText', s5.submitBtnText, 'Submit');
      setVal('contactStep5SuccessTitle', s5.successTitle, 'BRIEF SUBMITTED.');
      setVal('contactStep5ResetBtnText', s5.resetBtnText, 'Submit Another Brief');
      setVal('contactStep5SuccessDesc', s5.successDesc, 'Thank you. Your confidential brief has been received by our leadership. We will review your scope parameters and respond within 24 hours.');
    }

    // ── Dynamic List Renderers ──
    function renderContactDisciplinesList() {
      const container = document.getElementById('contactDisciplinesListContainer');
      if (!container) return;
      if (!contactDisciplinesState.length) {
        container.innerHTML = `<div style="padding:16px;text-align:center;color:var(--ink-dim);font-size:12px;">No discipline chips added. Click "+ Add Discipline Chip" above.</div>`;
        return;
      }
      container.innerHTML = contactDisciplinesState.map((d, idx) => `
        <div style="display:grid;grid-template-columns:1fr 160px 40px;gap:12px;align-items:center;background:var(--card-bg);padding:10px 14px;border-radius:8px;border:1px solid var(--rule);">
          <input type="text" class="form-input" value="${d.label || ''}" placeholder="Discipline name" oninput="contactDisciplinesState[${idx}].label = this.value" />
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;white-space:nowrap;">
            <input type="checkbox" ${d.defaultSelected ? 'checked' : ''} onchange="contactDisciplinesState[${idx}].defaultSelected = this.checked" />
            <span>Default Active</span>
          </label>
          <button type="button" class="btn-icon-square" style="color:var(--cr);" onclick="removeContactDisciplineRow(${idx})" title="Delete chip">✕</button>
        </div>
      `).join('');
    }

    function addContactDisciplineRow(label = 'New Deliverable', defaultSelected = false) {
      contactDisciplinesState.push({
        id: 'disc-' + Date.now().toString(36),
        label,
        defaultSelected
      });
      renderContactDisciplinesList();
    }

    function removeContactDisciplineRow(idx) {
      contactDisciplinesState.splice(idx, 1);
      renderContactDisciplinesList();
    }

    function renderContactTimelinesList() {
      const container = document.getElementById('contactTimelinesListContainer');
      if (!container) return;
      if (!contactTimelinesState.length) {
        container.innerHTML = `<div style="padding:16px;text-align:center;color:var(--ink-dim);font-size:12px;">No timeline options added. Click "+ Add Timeline Option" above.</div>`;
        return;
      }
      container.innerHTML = contactTimelinesState.map((t, idx) => `
        <div style="display:grid;grid-template-columns:1fr 160px 40px;gap:12px;align-items:center;background:var(--card-bg);padding:10px 14px;border-radius:8px;border:1px solid var(--rule);">
          <input type="text" class="form-input" value="${t.label || ''}" placeholder="Timeline label" oninput="contactTimelinesState[${idx}].label = this.value" />
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;white-space:nowrap;">
            <input type="checkbox" ${t.defaultSelected ? 'checked' : ''} onchange="contactTimelinesState[${idx}].defaultSelected = this.checked" />
            <span>Default Active</span>
          </label>
          <button type="button" class="btn-icon-square" style="color:var(--cr);" onclick="removeContactTimelineRow(${idx})" title="Delete timeline option">✕</button>
        </div>
      `).join('');
    }

    function addContactTimelineRow(label = '1 – 3 Months (Standard)', defaultSelected = false) {
      contactTimelinesState.push({
        id: 'tl-' + Date.now().toString(36),
        label,
        defaultSelected
      });
      renderContactTimelinesList();
    }

    function removeContactTimelineRow(idx) {
      contactTimelinesState.splice(idx, 1);
      renderContactTimelinesList();
    }

    function getCurrentActiveSlots() {
      if (selectedSlotDateKey === 'default') {
        return contactSlotsState;
      }
      if (!contactDateSlotsState[selectedSlotDateKey]) {
        contactDateSlotsState[selectedSlotDateKey] = [...contactSlotsState];
      }
      return contactDateSlotsState[selectedSlotDateKey];
    }

    function renderAdminSlotsDateScroller() {
      const scroller = document.getElementById('adminSlotsDateScroller');
      if (!scroller) return;

      const now = new Date();
      const year = adminCalYear;
      const month = adminCalMonth;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const isCurrentMonth = (year === now.getFullYear() && month === now.getMonth());
      const startDay = isCurrentMonth ? now.getDate() : 1;
      const bookedDays = getParsedBookedDays();

      const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];

      let chipsHtml = `
        <button type="button" class="admin-date-chip-btn ${selectedSlotDateKey === 'default' ? 'active' : ''}" onclick="selectAdminSlotDate('default')" title="Studio Default Slots applied to all uncustomized dates">
          <span class="adc-title" style="display:inline-flex;align-items:center;gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--cr);flex-shrink:0;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><span>Studio Default</span></span>
          <span class="adc-sub">All Dates</span>
        </button>
      `;

      for (let day = startDay; day <= daysInMonth; day++) {
        const dow = dows[new Date(year, month, day).getDay()];
        const isToday = isCurrentMonth && (day === now.getDate());
        const isBlocked = bookedDays.includes(day);
        const dayKey = String(day);
        const hasCustomSlots = !!(contactDateSlotsState[dayKey] && contactDateSlotsState[dayKey].length);

        let subLabel = dow;
        if (isBlocked) subLabel = 'Blocked';
        else if (isToday) subLabel = 'Today';
        else if (hasCustomSlots) subLabel = `Custom (${contactDateSlotsState[dayKey].length})`;

        chipsHtml += `
          <button type="button" id="adminDateChip_${day}" class="admin-date-chip-btn ${selectedSlotDateKey === dayKey ? 'active' : ''} ${isBlocked ? 'is-blocked' : ''}" onclick="selectAdminSlotDate('${day}')" title="${dow}, ${monthShort} ${day}${isBlocked ? ' (Blocked)' : ''}">
            <span class="adc-title">${monthShort} ${day}</span>
            <span class="adc-sub">${subLabel}</span>
          </button>
        `;
      }

      scroller.innerHTML = chipsHtml;
    }

    function selectAdminSlotDate(dateKey) {
      selectedSlotDateKey = String(dateKey);
      
      if (dateKey !== 'default') {
        const elDay = document.getElementById('contactStep4Day');
        if (elDay) elDay.value = dateKey;
      }

      renderAdminSlotsDateScroller();
      renderContactSlotsList();

      // Scroll chip into view smoothly
      setTimeout(() => {
        const targetId = (dateKey === 'default') ? null : `adminDateChip_${dateKey}`;
        const targetEl = targetId ? document.getElementById(targetId) : document.querySelector('#adminSlotsDateScroller .admin-date-chip-btn');
        if (targetEl && typeof targetEl.scrollIntoView === 'function') {
          targetEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }, 50);
    }

    function autoSaveSessionStep() {
      if (window.CMSStore && typeof collectContactSessionData === 'function') {
        const d4 = collectContactSessionData();
        window.CMSStore.saveContactBriefStep('step4', d4.step4);
      }
    }

    function resetSlotDateToDefault(dateKey) {
      if (contactDateSlotsState[dateKey]) {
        delete contactDateSlotsState[dateKey];
      }
      renderAdminSlotsDateScroller();
      renderContactSlotsList();
      autoSaveSessionStep();
      showToast(`✨ Reset Day ${dateKey} slots to Studio Default.`);
    }

    function renderContactSlotsList() {
      const container = document.getElementById('contactSlotsListContainer');
      if (!container) return;

      const currentSlots = getCurrentActiveSlots();
      const monthNamesList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthStr = monthNamesList[adminCalMonth] || '';

      const isDefault = (selectedSlotDateKey === 'default');
      const isCustomized = !isDefault && !!(contactDateSlotsState[selectedSlotDateKey] && contactDateSlotsState[selectedSlotDateKey].length);

      let headerBanner = `
        <div style="grid-column: 1 / -1; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; padding:8px 12px; background:rgba(255,255,255,0.03); border:1px solid var(--rule); border-radius:8px; margin-bottom:4px;">
          <div style="font-size:12px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:8px;">
            <span style="display:inline-flex;align-items:center;gap:7px;">${isDefault ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--cr);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Studio Default Consultation Slots' : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ink);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Slots for ${monthStr} ${selectedSlotDateKey}, ${adminCalYear}`}</span>
            ${!isDefault && isCustomized ? '<span class="inq-pill inq-pill-new" style="font-size:10px;padding:2px 6px;">Customized for this date</span>' : ''}
            ${!isDefault && !isCustomized ? '<span style="font-size:11px;color:var(--ink-dim);font-weight:400;">(Inheriting Studio Default)</span>' : ''}
          </div>
          ${!isDefault && isCustomized ? `
            <button type="button" class="btn-action-secondary" style="padding:3px 10px;font-size:11px;border-color:var(--rule-m);" onclick="resetSlotDateToDefault('${selectedSlotDateKey}')">
              Reset to Studio Default
            </button>
          ` : ''}
        </div>
      `;

      let slotsHtml = currentSlots.map((slot, idx) => `
        <div style="display:flex;align-items:center;gap:8px;background:var(--card-bg);padding:8px 12px;border-radius:8px;border:1px solid var(--rule);">
          <input type="text" class="form-input" value="${slot}" placeholder="e.g. 02:30 PM IST" oninput="updateContactSlotValue(${idx}, this.value)" style="font-size:12px;padding:6px 10px;" />
          <button type="button" class="btn-icon-square" style="color:var(--cr);height:32px;width:32px;font-size:12px;" onclick="removeContactSlotRow(${idx})" title="Delete slot">✕</button>
        </div>
      `).join('');

      container.innerHTML = headerBanner + slotsHtml;
    }

    function updateContactSlotValue(idx, val) {
      const slots = getCurrentActiveSlots();
      slots[idx] = val;
      autoSaveSessionStep();
    }

    function addContactSlotRow(slot = '03:00 PM IST') {
      const slots = getCurrentActiveSlots();
      slots.push(slot);
      renderContactSlotsList();
      renderAdminSlotsDateScroller();
      autoSaveSessionStep();
    }

    function removeContactSlotRow(idx) {
      const slots = getCurrentActiveSlots();
      slots.splice(idx, 1);
      renderContactSlotsList();
      renderAdminSlotsDateScroller();
      autoSaveSessionStep();
    }

    function renderContactTopicsList() {
      const container = document.getElementById('contactTopicsListContainer');
      if (!container) return;
      container.innerHTML = contactTopicsState.map((topic, idx) => `
        <div style="display:flex;align-items:center;gap:12px;background:var(--card-bg);padding:8px 14px;border-radius:8px;border:1px solid var(--rule);">
          <input type="text" class="form-input" value="${topic}" placeholder="Topic Title" oninput="contactTopicsState[${idx}] = this.value" />
          <button type="button" class="btn-icon-square" style="color:var(--cr);" onclick="removeContactTopicRow(${idx})" title="Delete topic">✕</button>
        </div>
      `).join('');
    }

    function addContactTopicRow(topic = 'New Consultation Topic') {
      contactTopicsState.push(topic);
      renderContactTopicsList();
    }

    function removeContactTopicRow(idx) {
      contactTopicsState.splice(idx, 1);
      renderContactTopicsList();
    }

    // ── Collectors and Save Functions ──
    function collectContactScopeData() {
      const cards = [];
      for (let i = 0; i < 5; i++) {
        const idx = document.getElementById(`scopeCardIndex_${i}`)?.value.trim() || `0${i+1} / SERVICE`;
        const title = document.getElementById(`scopeCardTitle_${i}`)?.value.trim() || `Service ${i+1}`;
        const rawKw = document.getElementById(`scopeCardKw_${i}`)?.value.trim() || '';
        const keywords = rawKw.split(',').map(s => s.trim()).filter(Boolean);
        cards.push({ id: `scope-${i+1}`, index: idx, title, keywords, mandate: title });
      }
      return {
        step1: {
          railWord: document.getElementById('contactStep1RailWord')?.value.trim() || 'Scope',
          headline: document.getElementById('contactStep1Headline')?.value.trim() || 'Engagement Classification',
          caption: document.getElementById('contactStep1Caption')?.value.trim() || 'Select the primary service for this project.',
          cards
        }
      };
    }

    function collectContactDisciplinesData() {
      return {
        step2: {
          railWord: document.getElementById('contactStep2RailWord')?.value.trim() || 'Disciplines',
          headline: document.getElementById('contactStep2Headline')?.value.trim() || 'Specialized Disciplines',
          caption: document.getElementById('contactStep2Caption')?.value.trim() || 'Choose all deliverables and capabilities required for this engagement.',
          disciplines: contactDisciplinesState.map((d, i) => ({
            id: d.id || `disc-${i+1}`,
            label: d.label || 'Deliverable',
            defaultSelected: !!d.defaultSelected
          }))
        }
      };
    }

    function collectContactAllocationData() {
      const tiers = [];
      for (let i = 0; i < 4; i++) {
        const amt = document.getElementById(`contactTierAmount_${i}`)?.value.trim() || '';
        const name = document.getElementById(`contactTierName_${i}`)?.value.trim() || '';
        const isDef = !!document.getElementById(`contactTierDefault_${i}`)?.checked;
        tiers.push({ id: `tier-${i+1}`, amount: amt, name, defaultSelected: isDef });
      }
      return {
        step3: {
          railWord: document.getElementById('contactStep3RailWord')?.value.trim() || 'Allocation',
          headline: document.getElementById('contactStep3Headline')?.value.trim() || 'Capital Allocation (INR ₹)',
          caption: document.getElementById('contactStep3Caption')?.value.trim() || 'Select your target budget tier and optional consultation window.',
          tiers,
          timelineTitle: document.getElementById('contactStep3TlTitle')?.value.trim() || 'Target Engagement Timeline',
          timelines: contactTimelinesState.map((t, i) => ({
            id: t.id || `tl-${i+1}`,
            label: t.label || 'Timeline',
            defaultSelected: !!t.defaultSelected
          }))
        }
      };
    }

    function collectContactSessionData() {
      const rawBooked = document.getElementById('contactStep4BookedDays')?.value.trim() || '';
      const bookedDays = rawBooked.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      const now = new Date();
      const monthVal = parseInt(document.getElementById('contactStep4Month')?.value, 10);
      const yearVal = parseInt(document.getElementById('contactStep4Year')?.value, 10) || now.getFullYear();
      const dayVal = parseInt(document.getElementById('contactStep4Day')?.value, 10) || now.getDate();

      return {
        step4: {
          railWord: document.getElementById('contactStep4RailWord')?.value.trim() || 'Session',
          headline: document.getElementById('contactStep4Headline')?.value.trim() || 'Strategy Session Window',
          caption: document.getElementById('contactStep4Caption')?.value.trim() || 'Select your preferred 30-minute consultation window with our design leadership.',
          defaultYear: yearVal,
          defaultMonth: isNaN(monthVal) ? now.getMonth() : monthVal,
          defaultDay: dayVal,
          timezone: document.getElementById('contactStep4Timezone')?.value.trim() || 'Asia/Kolkata (IST · GMT+5:30)',
          slots: contactSlotsState.map(s => s.trim()).filter(Boolean),
          dateSlots: contactDateSlotsState,
          bookedDays,
          focusLabel: document.getElementById('contactStep4FocusLabel')?.value.trim() || 'Consultation Focus Area',
          focusTopics: contactTopicsState.map(t => t.trim()).filter(Boolean)
        }
      };
    }

    function collectContactCredentialsData() {
      return {
        step5: {
          railWord: document.getElementById('contactStep5RailWord')?.value.trim() || 'Credentials',
          headline: document.getElementById('contactStep5Headline')?.value.trim() || 'Credentials & Brief',
          caption: document.getElementById('contactStep5Caption')?.value.trim() || 'Your particulars and project brief.',
          nameLabel: document.getElementById('contactField_nameLabel')?.value.trim() || 'Full Name *',
          namePlaceholder: document.getElementById('contactField_namePlaceholder')?.value.trim() || 'e.g. Alexander Vance',
          emailLabel: document.getElementById('contactField_emailLabel')?.value.trim() || 'Corporate Email *',
          emailPlaceholder: document.getElementById('contactField_emailPlaceholder')?.value.trim() || 'e.g. example@gmail.com',
          orgLabel: document.getElementById('contactField_orgLabel')?.value.trim() || 'Enterprise / Brand *',
          orgPlaceholder: document.getElementById('contactField_orgPlaceholder')?.value.trim() || 'e.g. 1928 Creative Studio',
          phoneLabel: document.getElementById('contactField_phoneLabel')?.value.trim() || 'Contact Number *',
          phonePlaceholder: document.getElementById('contactField_phonePlaceholder')?.value.trim() || '98765 00000',
          visionLabel: document.getElementById('contactField_visionLabel')?.value.trim() || 'Project Vision & Strategic Ambition *',
          visionPlaceholder: document.getElementById('contactField_visionPlaceholder')?.value.trim() || 'Describe the strategic objectives...',
          ndaText: document.getElementById('contactStep5NdaText')?.value.trim() || 'Execute Bilateral Non-Disclosure Agreement (NDA) prior to review.',
          submitBtnText: document.getElementById('contactStep5SubmitBtnText')?.value.trim() || 'Submit',
          successTitle: document.getElementById('contactStep5SuccessTitle')?.value.trim() || 'BRIEF SUBMITTED.',
          successDesc: document.getElementById('contactStep5SuccessDesc')?.value.trim() || 'Thank you. Your confidential brief has been received by our leadership. We will review your scope parameters and respond within 24 hours.',
          resetBtnText: document.getElementById('contactStep5ResetBtnText')?.value.trim() || 'Submit Another Brief'
        }
      };
    }

    function saveContactTabScope() {
      const data = collectContactScopeData();
      window.CMSStore.saveContactBrief({ step1: data.step1 });
      showToast('✅ Step 01 Scope saved successfully!');
    }

    function saveContactTabDisciplines() {
      const data = collectContactDisciplinesData();
      window.CMSStore.saveContactBrief({ step2: data.step2 });
      showToast('✅ Step 02 Disciplines saved successfully!');
    }

    function saveContactTabAllocation() {
      const data = collectContactAllocationData();
      window.CMSStore.saveContactBrief({ step3: data.step3 });
      showToast('✅ Step 03 Capital Allocation saved successfully!');
    }

    function saveContactTabSession() {
      const data = collectContactSessionData();
      window.CMSStore.saveContactBrief({ step4: data.step4 });
      showToast('✅ Step 04 Strategy Session & Calendar Month saved successfully!');
    }

    function saveContactTabCredentials() {
      const data = collectContactCredentialsData();
      window.CMSStore.saveContactBrief({ step5: data.step5 });
      showToast('✅ Step 05 Credentials & Success Screen saved successfully!');
    }

    
    // ── INTERACTIVE DATE BLACKOUT & CALENDAR CONTROLLER ──
    function navAdminCalendarMonth(delta) {
      const now = new Date();
      const minYear = now.getFullYear();
      const minMonth = now.getMonth();

      let targetMonth = adminCalMonth + delta;
      let targetYear = adminCalYear;
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear++;
      } else if (targetMonth < 0) {
        targetMonth = 11;
        targetYear--;
      }

      // Past months before current cannot be navigated to
      if (targetYear < minYear || (targetYear === minYear && targetMonth < minMonth)) {
        return;
      }

      adminCalMonth = targetMonth;
      adminCalYear = targetYear;

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const monthInput = document.getElementById('contactStep4Month');
      if (monthInput) monthInput.value = String(adminCalMonth);
      const yearInput = document.getElementById('contactStep4Year');
      if (yearInput) yearInput.value = String(adminCalYear);
      selectGenericDropdownOption('customDropdown_contactMonth', 'contactStep4Month', String(adminCalMonth), monthNames[adminCalMonth]);

      if (selectedSlotDateKey !== 'default') {
        const daysInNewMonth = new Date(adminCalYear, adminCalMonth + 1, 0).getDate();
        if (parseInt(selectedSlotDateKey, 10) > daysInNewMonth) {
          selectedSlotDateKey = 'default';
        }
      }

      renderInteractiveBlockedDaysGrid();
      renderAdminSlotsDateScroller();
      renderContactSlotsList();

      if (window.CMSStore && typeof collectContactSessionData === 'function') {
        const d4 = collectContactSessionData();
        window.CMSStore.saveContactBriefStep('step4', d4.step4);
      }
    }

    function getParsedBookedDays() {
      const raw = document.getElementById('contactStep4BookedDays')?.value || '';
      return raw.split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n >= 1 && n <= 31);
    }

    function renderInteractiveBlockedDaysGrid() {
      const container = document.getElementById('interactiveDaysGrid');
      const tagsContainer = document.getElementById('blockedDaysTags');
      if (!container) return;

      const now = new Date();
      const month = adminCalMonth;
      const year = adminCalYear;

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const titleEl = document.getElementById('adminCalMonthTitle');
      if (titleEl) titleEl.textContent = `${monthNames[month]} ${year}`;

      const minYear = now.getFullYear();
      const minMonth = now.getMonth();
      const isAtMin = (year < minYear) || (year === minYear && month <= minMonth);
      const prevBtn = document.getElementById('adminCalPrevMonthBtn');
      if (prevBtn) {
        prevBtn.disabled = isAtMin;
        if (isAtMin) prevBtn.classList.add('disabled');
        else prevBtn.classList.remove('disabled');
      }

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOffset = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
      const bookedDays = getParsedBookedDays();

      const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let html = '';

      // 1. Header row
      dows.forEach(d => {
        html += `<div class="cal-day-chip header">${d}</div>`;
      });

      // 2. Empty offset chips
      for (let i = 0; i < firstDayOffset; i++) {
        html += '<div class="cal-day-chip offset"></div>';
      }

      // 3. Day chips
      for (let day = 1; day <= daysInMonth; day++) {
        const dowIndex = (firstDayOffset + day - 1) % 7;
        const dowName = dows[dowIndex];
        const isCurrentMonthYear = (year === now.getFullYear() && month === now.getMonth());
        const isPast = isCurrentMonthYear ? (day < now.getDate()) : (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth()));
        const isToday = isCurrentMonthYear && (day === now.getDate());
        const isBlocked = bookedDays.includes(day);

        let chipClasses = ['cal-day-chip'];
        if (isBlocked) chipClasses.push('blocked');
        if (isPast) chipClasses.push('past');
        if (isToday) chipClasses.push('today');

        let subLabel = dowName;
        if (isBlocked) subLabel = 'BLOCKED';
        else if (isPast) subLabel = 'PAST';
        else if (isToday) subLabel = 'TODAY';

        let onClickAttr = isPast ? '' : `onclick="toggleBlockDay(${day})"`;
        let titleAttr = isPast 
          ? `Day ${day} has already passed and cannot be booked or modified`
          : (isBlocked ? `Click to unblock Day ${day}` : `Click to block Day ${day}`);

        html += `
          <button type="button" class="${chipClasses.join(' ')}" ${onClickAttr} title="${titleAttr}">
            <span class="day-num">${day}</span>
            <span class="day-dow">${subLabel}</span>
          </button>
        `;
      }

      container.innerHTML = html;

      // 4. Blocked Summary Tags
      if (tagsContainer) {
        if (bookedDays.length === 0) {
          tagsContainer.innerHTML = '<span style="color:var(--ink-dim);font-style:italic;">No dates blocked. All standard studio consultation days are open.</span>';
        } else {
          tagsContainer.innerHTML = bookedDays.sort((a,b)=>a-b).map(d => `
            <span class="inq-pill inq-pill-new" style="cursor:pointer;display:inline-flex;align-items:center;gap:4px;" onclick="toggleBlockDay(${d})" title="Click to unblock">
              Day ${d} <span style="font-size:12px;opacity:0.8;">✕</span>
            </span>
          `).join('');
        }
      }

      // 5. Update Leads Management Banner text if available
      const bannerText = document.getElementById('inqLiveCalendarBannerText');
      if (bannerText) {
        const monthNamesList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        bannerText.textContent = `Studio Consultation Window: ${monthNamesList[month] || 'Current'} ${year} · ${bookedDays.length} Blocked Date${bookedDays.length === 1 ? '' : 's'} · Changes sync live to client portal.`;
      }
    }

    function toggleBlockDay(dayNum) {
      const now = new Date();
      const isCurrentMonthYear = (adminCalYear === now.getFullYear() && adminCalMonth === now.getMonth());
      if (isCurrentMonthYear && dayNum < now.getDate()) {
        showToast('⚠️ Past days cannot be modified.');
        return;
      }

      const booked = getParsedBookedDays();
      const idx = booked.indexOf(dayNum);
      let updated;
      let wasBlocked = false;

      if (idx !== -1) {
        updated = booked.filter(d => d !== dayNum);
        wasBlocked = true;
      } else {
        updated = [...booked, dayNum].sort((a,b)=>a-b);
      }

      const input = document.getElementById('contactStep4BookedDays');
      if (input) input.value = updated.join(', ');

      const dayInput = document.getElementById('contactStep4Day');
      if (dayInput) dayInput.value = dayNum;

      renderInteractiveBlockedDaysGrid();
      renderAdminSlotsDateScroller();

      // Automatically bring the section to the day being blocked
      selectAdminSlotDate(String(dayNum));

      if (window.CMSStore && typeof collectContactSessionData === 'function') {
        const d4 = collectContactSessionData();
        window.CMSStore.saveContactBriefStep('step4', d4.step4);
      }

      showToast(`${wasBlocked ? '✨ Day ' + dayNum + ' unblocked' : '🚫 Day ' + dayNum + ' blocked on calendar'}`);
    }

    function toggleBlockSundays() {
      const now = new Date();
      const month = adminCalMonth;
      const year = adminCalYear;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const isCurrentMonth = (year === now.getFullYear() && month === now.getMonth());
      const minDay = isCurrentMonth ? now.getDate() : 1;

      const current = getParsedBookedDays();
      const sundays = [];
      for (let d = minDay; d <= daysInMonth; d++) {
        if (new Date(year, month, d).getDay() === 0) {
          sundays.push(d);
        }
      }

      const merged = Array.from(new Set([...current, ...sundays])).sort((a,b)=>a-b);
      const input = document.getElementById('contactStep4BookedDays');
      if (input) input.value = merged.join(', ');

      renderInteractiveBlockedDaysGrid();
      renderAdminSlotsDateScroller();
      if (window.CMSStore && typeof collectContactSessionData === 'function') {
        window.CMSStore.saveContactBriefStep('step4', collectContactSessionData().step4);
      }
      showToast('🚫 All upcoming Sundays for this month are now blocked.');
    }

    function toggleBlockWeekends() {
      const now = new Date();
      const month = adminCalMonth;
      const year = adminCalYear;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const isCurrentMonth = (year === now.getFullYear() && month === now.getMonth());
      const minDay = isCurrentMonth ? now.getDate() : 1;

      const current = getParsedBookedDays();
      const weekends = [];
      for (let d = minDay; d <= daysInMonth; d++) {
        const dow = new Date(year, month, d).getDay();
        if (dow === 0 || dow === 6) {
          weekends.push(d);
        }
      }

      const merged = Array.from(new Set([...current, ...weekends])).sort((a,b)=>a-b);
      const input = document.getElementById('contactStep4BookedDays');
      if (input) input.value = merged.join(', ');

      renderInteractiveBlockedDaysGrid();
      renderAdminSlotsDateScroller();
      if (window.CMSStore && typeof collectContactSessionData === 'function') {
        window.CMSStore.saveContactBriefStep('step4', collectContactSessionData().step4);
      }
      showToast('🚫 All upcoming weekends for this month are now blocked.');
    }

    function clearAllBlockedDays() {
      const input = document.getElementById('contactStep4BookedDays');
      if (input) input.value = '';

      renderInteractiveBlockedDaysGrid();
      renderAdminSlotsDateScroller();
      if (window.CMSStore && typeof collectContactSessionData === 'function') {
        window.CMSStore.saveContactBriefStep('step4', collectContactSessionData().step4);
      }
      showToast('✨ All calendar blackout dates cleared.');
    }

    function handleBookedDaysInput(val) {
      renderInteractiveBlockedDaysGrid();
    }

    function quickBlockCurrentInquiryDate() {
      if (!currentSelectedInquiry || !currentSelectedInquiry.session_date) {
        showToast('No consultation date was selected in this brief.', 'warning');
        return;
      }

      const str = currentSelectedInquiry.session_date;
      // Match day number (e.g. "Tuesday, Oct 27, 2026" -> 27)
      const match = str.match(/\b(\d{1,2})\b/);
      if (!match) {
        showToast('Could not parse day from consultation date string.', 'warning');
        return;
      }

      const dayNum = parseInt(match[1], 10);
      if (dayNum < 1 || dayNum > 31) {
        showToast('Parsed day is out of range.', 'warning');
        return;
      }

      const booked = getParsedBookedDays();
      if (booked.includes(dayNum)) {
        showToast(`Day ${dayNum} is already blocked on the calendar.`, 'info');
      } else {
        const updated = [...booked, dayNum].sort((a,b)=>a-b);
        const input = document.getElementById('contactStep4BookedDays');
        if (input) input.value = updated.join(', ');

        renderInteractiveBlockedDaysGrid();

        if (window.CMSStore && typeof collectContactSessionData === 'function') {
          window.CMSStore.saveContactBriefStep('step4', collectContactSessionData().step4);
        }

        const btn = document.getElementById('btnQuickBlockModalDate');
        if (btn) {
          btn.textContent = `✓ Day ${dayNum} Blocked on Calendar`;
          btn.style.color = 'var(--cr-bright)';
        }

        showToast(`🎉 Day ${dayNum} successfully blocked on the live booking calendar!`);
      }
    }

    function saveAllContactAdmin() {
      const d1 = collectContactScopeData();
      const d2 = collectContactDisciplinesData();
      const d3 = collectContactAllocationData();
      const d4 = collectContactSessionData();
      const d5 = collectContactCredentialsData();

      const fullBrief = {
        step1: d1.step1,
        step2: d2.step2,
        step3: d3.step3,
        step4: d4.step4,
        step5: d5.step5
      };

      window.CMSStore.saveContactBrief(fullBrief);
      showToast('🎉 All 5 Contact Brief Steps & Calendar settings saved successfully!');
    }



    // ═══════════════════════════════════════════════════════════
    // 11. STUDIO DIRECT CONTACT CHANNELS & SETTINGS CONTROLLER
    // ═══════════════════════════════════════════════════════════
    async function loadStudioContactSettings() {
      try {
        const res = await fetch('api.php?action=get_studio_settings');
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.status === 'success' && json.settings) {
          const s = json.settings;

          const elName = document.getElementById('studioContactName');
          const elEmail = document.getElementById('studioContactEmail');
          const elPhone = document.getElementById('studioContactPhone');
          const elLoc = document.getElementById('studioContactLocation');
          const elEst = document.getElementById('studioContactEstablished');
          const elSLA = document.getElementById('studioContactSLA');

          const elInsta = document.getElementById('studioContactInstagram');
          const elLink = document.getElementById('studioContactLinkedin');
          const elYt = document.getElementById('studioContactYoutube');
          const elBeh = document.getElementById('studioContactBehance');
          const elFb = document.getElementById('studioContactFacebook');

          const elCta1 = document.getElementById('studioCtaPrimary');
          const elCta2 = document.getElementById('studioCtaSecondary');

          if (elName) elName.value = s.studio_name || '1928 Creative Studio';
          if (elEmail) elEmail.value = s.email || 'studio@1928creativestudio.com';
          if (elPhone) elPhone.value = s.phone || '+91 98250 19280';
          if (elLoc) elLoc.value = s.location || 'Ahmedabad, India · Global Practice';
          if (elEst) elEst.value = s.established || '1928';
          if (elSLA) elSLA.value = s.response_sla || 'We will get back to you within 72 hours';

          if (elInsta) elInsta.value = s.instagram || 'https://www.instagram.com/1928creativestudio';
          if (elLink) elLink.value = s.linkedin || 'https://www.linkedin.com/company/1928-creative-studio/';
          if (elYt) elYt.value = s.youtube || 'https://www.youtube.com/@1928creativestudio';
          if (elBeh) elBeh.value = s.behance || 'https://www.behance.net/1928Creativestudio';
          if (elFb) elFb.value = s.facebook || 'https://www.facebook.com/1928Creativestudio/';

          if (elCta1) elCta1.value = s.cta_primary_text || 'Start a Project';
          if (elCta2) elCta2.value = s.cta_secondary_text || "Tell us what you're building";
        }
      } catch (err) {
        console.warn('Could not fetch studio settings:', err);
      }
    }

    async function saveStudioContactSettings() {
      const payload = {
        studio_name: document.getElementById('studioContactName')?.value || '1928 Creative Studio',
        email: document.getElementById('studioContactEmail')?.value || 'studio@1928creativestudio.com',
        phone: document.getElementById('studioContactPhone')?.value || '+91 98250 19280',
        location: document.getElementById('studioContactLocation')?.value || 'Ahmedabad, India · Global Practice',
        established: document.getElementById('studioContactEstablished')?.value || '1928',
        response_sla: document.getElementById('studioContactSLA')?.value || 'We will get back to you within 72 hours',
        instagram: document.getElementById('studioContactInstagram')?.value || '',
        linkedin: document.getElementById('studioContactLinkedin')?.value || '',
        youtube: document.getElementById('studioContactYoutube')?.value || '',
        behance: document.getElementById('studioContactBehance')?.value || '',
        facebook: document.getElementById('studioContactFacebook')?.value || '',
        cta_primary_text: document.getElementById('studioCtaPrimary')?.value || 'Start a Project',
        cta_secondary_text: document.getElementById('studioCtaSecondary')?.value || "Tell us what you're building"
      };

      try {
        const res = await fetch('api.php?action=save_studio_contact_settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json && json.status === 'success') {
          showToast('Studio contact channels & practice details saved to MySQL!');
        } else {
          showToast((json && json.message) ? json.message : 'Failed to save studio contact details', 'error');
        }
      } catch (err) {
        showToast(`Save error: ${err.message}`, 'error');
      }
    }
