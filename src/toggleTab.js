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
    const text = document.getElementById(`snip-preview-${editorId}`).innerText.trim();
    const charactersLength = text.length;
    const wordSplit = text.replace(/\r?\n/g, ' ').split(' ');
    const wordLength = text === '' ? 0 : wordSplit.length;

    const snipWord = document.querySelector(`.snip-word-count-${editorId}`);
    snipWord.classList.remove('remove');
    snipWord.innerHTML = `${charactersLength} characters ${wordLength} words`;
  };

  const removeDropdowns = (args, className) => {
    [...args].forEach((arg) => {
      document.querySelector(arg).classList.remove(className);
    });
  };

  const toggle = (nav, editorId) => {
    const navTab = document.getElementById(nav);
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
          removeDropdowns([`.filter-emoji-area-${editorId}`, `.toolbar-button-area-${editorId}`], 'dropdown');
          document.querySelector(`.snip-text-button-container-${editorId}`).classList.add('remove');

          displayWordCount(editorId);
          if (document.getElementById(`snip-write-${editorId}`).value === '') {
            document.getElementById(`snip-preview-${editorId}`).innerHTML = '<p class="placeholder">Nothing to preview<p>';
          }
        }
      }
    });
  };

  return { toggle, hideAndDisplayNav };
})();

export default ToggleTab;