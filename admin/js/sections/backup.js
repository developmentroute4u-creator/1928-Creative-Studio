    // ── 8. BACKUP & DATABASE ──
    function exportDatabaseJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(window.CMSStore.exportData());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `1928_studio_database_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Database exported as JSON file!');
    }

    function handleImportFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = window.CMSStore.importData(e.target.result);
        if (result.success) {
          showToast('Database restored successfully!');
          refreshAllViews();
        } else {
          alert('Error importing JSON: ' + result.error);
        }
      };
      reader.readAsText(file);
    }

    function confirmResetDefaults() {
      if (confirm('Are you sure you want to reset all content back to factory website defaults? Any unsaved edits will be reverted.')) {
        window.CMSStore.resetToDefaults();
        refreshAllViews();
        showToast('Reset to original website defaults.');
      }
    }
