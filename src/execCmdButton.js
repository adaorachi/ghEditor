import marked from 'marked';
import Utils from './utils';
import * as emoji from './emoji.json';
import Emojis from './emojis';
import getCaretCoordinates from './caretPos';

const ExecCmdButton = (editorId, currentFocus = 0, startSelection, endSelection, startEmo = 0) => {
  // const editorId = Utils.extendDefaults(properties).id;
  const replaceSnippet = (text) => {
    text = text.replace(/(<p>)([\S\s]*?)(<\/p>)/g, (_, p1, p2, p3) => p1 + p2.replace(/\n/g, '<br>') + p3);
    text = text.replace(/(<li>)(<input[^>]*>)([\S\s]*?)(<\/li>)/g, (_, p1, p2, p3, p4) => p1.replace(p1, '<li class="task-list-item">') + p2 + p3 + p4);

    document.getElementById(`snip-preview-${editorId}`).innerHTML = text;
    document.getElementById(`${editorId}`).innerHTML = text;
    // document.querySelector('#meme').innerHTML = text;
  };

  const utilValues = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    const [textareaValue, regex] = [textarea.value, /(:)([a-z0-9+-_]*)/g];
    const emojiMatch = regex.test(textareaValue);
    const currentEmojiId = document.getElementById(`emoji-${currentFocus}`);
    return [textareaValue, regex, emojiMatch, currentEmojiId];
  };

  const updatePreviewInput = (matchEmoji) => {
    document.getElementById(`snip-write-${editorId}`).value = matchEmoji;
    const text = marked(document.getElementById(`snip-write-${editorId}`).value);
    replaceSnippet(text);
  };

  const replaceEmo = (repl, textareaValue) => {
    const diff = endSelection - startEmo;
    if (diff >= 0 && diff <= 25) {
      textareaValue = textareaValue.slice(0, startEmo - 1) + repl + textareaValue.slice(endSelection);
    }
    return textareaValue;
  };

  const insertEmojiOnClick = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains(`display-emoji-${editorId}`)) {
        const { id } = e.target;
        const currentEmojiHTML = document.getElementById(id).innerHTML;
        const currentEmojiContent = currentEmojiHTML.split(' ')[0];

        document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('emoji-dropdown');
        currentFocus = 0;

        const matchEmoji = replaceEmo(currentEmojiContent, textarea.value);
        // textareaValue.replace(regex, () => `${currentEmojiContent}`);

        updatePreviewInput(matchEmoji);
        textarea.setSelectionRange(startSelection, endSelection);
      }
    });
  };

  const insertEmojiOnEmojiAreaClick = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains(`emoji-area-button-${editorId}`)) {
        const { id } = e.target;
        const currentEmojiHTML = document.getElementById(id).innerText;
        let textareaValue = textarea.value;
        textareaValue = textareaValue.slice(0, startSelection) + currentEmojiHTML + textareaValue.slice(endSelection);
        const matchEmoji = textareaValue;

        updatePreviewInput(matchEmoji);
        textarea.setSelectionRange(startSelection, endSelection);
      }
    });
  };

  const selectEmojiOnArrowKey = (e) => {
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

  const insertEmojiOnEnterKey = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    textarea.addEventListener('keydown', (e) => {
      const [_, regex, emojiMatch, currentEmojiId] = utilValues();
      let textareaValue;
      const emojiMatch2 = document.getElementById(`snip-write-${editorId}`).value;
      const diff = endSelection - startEmo;
      if (diff >= 0 && diff <= 25) {
        textareaValue = emojiMatch2.slice(startEmo - 1, endSelection);
      } else {
        textareaValue = emojiMatch2.slice(endSelection);
      }
      const emojis = Emojis();
      const filtered = emojis.filterEmojiIcons(textareaValue, editorId);
      const regex1 = /(:)([a-z0-9+-_]*)/g;
      const match = regex1.test(textareaValue);

      if (match && filtered.content_length > 0 && e.keyCode === 13) {
        const currentEmojiIdHTML = document.getElementById(`emoji-${currentFocus}-${editorId}`).innerHTML;
        const currentEmojiIdContent = currentEmojiIdHTML.split(' ')[0];
        document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('emoji-dropdown');
        currentFocus = 0;

        // const matchEmoji = textareaValue.replace(regex, () => `${currentEmojiIdContent}`);
        const matchEmoji = replaceEmo(currentEmojiIdContent, textarea.value);
        updatePreviewInput(matchEmoji);
        textarea.setSelectionRange(startSelection, endSelection);

        e.preventDefault();
      }

      if (e.keyCode === 40 || e.keyCode === 38) {
        e.preventDefault();
      }
    });
  };

  const dropDownEmoji = (_, __, emojiMatch, e) => {
    const diff = endSelection - startEmo;
    let textareaValue;
    const emojiMatch2 = document.getElementById(`snip-write-${editorId}`).value;
    if (diff >= 0 && diff <= 25) {
      textareaValue = emojiMatch2.slice(startEmo - 1, endSelection);
    } else {
      textareaValue = emojiMatch2.slice(endSelection);
    }
    const filterEmojiArea = document.querySelector(`.filter-emoji-area-${editorId}`);
    const emojis = Emojis();
    const filtered = emojis.filterEmojiIcons(textareaValue, editorId);
    const regex = /(:)([a-z0-9+-_]*)/g;
    const match = regex.test(textareaValue);
    // console.log(filtered.content_length)
    if (match && filtered.content_length > 0 && e.keyCode !== 32) {
      filterEmojiArea.classList.add('emoji-dropdown');

      filterEmojiArea.innerHTML = filtered.content;

      selectEmojiOnArrowKey(e);

      Utils.setAttributeToEmojiSelected(`emoji-${currentFocus}-${editorId}`, `.emoji-suggester-${editorId} .display-emoji-${editorId}`);
    } else {
      filterEmojiArea.classList.remove('emoji-dropdown');
    }

    if (filtered.content_length <= 0) {
      filterEmojiArea.classList.remove('emoji-dropdown');
    }
  };

  const replaceEmojiOnKeyEvent = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    textarea.addEventListener('keyup', (e) => {
      const [textareaValue, regex, emojiMatch] = utilValues();
      dropDownEmoji(textareaValue, regex, emojiMatch, e);

      const matchEmoji = textareaValue.replace(regex, (match) => {
        if (emoji[match] !== undefined && e.keyCode === 32) {
          return emoji[match];
        }
        return match;
      });

      updatePreviewInput(matchEmoji);
    });

    insertEmojiOnClick();
    insertEmojiOnEnterKey();
  };

  const insertAllTextOnInput = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    const textAreaHeight = document.getElementById(`snip-write-${editorId}`).clientHeight;
    let text;
    let scrollT = 0;
    let xx;
    let yy;
    textarea.addEventListener('input', (e) => {
      const coordinates = getCaretCoordinates(textarea, textarea.selectionEnd, editorId);
      startSelection = textarea.selectionStart;
      endSelection = textarea.selectionEnd;

      if (e.data === ':') {
        xx = coordinates.top - scrollT;
        yy = coordinates.left;
        startEmo = endSelection;

        const filterEmojiArea = document.querySelector(`.filter-emoji-area-${editorId}`);
        filterEmojiArea.style.top = `${xx + 40}px`;
        filterEmojiArea.style.left = `${yy}px`;
      }

      textarea.addEventListener('scroll', () => {
        scrollT = textarea.scrollTop;
      });

      text = marked(e.target.value);
      replaceSnippet(text);
      textarea.style.height = `${Utils.expandHeight(textarea.value, textAreaHeight)}px`;
    });
  };

  const btnExecuteCommand = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    let text;
    const allButtons = document.querySelectorAll(`.buttons.markdown-button-${editorId}`);
    allButtons.forEach((button) => {
      const { id } = button;
      button.addEventListener('click', (e) => {
        let snipReg;
        let snipSym;
        let range;
        switch (id) {
          case 'heading':
            snipReg = new RegExp(/(###\s+)([\S\s]*?)/, 'g');
            snipSym = '### ';
            range = [4, 0];
            break;
          case 'bold':
            snipReg = new RegExp(/(\*\*)([\S\s]*?)(\*\*)/, 'g');
            snipSym = '**';
            range = [2, 2];
            break;
          case 'italic':
            snipReg = new RegExp(/(_)([\S\s]*?)(_)/, 'g');
            snipSym = '_';
            range = [1, 1];
            break;
          case 'underline':
            snipReg = new RegExp(/(---\s)([\S\s]*?)/, 'g');
            snipSym = '--- ';
            range = [4, 0];
            break;
          case 'strikethrough':
            snipReg = new RegExp(/(~~)([\S\s]*?)(~~)/, 'g');
            snipSym = '~~';
            range = [2, 2];
            break;
          case 'quote-left':
            snipReg = new RegExp(/(>\s)([\S\s]*?)/, 'g');
            snipSym = '> ';
            range = [2, 0];
            break;
          case 'code':
            snipReg = new RegExp(/(`)([\S\s]*?)(`)/, 'g');
            snipSym = '`';
            range = [1, 1];
            break;
          case 'list-ul':
            snipReg = new RegExp(/(-\s)([\S\s]*?)/, 'g');
            snipSym = '- ';
            range = [2, 0];
            break;
          case 'list-ol':
            snipReg = new RegExp(/(1.\s)([\S\s]*?)/, 'g');
            snipSym = '1. ';
            range = [3, 0];
            break;
          case 'check-square':
            snipReg = new RegExp(/(-\s\[\s\]\s)([\S\s]*?)/, 'g');
            snipSym = '- [ ] ';
            range = [6, 0];
            break;
          case 'link':
            snipReg = new RegExp(/\[(.*?)\]\((.*?)\)(.*)/, 'g');
            snipSym = '';
            range = [1, 4];
            break;
          default:
            break;
        }

        const selectMode = (textarea.selectionStart === textarea.selectionEnd) ? 'end' : 'preserve';

        let selected = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        const selection2 = textarea.value.slice(start - range[0], end + range[1]);
        if (selected.match(snipReg)) {
          selected = selected.replace(snipReg, (_, p1, p2) => ((id === 'link') ? (p1.replace(/\[/, '') + p2.replace(p2, ' ')) : p2));
        } else if (selection2.match(snipReg)) {
          start = textarea.selectionStart - range[0];
          end = textarea.selectionEnd + range[1];
        } else if (['bold', 'italic', 'strikethrough', 'code'].includes(id)) {
          selected = `${snipSym}${selected.trim()}${snipSym} `;
        } else if (['link'].includes(id)) {
          selected = `[${selected.trim()}](url) `;
        } else {
          selected = `${snipSym}${selected}`;
        }

        textarea.focus();
        textarea.setRangeText(selected, start, end, selectMode);
        text = marked(textarea.value);
        replaceSnippet(text);
        e.preventDefault();
      });
    });
  };

  const execEditorCommand = (prop) => {
    if (Utils.extendDefaults(prop).emoji) {
      replaceEmojiOnKeyEvent();
    }
    insertEmojiOnEmojiAreaClick()
    insertAllTextOnInput();

    btnExecuteCommand();
  };

  return { execEditorCommand };
};

export default ExecCmdButton;