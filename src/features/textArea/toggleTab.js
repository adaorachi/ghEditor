import {
  hideAndDisplayNav,
  displayWordCount,
  removeDropdowns,
  mutateContent,
  nothingToPreviewDisplay,
} from '../../helpers/helpers';

const togglePreviewOnClick = (nav, editorId) => {
  const navTab = document.getElementById(nav);
  const parentId = `gheditor-text-mark-down-${editorId}`;
  navTab.addEventListener('click', (e) => {
    if (e.target.classList.contains('tabnav')) {
      const { id } = e.target;
      let eleTab = id.split('-');
      eleTab = `${eleTab[0]}-${eleTab[1]}-${editorId}`;
      const con = [`.gheditor-tab-content-${editorId}.tab-content`, `.btn-nav-${editorId}.tabnav`];
      [eleTab, id].forEach((ele, ind) => {
        hideAndDisplayNav(ele, `.${parentId} ${con[ind]}`, 'active');
      });

      if (id === `gheditor-writearea-tab-${editorId}`) {
        mutateContent(`.gheditor-text-button-container-${editorId}`, `.gheditor-word-count-${editorId}`);

        document.getElementById(eleTab).focus();
      } else if (id === `gheditor-preview-tab-${editorId}`) {
        mutateContent(`.gheditor-word-count-${editorId}`, `.gheditor-text-button-container-${editorId}`);

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