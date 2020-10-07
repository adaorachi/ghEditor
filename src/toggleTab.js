import {
  expandHeight, extendDefaults,
} from './utils';

import { toggleToolbarOnResize } from './toolbar';

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
    snipWord.innerHTML = `${charactersLength} characters ${wordLength} words`;
  };

  const removeDropdowns = (args, className) => {
    [...args].forEach((arg) => {
      document.querySelector(arg).classList.remove(className);
    });
  };

  const nothingToPreviewDisplay = (editorId) => {
    const snipTextArea = document.getElementById(`snip-write-${editorId}`);
    const snipPreviewArea = document.getElementById(`snip-preview-${editorId}`);
    snipPreviewArea.style.height = 'auto';
    if (snipTextArea.value === '') {
      snipPreviewArea.innerHTML = '<p class="placeholder">Nothing to preview<p>';
    }
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

        if (id === `snip-writearea-tab-${editorId}`) {
          document.getElementById(eleTab).focus();
          document.querySelector(`.snip-text-button-container-${editorId}`).classList.remove('remove');
          document.querySelector(`.snip-word-count-${editorId}`).classList.add('remove');
        } else if (id === `snip-preview-tab-${editorId}`) {
          document.querySelector(`.snip-text-button-container-${editorId}`).classList.add('remove');
          document.querySelector(`.snip-word-count-${editorId}`).classList.remove('remove');

          removeDropdowns([`.filter-emoji-area-${editorId}`, `.toolbar-button-area-${editorId}`], 'dropdown');
          displayWordCount(editorId);
        }
        nothingToPreviewDisplay(editorId);
      }
    });
  };

  const togglePreview = (editorId, args) => {
    const previewBut = document.querySelector(`.snip-preview-button-${editorId}`);
    if (extendDefaults(args).splitScreen.enabled) {
      const snipContainers2 = [
        `snip-write-${editorId}`,
        `snip-preview-${editorId}`,
      ];
      previewBut.style.display = 'initial';

      previewBut.addEventListener('click', () => {
        displayWordCount(editorId);
        nothingToPreviewDisplay(editorId);

        const snipContainers = [
          `snip-writearea-${editorId}`,
          `snip-preview-${editorId}`,
          `snip-text-body-${editorId}`,
          `snip-text-tabnav-buttons-${editorId}`,
          `${editorId}--mirror-div`,
          `snip-text-header-content-${editorId}`,
          `snip-upload-container-${editorId}`,
          `snip-autosave-${editorId}`,
          `button-container-toggle-${editorId}`,
        ];
        snipContainers.forEach(container => {
          const containerDOM = document.getElementById(container);
          if (containerDOM !== null) {
            containerDOM.classList.toggle('preview');
          }
        });

        document.getElementById(`snip-word-count-${editorId}`).classList.toggle('remove');

        snipContainers2.forEach(container => {
          const snipWriteHeight = document.getElementById(snipContainers2[0]).style.height;
          const containerArea = document.getElementById(container);
          containerArea.style.height = `${expandHeight(containerArea, snipWriteHeight)}px`;

          const snipPreview = document.querySelector(`#snip-preview-${editorId}.preview`);
          if (snipPreview !== null) {
            const snipPreviewStyle = {
              height: snipWriteHeight,
              minHeight: extendDefaults(args).minHeight,
              maxHeight: extendDefaults(args).maxHeight,
              padding: '6px 20px',
            };
            Object.assign(snipPreview.style, snipPreviewStyle);
          }
        });
        toggleToolbarOnResize(editorId);
      });

      const fixedDiv = document.getElementById(snipContainers2[0]);
      const scrollableDiv = document.getElementById(snipContainers2[1]);

      fixedDiv.addEventListener('scroll', () => {
        scrollableDiv.scrollTop = fixedDiv.scrollTop
          * ((scrollableDiv.scrollHeight - scrollableDiv.clientHeight)
            / (fixedDiv.scrollHeight - fixedDiv.clientHeight));
      });
    } else {
      previewBut.style.display = 'none';
    }
  };

  return {
    toggle,
    hideAndDisplayNav,
    togglePreview,
    displayWordCount,
  };
})();

export default ToggleTab;