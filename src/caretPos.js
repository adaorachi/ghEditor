const properties = [
  'boxSizing',
  'overflowX',
  'overflowY',

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

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

let mirrorDiv; let computed; let
  style;

export default function getCaretCoordinates(element, position, editorId) {
  mirrorDiv = document.getElementById(`${element.id}--mirror-div`);
  if (!mirrorDiv) {
    mirrorDiv = document.createElement('div');
    mirrorDiv.id = `${element.id}--mirror-div`;
    document.querySelector(`.snip-text-body-${editorId}`).append(mirrorDiv);
  }

  style = mirrorDiv.style;
  computed = getComputedStyle(element);

  // default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (element.nodeName !== 'INPUT') style.wordWrap = 'break-word'; // only for textarea-s

  // position off-screen
  style.position = 'absolute';
  style.top = '0';
  style.left = '0';
  style.height = '100%';
  style.width = '100%';
  style.zIndex = '-9999';
  style.visibility = 'hidden';

  properties.forEach((prop) => {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    if (element.scrollHeight > parseInt(computed.height, 10)) style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';
  }

  mirrorDiv.textContent = element.value.substring(0, position);
  if (element.nodeName === 'INPUT') mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, '\u00a0');

  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  span.style.backgroundColor = 'transparent';
  mirrorDiv.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth, 10),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth, 10),
    span: span.offsetTop + parseInt(computed.borderTopWidth, 10),
  };

  return coordinates;
}
