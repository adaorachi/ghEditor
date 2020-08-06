/* eslint-disable import/no-dynamic-require */
import showdown from 'showdown';
import hljs from 'highlight.js/lib/core';
import sanitizeHtml from 'sanitize-html';
import { emojis } from './emojis';
import getCaretCoordinates from './caretPos';
import 'highlight.js/styles/github.css';
import ToggleTab from './toggleTab';
import { displayCommandButtons } from './toolbar';
import {
  setAttributeToEmojiSelected,
  expandHeight,
  extendDefaults,
} from './utils';

const Exec = (editorId, prop) => {
  const converter = new showdown.Converter();
  converter.setFlavor('github');
  converter.setOption({
    emoji: false,
    openLinksInNewWindow: true,
    underline: true,
    smoothLivePreview: true,
  });

  // eslint-disable-next-line one-var
  let currentFocus = 0,
    startSelection,
    endSelection,
    startEmo = 0,
    scrollT = 0,
    xx,
    yy;

  const highlightCode = (lang, code) => {
    const lang1 = lang === 'html' ? 'xml' : lang;
    try {
      // eslint-disable-next-line global-require
      hljs.registerLanguage(lang1, require(`highlight.js/lib/languages/${lang1}`));
      const highlightedCode = hljs.highlight(lang1, code).value;
      return highlightedCode.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/'/g, '&#039;');
    } catch (err) {
      return code;
    }
  };

  const coupleClass = (attr, prevAttr) => {
    const splitAttr = attr.split(' ');
    const splitPrevAttr = prevAttr.split(' ');
    let concatPrevAttr = '';
    splitPrevAttr.forEach((attr) => {
      if (!(attr.includes('class=') || attr.includes('id='))) {
        concatPrevAttr += attr;
      }
    });
    let classNames = '';
    let ids = '';
    let otherAtt = '';
    splitAttr.forEach((att) => {
      att = att.trim();
      if (att.charAt(0) === '.') {
        classNames += ` ${att.slice(1)}`;
      } else if (att.charAt(0) === '#') {
        ids += ` ${att.slice(1)}`;
      } else {
        otherAtt += att;
      }
    });

    const classNames1 = `class="${classNames.trim()}"`;
    const ids1 = `id="${ids.trim()}"`;
    let attribute = '';
    if (classNames !== '') {
      attribute += `${classNames1}`;
    }
    if (ids !== '') {
      attribute += ` ${ids1}`;
    }

    return `${attribute}${otherAtt}${concatPrevAttr}`;
  };

  const replaceSnippet = (text) => {
    text = text.replace(/(<code class=")([a-z]+)(\s+[^>]*>)([\S\s]*?)(<\/code>)/g, (_, p1, p2, p3, p4, p5) => p1 + p2 + p3 + highlightCode(p2, p4) + p5);

    text = text.replace(/(<pre><code>)([\S\s]*?)(<\/code><\/pre>([\n\s]+))(<p>{: .language-)([a-z]+)(}<\/p>)([\n]*)/g, (_, p1, p2, p3, p4, p5, p6) => p1 + highlightCode(p6, p2) + p3);

    text = text.replace(/((<br \/>\n)*)({::\s+comment})([\s\S]*?)({:\/comment})((<br \/>\n)*)/g, ' ');

    text = text.replace(/(<p>)(.*)(<br \/>\n)({:\s+)(.+?)(}=?)(<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7) => p1.replace(p1, `<p ${coupleClass(p5, '')}>`) + p2 + p7);

    text = text.replace(/(<p>)({:\s+)(.+?)(}=?)(<br \/>)([\s\S]*?)({:\s+\/})(<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => p1.replace(p1, `<p ${coupleClass(p3, '')}>`) + p6 + p8);

    text = text.replace(/(<a|h1|h2|h3|h4|h5|h6|img)([^>]*)(>.*?)(<\/(h1|h2|h3|h4|h5|h6|a|img)>)(\n<p>|.*)({:\s+)(.+?)(})((.*?)<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p8, p2)}${p3}${p4}`);

    text = text.replace(/(<li|h1|h2|h3|h4|h5|h6|img|p)([^>]*)(>.*?)({:\s+)(.+?)(})(.*?)(<\/(li|h1|h2|h3|h4|h5|h6|img|p)>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p5, p2)} ${p3}${p7}${p8}`);

    text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/'/g, '&#039;');

    return text;
  };

  const getAllAllowedAttributes = (attributes) => {
    const { allowedAttributes } = extendDefaults(prop);
    const { disallowedAttributes } = extendDefaults(prop);

    let allAttributes = attributes;
    // eslint-disable-next-line no-prototype-builtins
    if (extendDefaults(prop).hasOwnProperty('allowedAttributes')) {
      allAttributes = allAttributes.concat(allowedAttributes);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (extendDefaults(prop).hasOwnProperty('disallowedAttributes')) {
      allAttributes = allAttributes.filter((attr) => disallowedAttributes.indexOf(attr) < 0);
    }

    return allAttributes;
  };

  const getAllAllowedTags = (tags) => {
    const { allowedTags } = extendDefaults(prop);
    const { disallowedTags } = extendDefaults(prop);

    let allTags = tags;
    // eslint-disable-next-line no-prototype-builtins
    if (extendDefaults(prop).hasOwnProperty('allowedTags')) {
      allTags = allTags.concat(allowedTags);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (extendDefaults(prop).hasOwnProperty('disallowedTags')) {
      allTags = allTags.filter((attr) => disallowedTags.indexOf(attr) < 0);
    }

    return allTags;
  };

  const getMarkdown = () => {
    const text = document.getElementById(`snip-write-${editorId}`).value;
    const attr = ['class', 'id', 'href', 'align', 'alt', 'target', 'src'];
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'span', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'detail', 'figure'];
    const sanitizedText = sanitizeHtml(text, {
      allowedAttributes: {
        '*': getAllAllowedAttributes(attr),
      },
      allowedTags: getAllAllowedTags(tags),
    });
    const text1 = replaceSnippet(sanitizedText);
    const text2 = converter.makeHtml(text1);

    return text2;
  };

  const updatePreviewInputOnClick = () => {
    const previewButton = document.getElementById(`snip-preview-tab-${editorId}`);
    previewButton.addEventListener('click', () => {
      const text = getMarkdown();
      document.getElementById(`snip-preview-${editorId}`).innerHTML = text;
    });
  };

  const insertWriteInput = (matchEmoji) => {
    document.getElementById(`snip-write-${editorId}`).value = matchEmoji;
  };

  const insertEmoji = (repl, textVal) => {
    const diff = endSelection - startEmo;
    if (diff >= 0 && diff <= 40) {
      textVal = textVal.slice(0, startEmo - 1) + repl + textVal.slice(endSelection);
    }
    return textVal;
  };

  const insertEmojiOnClick = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains(`display-emoji-${editorId}`)) {
        const { id } = e.target;
        const currentEmojiHTML = document.getElementById(id).innerHTML;
        const currentEmojiContent = currentEmojiHTML.split(' ')[0];

        document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('dropdown');
        currentFocus = 0;

        const matchEmoji = insertEmoji(currentEmojiContent, textarea.value);

        insertWriteInput(matchEmoji);
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
        let textVal = textarea.value;
        textVal = textVal.slice(0, startSelection) + currentEmojiHTML + textVal.slice(endSelection);
        const matchEmoji = textVal;

        insertWriteInput(matchEmoji);
        textarea.setSelectionRange(startEmo, startEmo);
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

  const utilValues = () => {
    let emojiVal;
    const textVal = document.getElementById(`snip-write-${editorId}`).value;
    const diff = endSelection - startEmo;
    if (diff >= 0 && diff <= 40) {
      emojiVal = textVal.slice(startEmo - 1, endSelection);
    } else {
      emojiVal = textVal.slice(endSelection);
    }
    const emoji = emojis(editorId, emojiVal);
    const regex1 = /(:)([a-z0-9+-_]*)/g;
    const match = regex1.test(emojiVal);
    return [match, emoji];
  };

  const insertEmojiOnEnterKey = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    textarea.addEventListener('keydown', (e) => {
      const [match, emoji] = utilValues();
      if (match) {
        emoji.then(data => {
          const filtered = data.filterEmojiIcon;
          if (filtered.content_length > 0 && e.keyCode === 13) {
            const currentEmojiIdHTML = document.getElementById(`emoji-${currentFocus}-${editorId}`).innerHTML;
            const currentEmojiIdContent = currentEmojiIdHTML.split(' ')[0];
            document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('dropdown');
            currentFocus = 0;

            const matchEmoji = insertEmoji(currentEmojiIdContent, textarea.value);
            insertWriteInput(matchEmoji);
            textarea.setSelectionRange(startEmo, startEmo);

            e.preventDefault();
          }
        });

        if (e.keyCode === 40 || e.keyCode === 38) {
          e.preventDefault();
        }
      }
    });
  };

  const dropDownEmoji = (e) => {
    const filterEmojiArea = document.querySelector(`.filter-emoji-area-${editorId}`);
    const textarea = document.getElementById(`snip-write-${editorId}`);
    const [match, emoji] = utilValues();
    if (match) {
      emoji.then(data => {
        const filtered = data.filterEmojiIcon;
        if (filtered.content_length > 0 && e.keyCode !== 32) {
          filterEmojiArea.classList.add('dropdown');

          filterEmojiArea.innerHTML = filtered.content;
          const boundArea = filterEmojiArea.getBoundingClientRect();
          const boundArea1 = textarea.getBoundingClientRect();
          if (boundArea.right > boundArea1.right) {
            filterEmojiArea.style.left = `${yy - 140}px`;
          }

          selectEmojiOnArrowKey(e);

          setAttributeToEmojiSelected(`emoji-${currentFocus}-${editorId}`, `.emoji-suggester-${editorId} .display-emoji-${editorId}`);
        } else {
          filterEmojiArea.classList.remove('dropdown');
        }
      });
    } else {
      filterEmojiArea.classList.remove('dropdown');
    }
  };

  const placeAreasByCoord = (area, textarea, leftCoord = 0) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const coordinates = getCaretCoordinates(textarea, start, end, editorId);
    xx = coordinates.top - scrollT;
    yy = coordinates.left;
    startEmo = endSelection;
    const inputArea = document.querySelector(area);

    inputArea.style.top = `${xx + 40}px`;
    inputArea.style.left = `${yy - leftCoord}px`;
  };

  const insertEmojijiOnKeyEvent = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    textarea.addEventListener('keyup', (e) => {
      dropDownEmoji(e);
      let currentEmojiContent;
      const [reg, emoji] = utilValues();
      if (reg) {
        emoji.then(data => {
          const { allEmojis } = data;
          const match = textarea.value.slice(startEmo - 1, endSelection - 1);
          if (allEmojis[match] !== undefined && e.keyCode === 32) {
            currentEmojiContent = allEmojis[match];
            const matchEmoji = insertEmoji(currentEmojiContent, textarea.value);
            insertWriteInput(matchEmoji);
            textarea.setSelectionRange(startEmo, startEmo);
          }
        });
      }
    });

    insertEmojiOnClick();
    insertEmojiOnEnterKey();
  };

  const buttonTooltip = () => {
    const allButtons2 = document.querySelectorAll(`.buttons.tooltip-${editorId}`);
    allButtons2.forEach((button) => {
      const { id } = button;
      button.addEventListener('mouseover', () => {
        const tooltipAll = `.buttons.tooltip-${editorId}`;
        ToggleTab.hideAndDisplayNav(id, tooltipAll);
      });

      button.addEventListener('mouseleave', () => {
        Array.from(allButtons2).forEach((item) => {
          item.classList.remove('active');
        });
      });
    });
  };

  const execCommand = (textarea, snipReg, snipSym, range, id) => {
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    const selectMode = (start === end) ? 'end' : 'preserve';
    let selected = textarea.value.slice(start, end);

    const selection2 = textarea.value.slice(start - range[0], end + range[1]);
    if (selected.match(snipReg)) {
      selected = selected.replace(snipReg, (_, p1, p2) => ((id === `link-${editorId}`) ? (p1.replace(/\[/, '') + p2.replace(p2, ' ')) : p2));
    } else if (selection2.match(snipReg)) {
      start = textarea.selectionStart - range[0];
      end = textarea.selectionEnd + range[1];
    } else if ([`bold-${editorId}`, `italic-${editorId}`, `code-${editorId}`].includes(id)) {
      selected = `${snipSym}${selected.trim()}${snipSym} `;
    } else if (id === `code-square-${editorId}`) {
      selected = `${snipSym}\n${selected.trim()}\n${snipSym} `;
    } else if (id === `link-${editorId}`) {
      selected = `[${selected.trim()}](url) `;
    } else {
      selected = `${snipSym}${selected}`;
    }

    textarea.focus();
    textarea.setRangeText(selected, start, end, selectMode);
  };

  const execCommandOnButtons = (textarea, buttonElement) => {
    const allButtons = document.querySelectorAll(buttonElement);
    allButtons.forEach((button) => {
      let { id } = button;
      if (id.includes('suggester')) {
        const idSplit = id.split('-');
        idSplit.pop();
        id = idSplit.join('-');
      }
      button.addEventListener('click', (e) => {
        let snipReg;
        let snipSym;
        let range;
        switch (id) {
          case `heading-${editorId}`:
            snipReg = new RegExp(/(###\s+)([\S\s]*?)/, 'g');
            snipSym = '### ';
            range = [4, 0];
            break;
          case `bold-${editorId}`:
            snipReg = new RegExp(/(\*\*)([\S\s]*?)(\*\*)/, 'g');
            snipSym = '**';
            range = [2, 2];
            break;
          case `italic-${editorId}`:
            snipReg = new RegExp(/(_)([\S\s]*?)(_)/, 'g');
            snipSym = '_';
            range = [1, 1];
            break;
          case `mention-${editorId}`:
            snipReg = new RegExp(/(@)([\S\s]*?)/, 'g');
            snipSym = '@';
            range = [1, 0];
            break;
          case `quote-${editorId}`:
            snipReg = new RegExp(/(>\s)([\S\s]*?)/, 'g');
            snipSym = '> ';
            range = [2, 0];
            break;
          case `code-${editorId}`:
            snipReg = new RegExp(/(`)([\S\s]*?)(`)/, 'g');
            snipSym = '`';
            range = [1, 1];
            break;
          case `list-unordered-${editorId}`:
            snipReg = new RegExp(/(-\s)([\S\s]*?)/, 'g');
            snipSym = '- ';
            range = [2, 0];
            break;
          case `code-square-${editorId}`:
            snipReg = new RegExp(/(```)([\S\s]*?)(```)/, 'g');
            snipSym = '```';
            range = [3, 3];
            break;
          case `list-ordered-${editorId}`:
            snipReg = new RegExp(/(1.\s)([\S\s]*?)/, 'g');
            snipSym = '1. ';
            range = [3, 0];
            break;
          case `tasklist-${editorId}`:
            snipReg = new RegExp(/(-\s\[\s\]\s)([\S\s]*?)/, 'g');
            snipSym = '- [ ] ';
            range = [6, 0];
            break;
          case `link-${editorId}`:
            snipReg = new RegExp(/\[(.*?)\]\((.*?)\)(.*)/, 'g');
            snipSym = '';
            range = [1, 4];
            break;
          default:
            break;
        }

        execCommand(textarea, snipReg, snipSym, range, id);

        e.preventDefault();
      });
    });
  };

  const displayToolbar = (textarea) => {
    const toolbarButtonArea = document.querySelector(`.toolbar-button-area-${editorId}`);
    textarea.addEventListener('select', () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.slice(start, end).length;
      if (selected > 0) {
        placeAreasByCoord(`.toolbar-button-area-${editorId}`, textarea, 40);
        toolbarButtonArea.classList.add('dropdown');
        const suggestorButtons = 'heading|bold|italic|code|link|list-unordered';
        toolbarButtonArea.innerHTML = displayCommandButtons(editorId, suggestorButtons, 20, true);
        execCommandOnButtons(textarea, `.buttons.markdown-button-${editorId}-suggester`);

        const boundArea = toolbarButtonArea.getBoundingClientRect();
        const boundArea1 = textarea.getBoundingClientRect();
        if (boundArea.right > boundArea1.right) {
          toolbarButtonArea.style.left = `${yy - 200}px`;
          toolbarButtonArea.classList.add('adjust-tip');
        } else {
          toolbarButtonArea.classList.remove('adjust-tip');
        }

        if (boundArea.bottom > boundArea1.bottom) {
          toolbarButtonArea.style.top = `${boundArea1.height - 30}px`;
        }
      }
      document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('dropdown');
    });
  };

  const insertAllTextOnInput = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    const textAreaHeight = textarea.style.height;
    textarea.addEventListener('input', (e) => {
      startSelection = textarea.selectionStart;
      endSelection = textarea.selectionEnd;
      if (e.data === ':') {
        placeAreasByCoord(`.filter-emoji-area-${editorId}`, textarea);
      }

      textarea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;

      const toolbarButtonArea = document.querySelector(`.toolbar-button-area-${editorId}`);
      toolbarButtonArea.classList.remove('dropdown');
    });

    textarea.addEventListener('click', () => {
      const toolbarButtonArea = `.toolbar-button-area-${editorId}`;
      const filterEmojiArea = `.filter-emoji-area-${editorId}`;
      [toolbarButtonArea, filterEmojiArea].forEach((area) => {
        const a = document.querySelector(area);
        a.classList.remove('dropdown');
      });
    });

    textarea.addEventListener('scroll', () => {
      scrollT = textarea.scrollTop;
    });
    displayToolbar(textarea);
  };

  const execAllCommands = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    execCommandOnButtons(textarea, `.buttons.markdown-button-${editorId}`);

    buttonTooltip();
  };

  const outputMarkDown = () => {
    if (extendDefaults(prop).inTextEmoji) {
      insertEmojijiOnKeyEvent();
    }

    if (extendDefaults(prop).buttonEmoji) {
      insertEmojiOnEmojiAreaClick();
      document.getElementById(`smiley-${editorId}`).style.display = 'initial';
    }

    insertAllTextOnInput();

    execAllCommands();

    updatePreviewInputOnClick();
  };

  return { outputMarkDown, getMarkdown };
};

export default Exec;