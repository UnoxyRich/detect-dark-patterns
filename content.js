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
    /don’t miss/i
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
      // copy children into array to avoid issues when replacing nodes
      const children = Array.from(node.childNodes);
      for (const child of children) {
        walk(child);
      }
    }
  }

  walk(document.body);
})();
