import { insertWriteInput } from './textArea/updateEditorArea';
import { setAttributeToEmojiSelected } from './utils/insertEmojiUtils';
import { emojis } from './fetchData/fetchEmojis';
import placeAreasByCoord from './utils/placeDropdownByCoords';

let currentFocus = 0;
let startSelection = 0;
let endSelection = 0;
let startEmo = 0;
let filtered = '';
let allEmojis = '';
const allowedEmojiPrefix = ['-', ':', '/', '!', '#', '$', '&', '*', '=', '+', '^'];

const insertEmoji = (repl, textVal) => {
  const diff = endSelection - startEmo;
  if (diff >= 0 && diff <= 40) {
    textVal = textVal.slice(0, startEmo - 1) + repl + textVal.slice(endSelection);
  }
  return textVal;
};

const insertEmojiOnClick = (editorId, prop) => {
  const textarea = document.getElementById(`snip-write-${editorId}`);
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains(`display-emoji-${editorId}`)) {
      const { id } = e.target;
      const currentEmojiHTML = document.getElementById(id).innerHTML;
      const currentEmojiContent = currentEmojiHTML.split(' ')[0];

      document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('dropdown');
      currentFocus = 0;

      const matchEmoji = insertEmoji(currentEmojiContent, textarea.value);

      insertWriteInput(matchEmoji, editorId, prop);
      textarea.setSelectionRange(startSelection, endSelection);

      filtered.content_length = 0;
    }
  });
};

const navigateEmojiOnArrowKey = (e, editorId) => {
  const locListItems = document.querySelectorAll(`.emoji-suggester-${editorId} .display-emoji-${editorId}`);
  if (e.keyCode === 40) {
    currentFocus += 1;
    if (currentFocus >= locListItems.length) {
      currentFocus = 0;
    }
  } else if (e.keyCode === 38) {
    currentFocus -= 1;
    if (currentFocus < 0) {
      currentFocus = locListItems.length - 1;
    }
  }
};

const getEmojiMatch = (e, prop, editorId, textarea) => {
  let emojiVal;
  let emojiVal2;
  const textVal = textarea.value;
  const diff = endSelection - startEmo;
  if (diff >= 0 && diff <= 40) {
    emojiVal = textVal.slice(startEmo - 1, endSelection);
    emojiVal2 = textVal.slice(startEmo, endSelection);
  } else {
    // eslint-disable-next-line no-multi-assign
    emojiVal = emojiVal2 = textVal.slice(endSelection);
  }
  const emoji = emojis(editorId, emojiVal2);

  const { emojiPrefix } = prop.inlineEmoji;
  let match = false;

  if (allowedEmojiPrefix.includes(emojiPrefix)) {
    const emojiPreStripped = emojiPrefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex1 = new RegExp(`(${emojiPreStripped})([a-z0-9+-_]*)`, 'g');
    match = regex1.test(`${emojiVal}`);
    return [match, emoji];
  }
  return [match, emoji];
};

const insertEmojiOnEnterKey = (textarea, editorId, prop) => {
  // eslint-disable-next-line consistent-return
  textarea.addEventListener('keydown', (e) => {
    if (filtered.content_length > 0 && e.keyCode === 13) {
      const currentEmojiIdHTML = document.getElementById(`emoji-${currentFocus}-${editorId}`).innerHTML;
      const currentEmojiIdContent = currentEmojiIdHTML.split(' ')[0];
      document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('dropdown');
      currentFocus = 0;

      const matchEmoji = insertEmoji(currentEmojiIdContent, textarea.value);
      insertWriteInput(matchEmoji, editorId, prop);
      textarea.setSelectionRange(startEmo, startEmo);
      filtered.content_length = 0;
      e.preventDefault();
    } else if (filtered.content_length === 0 && e.keyCode === 13) {
      return true;
    }

    if (e.keyCode === 40 || e.keyCode === 38) {
      if (document.querySelector(`.filter-emoji-area-${editorId}`).classList.contains('dropdown')) {
        e.preventDefault();
      } else {
        return true;
      }
    }

    if (prop.splitScreen.shortcut) {
      if (e.ctrlKey && e.altKey && e.which === 80) {
        const previewBut = document.querySelector(`.snip-preview-button-${editorId}`);
        previewBut.click();
      }
    }
  });
};

const dropDownEmoji = (e, editorId, textarea, prop) => {
  const filterEmojiArea = document.querySelector(`.filter-emoji-area-${editorId}`);
  const [match, emoji] = getEmojiMatch(e, prop, editorId, textarea);
  if (match) {
    emoji.then(data => {
      filtered = data.filterEmojiIcon;
      allEmojis = data.allEmojis;
      if (filtered.content_length > 0 && e.keyCode !== 32) {
        filterEmojiArea.classList.add('dropdown');

        filterEmojiArea.innerHTML = filtered.content;

        placeAreasByCoord(`.filter-emoji-area-${editorId}`, textarea, editorId);
        navigateEmojiOnArrowKey(e, editorId);

        setAttributeToEmojiSelected(`emoji-${currentFocus}-${editorId}`, `.emoji-suggester-${editorId} .display-emoji-${editorId}`);
      } else {
        filterEmojiArea.classList.remove('dropdown');
        filtered.content_length = 0;
      }
    });
  } else {
    filterEmojiArea.classList.remove('dropdown');
  }
};

const setEmojiCaret = (e, prop, textarea) => {
  startSelection = textarea.selectionStart;
  endSelection = textarea.selectionEnd;
  const { emojiPrefix } = prop.inlineEmoji;
  if (e.key === emojiPrefix && allowedEmojiPrefix.includes(emojiPrefix)) {
    startEmo = textarea.selectionStart;
  }
};

const insertEmojijiOnKeyEvent = (textarea, editorId, prop) => {
  textarea.addEventListener('keyup', (e) => {
    setEmojiCaret(e, prop, textarea);
    dropDownEmoji(e, editorId, textarea, prop);
    let currentEmojiContent;
    const match = textarea.value.slice(startEmo, endSelection - 1);
    if (allEmojis[match] !== undefined && e.keyCode === 32) {
      currentEmojiContent = allEmojis[match];
      const matchEmoji = insertEmoji(currentEmojiContent, textarea.value);
      insertWriteInput(matchEmoji, editorId, prop);
      textarea.setSelectionRange(startEmo, startEmo);

      filtered.content_length = 0;
    }
  });
};

const inlineEmoji = (textarea, editorId, prop) => {
  insertEmojijiOnKeyEvent(textarea, editorId, prop);
  insertEmojiOnClick(editorId, prop);
  insertEmojiOnEnterKey(textarea, editorId, prop);
};

export default inlineEmoji;