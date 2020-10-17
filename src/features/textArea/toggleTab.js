import {
  hideAndDisplayNav,
  displayWordCount,
  removeDropdowns,
  mutateContent,
  nothingToPreviewDisplay,
} from '../../helpers/helpers';

const togglePreviewOnClick = (nav, editorId) => {
  const navTab = document.getElementById(nav);
  const parentId = `snip-text-mark-down-${editorId}`;
  navTab.addEventListener('click', (e) => {
    if (e.target.classList.contains('tabnav')) {
      const { id } = e.target;
      let eleTab = id.split('-');
      eleTab = `${eleTab[0]}-${eleTab[1]}-${editorId}`;
      const con = [`.snip-tab-content-${editorId}.tab-content`, `.btn-nav-${editorId}.tabnav`];
      [eleTab, id].forEach((ele, ind) => {
        hideAndDisplayNav(ele, `.${parentId} ${con[ind]}`, 'active');
      });

      if (id === `snip-writearea-tab-${editorId}`) {
        mutateContent(`.snip-text-button-container-${editorId}`, `.snip-word-count-${editorId}`);

        document.getElementById(eleTab).focus();
      } else if (id === `snip-preview-tab-${editorId}`) {
        mutateContent(`.snip-word-count-${editorId}`, `.snip-text-button-container-${editorId}`);

        removeDropdowns([`.filter-emoji-area-${editorId}`, `.toolbar-button-area-${editorId}`], 'dropdown');
        displayWordCount(editorId);
      }
      nothingToPreviewDisplay(editorId);
    }
  });
};

const toggleMoreToolbar = (editorId) => {
  const toggle = document.querySelector(`.toggle-toolbar-${editorId}`);
  if (toggle !== null) {
    toggle.addEventListener('click', () => {
      const lowerToolbar = document.querySelector(`.button-container-toggle-${editorId}`);
      lowerToolbar.classList.toggle('open');

      const chevron = document.getElementById(`chevron-up-${editorId}`);
      chevron.classList.toggle('rotate');
    });
  }
};

export { togglePreviewOnClick, toggleMoreToolbar };