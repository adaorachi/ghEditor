import getCaretCoordinates from '../textArea/caretPos';

let scrollT = 0;
let xx;
let yy;

const placeAreasByCoord = (area, textarea, editorId, cont1 = '', cont2 = '', isEmojiArea = true) => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const coordinates = getCaretCoordinates(textarea, start, end, editorId);

  scrollT = textarea.scrollTop;

  xx = coordinates.top - scrollT;
  yy = isEmojiArea ? coordinates.highlightLeft : coordinates.left;

  // eslint-disable-next-line max-len
  if (textarea.scrollHeight > textarea.clientHeight && (coordinates.top - scrollT) > textarea.clientHeight) {
    xx = textarea.clientHeight;
  }

  const inputArea = document.querySelector(area);

  inputArea.style.top = `${xx + 40}px`;
  inputArea.style.left = `${yy}px`;
  const boundArea = inputArea.getBoundingClientRect();
  const boundArea1 = textarea.getBoundingClientRect();

  if (isEmojiArea) {
    if (boundArea.right > boundArea1.right) {
      inputArea.style.left = `${yy - 150}px`;
    }
  } else {
    const write = document.querySelector(`.snip-writearea-${editorId}`);
    write.insertBefore(cont2, cont1);
    if ((boundArea.right > boundArea1.right) || (yy > 200)) {
      inputArea.style.left = `${yy - 200}px`;
    } else {
      inputArea.style.left = '0';
    }

    cont2.style.left = `${yy}px`;
    cont2.style.top = `${xx + 33}px`;
  }
};

export default placeAreasByCoord;