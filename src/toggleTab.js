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

  const toggle = (nav) => {
    const navTab = document.getElementById(nav);
    const parentId = navTab.parentElement.parentElement.className;
    navTab.addEventListener('click', (e) => {
      if (e.target.classList.contains('tabnav')) {
        const { id } = e.target;
        const eleTab = id.split('-').slice(0, 2).join('-');
        hideAndDisplayNav(eleTab, `.${parentId} .snip-tab-content.tab-content`);
        hideAndDisplayNav(id, `.${parentId} .btn-nav.tabnav`);

        if (id === 'snip-write-tab') {
          document.getElementById(eleTab).focus();
          document.querySelector('.snipText-button-container').classList.remove('remove');
        } else if (id === 'snip-preview-tab') {
          document.querySelector('.snipText-button-container').classList.add('remove');
          document.querySelector('.filter-emoji-area').classList.remove('emoji-dropdown');
          if (document.getElementById('snip-write').value === '') {
            document.getElementById('snip-preview').innerHTML = '<p class="placeholder">Nothing to preview<p>';
          }
        }
      }
    });
  };

  return { toggle };
})();

export default ToggleTab;