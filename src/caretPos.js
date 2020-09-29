const properties = [
  'boxSizing',
  'overflowX',
  'overflowY',

  'border',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',

  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',

  'letterSpacing',
  'wordSpacing',
];

const isFirefox = !(window.mozInnerScreenX == null);

let mirrorDiv; let computed; let style;

export default function getCaretCoordinates(element, position1, position2, editorId) {
  mirrorDiv = document.getElementById(`${editorId}--mirror-div`);

  style = mirrorDiv.style;
  computed = getComputedStyle(element);

  // default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (element.nodeName !== 'INPUT') style.wordWrap = 'break-word'; // only for textarea-s

  properties.forEach((prop) => {
    const p = 'padding';
    if (prop === `${p}Left` || prop === `${p}Right` || prop === `${p}Top` || prop === `${p}Bottom`) {
      style[prop] = `calc(${computed[prop]} + 6px)`;
    } else {
      style[prop] = computed[prop];
    }
  });

  if (!isFirefox) {
    if (element.scrollHeight > parseInt(computed.height, 10)) style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';
  }
  const div = document.createElement('div');
  mirrorDiv.appendChild(div);
  mirrorDiv.textContent = element.value.substring(0, position2 - 2);
  if (element.nodeName === 'INPUT') mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, '\u00a0');

  const span1 = document.createElement('span');
  span1.textContent = element.value.substring(position2 - 2, position2);
  span1.style.backgroundColor = 'transparent';
  mirrorDiv.appendChild(span1);

  const span2 = document.createElement('span');
  span2.textContent = element.value.substring(position2);
  span2.style.backgroundColor = 'transparent';
  mirrorDiv.appendChild(span2);

  const coordinates = {
    top: span1.offsetTop + parseInt(computed.borderTopWidth, 10),
    left: span1.offsetLeft + parseInt(computed.borderLeftWidth, 10),
    highlightLeft: span2.offsetLeft + parseInt(computed.borderLeftWidth, 10),
  };

  return coordinates;
}