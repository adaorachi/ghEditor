const autoUseFontAwesome = (options) => {
  function css(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
  }
  if (options.autoUseFontAwesome) {
    const span = document.createElement('span');
    span.className = 'fa';
    span.style.display = 'none';
    document.body.insertBefore(span, document.body.firstChild);
    if (!(css(span, 'font-family').includes('Font') && css(span, 'font-family').includes('Awesome'))) {
      let headHTML = document.head.innerHTML;
      headHTML += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">';
      document.head.innerHTML = headHTML;
    }
    document.body.removeChild(span);
  }
};

export default autoUseFontAwesome;