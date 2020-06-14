import marked from 'marked';
import Utils from './utils';
import * as emoji from './emoji.json';
import Emojis from './emojis';
import getCaretCoordinates from './caretPos';

const ExecCmdButton = (currentFocus = 0, startSelection, endSelection, xx, yy) => {
  const replaceSnippet = (text) => {
    text = text.replace(/(<p>)([\S\s]*?)(<\/p>)/g, (_, p1, p2, p3) => p1 + p2.replace(/\n/g, '<br>') + p3);
    text = text.replace(/(<li>)(<input[^>]*>)([\S\s]*?)(<\/li>)/g, (_, p1, p2, p3, p4) => p1.replace(p1, '<li class="task-list-item">') + p2 + p3 + p4);

    document.getElementById('snip-preview').innerHTML = text;
    document.querySelector('.snip-markdown').innerHTML = text;
    // document.querySelector('#meme').innerHTML = text;
  };

  const utilValues = () => {
    const textarea = document.getElementById('snip-write');
    const [textareaValue, regex] = [textarea.value, /(:)([a-z0-9+-_]*)/g];
    const emojiMatch = regex.test(textareaValue);
    const currentEmojiId = document.getElementById(`emoji-${currentFocus}`);
    return [textareaValue, regex, emojiMatch, currentEmojiId];
  };

  const updatePreviewInput = (matchEmoji) => {
    document.getElementById('snip-write').value = matchEmoji;
    const text = marked(document.getElementById('snip-write').value);
    replaceSnippet(text);
  };

  const insertEmojiOnClick = (textareaValue, regex) => {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('display-emoji')) {
        const { id } = e.target;
        const currentEmojiHTML = document.getElementById(id).innerHTML;
        const currentEmojiContent = currentEmojiHTML.split(' ')[0];

        document.querySelector('.filter-emoji-area').classList.remove('emoji-dropdown');
        currentFocus = 0;

        const matchEmoji = textareaValue.replace(regex, () => `${currentEmojiContent}`);

        updatePreviewInput(matchEmoji);

        const textarea = document.getElementById('snip-write');
        textarea.setSelectionRange(startSelection, endSelection);
        // textarea.focus();
      }
    });
  };

  const selectEmojiOnArrowKey = (e) => {
    const locListItems = document.querySelectorAll('.emoji-suggester .display-emoji');
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
    const textarea = document.getElementById('snip-write');
    textarea.addEventListener('keydown', (e) => {
      const [textareaValue, regex, emojiMatch, currentEmojiId] = utilValues();

      if (emojiMatch && e.keyCode === 13 && currentEmojiId !== null) {
        const currentEmojiIdHTML = document.getElementById(`emoji-${currentFocus}`).innerHTML;
        const currentEmojiIdContent = currentEmojiIdHTML.split(' ')[0];
        document.querySelector('.filter-emoji-area').classList.remove('emoji-dropdown');
        currentFocus = 0;

        const matchEmoji = textareaValue.replace(regex, () => `${currentEmojiIdContent}`);
        updatePreviewInput(matchEmoji);
        textarea.setSelectionRange(startSelection, endSelection);

        e.preventDefault();
      }
    });
  };

  const dropDownEmoji = (textareaValue, regex, emojiMatch, e) => {
    if (emojiMatch && e.keyCode !== 32) {
      const match = textareaValue.match(regex)[0];

      const emojis = Emojis();
      const filtered = emojis.filterEmojiIcons(match);

      const filterEmojiArea = document.querySelector('.filter-emoji-area');
      filterEmojiArea.style.top = `${xx + 40}px`;
      filterEmojiArea.style.left = `${yy}px`;
      filterEmojiArea.classList.add('emoji-dropdown');

      filterEmojiArea.innerHTML = filtered;

      insertEmojiOnClick(textareaValue, regex);
      selectEmojiOnArrowKey(e);

      Utils.setAttributeToEmojiSelected(`emoji-${currentFocus}`, '.emoji-suggester .display-emoji');
    } else {
      document.querySelector('.filter-emoji-area').classList.remove('emoji-dropdown');
    }
  };

  const replaceEmojiOnKeyEvent = () => {
    const textarea = document.getElementById('snip-write');
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

    insertEmojiOnEnterKey();
  };

  const insertAllTextOnInput = () => {
    const textarea = document.getElementById('snip-write');
    const textAreaHeight = document.getElementById('snip-write').clientHeight;
    let text;
    let scrollT = 0;
    textarea.addEventListener('input', (e) => {

      const coordinates = getCaretCoordinates(textarea, textarea.selectionEnd);

      textarea.addEventListener('scroll', () => {
        scrollT = textarea.scrollTop;
      });
      if (e.data === ':') {
        xx = coordinates.top - scrollT;
        yy = coordinates.left;
      }

      text = marked(e.target.value);
      replaceSnippet(text);
      textarea.style.height = `${Utils.expandHeight(textarea.value, textAreaHeight)}px`;

      startSelection = textarea.selectionStart;
      endSelection = textarea.selectionEnd;
    });
  };

  const btnExecuteCommand = () => {
    const textarea = document.getElementById('snip-write');
    let text;
    const allButtons = document.querySelectorAll('.buttons.markdown-button');
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
          selected = selected.replace(snipReg, (_, p1, p2) => ((id === 'link') ? p1.replace(/\[/, '') : p2));
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
    insertAllTextOnInput();

    btnExecuteCommand();
  };

  return { execEditorCommand };
};

export default ExecCmdButton;