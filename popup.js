document.addEventListener('DOMContentLoaded', () => {
  const domainList = document.getElementById('domainList');
  const domainInput = document.getElementById('domainInput');
  const addButton = document.getElementById('addDomain');

  function renderDomains() {
    chrome.storage.local.get(['domains'], (result) => {
      const domains = result.domains || [];
      domainList.innerHTML = ''; // Clear the list
      domains.forEach(domain => createDomainItem(domain));
    });
  }

  function createDomainItem(domain) {
    const item = document.createElement('div');
    item.className = 'domain-item';
    item.innerHTML = `
      <span>${domain}</span>
      <button class="remove-btn">×</button>
    `;
    
    item.querySelector('.remove-btn').addEventListener('click', () => {
      chrome.storage.local.get(['domains'], (result) => {
        const updatedDomains = (result.domains || []).filter(d => d !== domain);
        chrome.storage.local.set({ domains: updatedDomains }, () => {
          renderDomains(); // Re-render the list
        });
      });
    });
    
    domainList.appendChild(item);
  }

  addButton.addEventListener('click', () => {
    const domain = domainInput.value.trim();
    if (domain) {
      chrome.storage.local.get(['domains'], (result) => {
        const updatedDomains = [...new Set([...(result.domains || []), domain])];
        chrome.storage.local.set({ domains: updatedDomains }, () => {
          renderDomains(); // Re-render the list
          domainInput.value = '';
        });
      });
    }
  });

  renderDomains(); // Initial render
});