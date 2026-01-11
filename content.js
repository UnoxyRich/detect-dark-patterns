(function() {
  const patterns = [
    /limited time/i,
    /only\s+\d+\s+left/i,
    /subscribe now/i,
    /act now/i,
    /exclusive offer/i,
    /free trial/i,
    /last chance/i,
    /buy now/i,
    /don’t miss/i,
    /sponsored/i
  ];

  function highlightNode(node, pattern) {
    const regex = pattern;
    if (!regex.test(node.textContent)) return false;
    const parts = node.textContent.split(regex);
    const match = node.textContent.match(regex)[0];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < parts.length; i++) {
      frag.appendChild(document.createTextNode(parts[i]));
      if (i < parts.length - 1) {
        const highlight = document.createElement('span');
        highlight.style.backgroundColor = 'yellow';
        highlight.style.color = 'red';
        highlight.textContent = match;
        frag.appendChild(highlight);
      }
    }
    node.parentNode.replaceChild(frag, node);
    return true;
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const pattern of patterns) {
        if (pattern.test(node.textContent)) {
          highlightNode(node, pattern);
          break;
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      const children = Array.from(node.childNodes);
      for (const child of children) {
        walk(child);
      }
    }
  }

  // detect fake Steam download and other fake download pages
  function detectFakePages() {
    const host = window.location.hostname.toLowerCase();
    const bodyText = document.body.textContent.toLowerCase();
    // Fake Steam detection: page includes steam and download but domain is not steampowered.com
    if (bodyText.includes('steam') && bodyText.includes('download') && !host.endsWith('steampowered.com')) {
      const goToSteam = window.confirm('This page might be a fake Steam download page. Do you want to go to the official Steam site?');
      if (goToSteam) {
        window.location.href = 'https://store.steampowered.com/about/';
      }
    } else if (bodyText.includes('download') && (bodyText.includes('setup') || bodyText.includes('installer'))) {
      // Generic fake download page detection: if domain is not in trusted list
      const trustedDomains = ['microsoft.com', 'apple.com', 'google.com', 'mozilla.org', 'chrome.google.com', 'steampowered.com'];
      const trusted = trustedDomains.some(domain => host.endsWith(domain));
      if (!trusted) {
        const proceed = window.confirm('This page might be a fake download page. Do you want to continue?');
        if (!proceed) {
          // If user does not want to continue, do nothing or could redirect to a safe page
        }
      }
    }
  }

  walk(document.body);
  detectFakePages();
})();
