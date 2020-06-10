const ToggleTab = (() => {
  const hideAndDisplayNavTab = (ele, arrayList) => {
    const array = document.querySelectorAll(arrayList);
    Array.from(array).forEach((item) => {
      if (item.id === ele) {
        item.classList.add('active');
        // item.style.display = 'block'
      } else {
        // item.style.display = 'none'
        item.classList.remove('active');
        item.removeAttribute('style');
      }
    });

    const navTabs = {
      padding: '0 10px 10px',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderBottom: 'none',
    };

    const tabNavBtn = document.querySelector('.snipText-tabnav-tabs .active');
    Object.assign(tabNavBtn.style, navTabs);
  };

  const hideAndDisplayNav = (ele, arrayList) => {
    const array = document.querySelectorAll(arrayList);
    Array.from(array).forEach((item) => {
      if (item.id === ele) {
        // item.classList.add('active');
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
        // item.classList.remove('active');
        // item.removeAttribute('style')
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
        hideAndDisplayNavTab(id, `.${parentId} .btn-nav.tabnav`);
      }
    });
  };

  return { toggle };
})();

export default ToggleTab;