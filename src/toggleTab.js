const ToggleTab = (() => {
  const hideAndDisplayNav = (ele, arrayList) => {
    const array = document.querySelectorAll(arrayList);
    Array.from(array).forEach((item) => {
      if (item.id === ele) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  const displayWordCount = (editorId) => {
    const text = document.getElementById(`snip-preview-${editorId}`).innerText;
    const charactersLength = text.length === 0 ? text.length : text.length - 1;
    const wordSplit = text.replace(/\r?\n/g, ' ').split(' ');
    const wordLength = text.trim() === '' ? 0 : wordSplit.length;
    return {
      characters: charactersLength,
      words: wordLength,
    };
  };

  const toggle = (nav, editorId) => {
    const navTab = document.getElementById(nav);
    // const parentId = navTab.parentElement.parentElement.className;
    const parentId = `snip-text-mark-down-${editorId}`;
    navTab.addEventListener('click', (e) => {
      if (e.target.classList.contains('tabnav')) {
        const { id } = e.target;
        let eleTab = id.split('-');
        eleTab = `${eleTab[0]}-${eleTab[1]}-${editorId}`;
        hideAndDisplayNav(eleTab, `.${parentId} .snip-tab-content-${editorId}.tab-content`);
        hideAndDisplayNav(id, `.${parentId} .btn-nav-${editorId}.tabnav`);

        if (id === `snip-write-tab-${editorId}`) {
          document.getElementById(eleTab).focus();
          document.querySelector(`.snip-text-button-container-${editorId}`).classList.remove('remove');
          document.querySelector(`.snip-word-count-${editorId}`).classList.add('remove');
        } else if (id === `snip-preview-tab-${editorId}`) {
          document.querySelector(`.snip-text-button-container-${editorId}`).classList.add('remove');
          const snipWord = document.querySelector(`.snip-word-count-${editorId}`);
          snipWord.classList.remove('remove');
          snipWord.innerHTML = `${displayWordCount(editorId).characters} characters ${displayWordCount(editorId).words} words`;

          document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('emoji-dropdown');
          if (document.getElementById(`snip-write-${editorId}`).value === '') {
            document.getElementById(`snip-preview-${editorId}`).innerHTML = '<p class="placeholder">Nothing to preview<p>';
          }
        }
      }
    });
  };

  return { toggle };
})();

export default ToggleTab;