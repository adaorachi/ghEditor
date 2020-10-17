const setAttributeToEmojiSelected = (ele, arrayList) => {
  const array = document.querySelectorAll(arrayList);
  Array.from(array).forEach((item) => {
    if (item.id === ele) {
      item.setAttribute('aria-selected', true);
      item.classList.add('selected');
    } else {
      item.setAttribute('aria-selected', false);
      item.classList.remove('selected');
    }
  });
};

// eslint-disable-next-line import/prefer-default-export
export { setAttributeToEmojiSelected };