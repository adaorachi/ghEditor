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

export default function getCaretCoordinates(element, position1, position2, editorId) {
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
    if (prop === 'paddingTop' || prop === 'paddingBottom') {
      style[prop] = `calc(${computed[prop]} + 6px)`;
    } else if (prop === 'paddingLeft' || prop === 'paddingRight') {
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
  };

  return coordinates;
}