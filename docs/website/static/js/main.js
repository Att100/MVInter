'use strict';

// The noscript stylesheet reveals every result when JavaScript is unavailable.
document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  function selectTab(tab) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });
});

const copyButton = document.getElementById('copy-bibtex');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  const citation = document.getElementById('citation');
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(citation.textContent.trim() + '\n');
    status.textContent = 'BibTeX copied to clipboard.';
  } catch {
    // file:// and some browsers restrict the Clipboard API; keep copying usable.
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
