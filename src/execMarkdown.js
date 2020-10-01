/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-dynamic-require */
import showdown from 'showdown';
import hljs from 'highlight.js/lib/core';
import sanitizeHtml from 'sanitize-html';
import { emojis, toggleEmojiArea } from './emojis';
import getCaretCoordinates from './caretPos';
import 'highlight.js/styles/github.css';
import ToggleTab from './toggleTab';
import { displayCommandButtons } from './toolbar';

import firebaseSetting from './firebaseSetting';

import {
  setAttributeToEmojiSelected,
  expandHeight,
  extendDefaults,
  setStorageInterval,
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
    insertImage = 0,
    xx,
    yy;
  let isSelected = false;

  const textarea = document.getElementById(`snip-write-${editorId}`);

  const syncHighlightCode = (lang, code) => {
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
    if (extendDefaults(prop).inlineAttributes) {
      text = text.replace(/((<br \/>\n)*)({::\s+comment})([\s\S]*?)({:\/comment})((<br \/>\n)*)/g, ' ');

      text = text.replace(/(<p>)(.*)(<br \/>\n)({:\s+)(.+?)(}=?)(<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7) => p1.replace(p1, `<p ${coupleClass(p5, '')}>`) + p2 + p7);

      text = text.replace(/(<p>)({:\s+)(.+?)(}=?)(<br \/>)([\s\S]*?)({:\s+\/})(<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => p1.replace(p1, `<p ${coupleClass(p3, '')}>`) + p6 + p8);

      text = text.replace(/(<a|h1|h2|h3|h4|h5|h6|img)([^>]*)(>.*?)(<\/(h1|h2|h3|h4|h5|h6|a|img)>)(\n<p>|.*)({:\s+)(.+?)(})((.*?)<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p8, p2)}${p3}${p4}`);

      text = text.replace(/(<li|h1|h2|h3|h4|h5|h6|img|p)([^>]*)(>.*?)({:\s+)(.+?)(})(.*?)(<\/(li|h1|h2|h3|h4|h5|h6|img|p)>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p5, p2)} ${p3}${p7}${p8}`);
    }

    return text;
  };

  const highlightCode = (text) => {
    if (extendDefaults(prop).highlightCode) {
      text = text.replace(/(<code class=")([a-z]+)(\s+[^>]*>)([\S\s]*?)(<\/code>)/g, (_, p1, p2, p3, p4, p5) => p1 + p2 + p3 + syncHighlightCode(p2, p4) + p5);

      text = text.replace(/(<pre><code>)([\S\s]*?)(<\/code><\/pre>([\n\s]+))(<p>{: .language-)([a-z]+)(}<\/p>)([\n]*)/g, (_, p1, p2, p3, p4, p5, p6) => p1 + syncHighlightCode(p6, p2) + p3);
    }
    return text;
  };

  const insertQuote = (text) => {
    text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
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
    const text = textarea.value;
    const attr = ['class', 'id', 'href', 'align', 'alt', 'target', 'src'];
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'span', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'details', 'summary', 'figure'];
    const sanitizedText = sanitizeHtml(text, {
      allowedAttributes: {
        '*': getAllAllowedAttributes(attr),
      },
      allowedTags: getAllAllowedTags(tags),
    });

    let text1 = insertQuote(sanitizedText);
    text1 = converter.makeHtml(text1);
    text1 = replaceSnippet(text1);
    text1 = highlightCode(text1);

    return text1;
  };

  const updatePreviewInputOnClick = () => {
    const previewButtons = [`#snip-preview-tab-${editorId}`, `.snip-preview-button-${editorId}`];
    previewButtons.forEach(button => {
      document.querySelector(button).addEventListener('click', () => {
        const text = getMarkdown();
        document.getElementById(`snip-preview-${editorId}`).innerHTML = text;
      });
    });
  };

  const autoUpdatePreviewInput = (textarea) => {
    const textAreaHeight = textarea.style.height;
    if (extendDefaults(prop).splitScreen.enabled) {
      const text = getMarkdown();
      const previewArea = document.getElementById(`snip-preview-${editorId}`);
      previewArea.innerHTML = text;
      previewArea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;
      ToggleTab.displayWordCount(editorId);
    }
  };

  const insertWriteInput = (matchEmoji) => {
    textarea.value = matchEmoji;
    autoUpdatePreviewInput(textarea);
  };

  const insertEmoji = (repl, textVal) => {
    const diff = endSelection - startEmo;
    if (diff >= 0 && diff <= 40) {
      textVal = textVal.slice(0, startEmo - 1) + repl + textVal.slice(endSelection);
    }
    return textVal;
  };

  const insertEmojiOnClick = () => {
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
    const allowedEmojiPrefix = ['-', ':', '/', '!', '#', '$', '&', '*', '=', '+', '^'];
    const { emojiPrefix } = extendDefaults(prop).inlineEmoji;
    let match = false;
    if (allowedEmojiPrefix.includes(emojiPrefix)) {
      const emojiPreStripped = emojiPrefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex1 = new RegExp(`(${emojiPreStripped})([a-z0-9+-_]*)`, 'g');
      match = regex1.test(`${emojiVal}`);
      return [match, emoji];
    }
    return [match, emoji];
  };

  const indentTab = (event, textarea) => {
    if (extendDefaults(prop).indentWithTab) {
      if (event.keyCode === 9) {
        const v = textarea.value;
        const s = textarea.selectionStart;
        const e = textarea.selectionEnd;
        textarea.value = `${v.substring(0, s)}\t${v.substring(e)}`;
        textarea.selectionStart = s + '\t'.length;
        textarea.selectionEnd = s + '\t'.length;
        event.preventDefault();
      }
    }
  };

  const insertEmojiOnEnterKey = () => {
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
        }).catch(() => {
          // console.log(err);
        });

        if (e.keyCode === 40 || e.keyCode === 38) {
          e.preventDefault();
        }
      }

      if (extendDefaults(prop).splitScreen.shortcut) {
        if (e.ctrlKey && e.altKey && e.which === 80) {
          const previewBut = document.querySelector(`.snip-preview-button-${editorId}`);
          previewBut.click();
        }
      }
    });
  };

  const dropDownEmoji = (e) => {
    const filterEmojiArea = document.querySelector(`.filter-emoji-area-${editorId}`);
    const [match, emoji] = utilValues();
    if (match) {
      emoji.then(data => {
        const filtered = data.filterEmojiIcon;
        // console.log(match)
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

  const placeAreasByCoord = (area, leftCoord = 0, isEmojiArea = true) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const coordinates = getCaretCoordinates(textarea, start, end, editorId);
    xx = coordinates.top - scrollT;
    yy = isEmojiArea ? coordinates.highlightLeft : coordinates.left;
    startEmo = endSelection;
    const inputArea = document.querySelector(area);

    inputArea.style.top = `${xx + 40}px`;
    inputArea.style.left = `${yy - leftCoord}px`;
  };

  const insertEmojijiOnKeyEvent = () => {
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

  const execCommand = (textarea, snipReg, snipSym, range, list, id) => {
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    const selectMode = (start === end) ? 'end' : 'preserve';
    let selected = textarea.value.slice(start, end);

    const selection2 = textarea.value.slice(start - range[0], end + range[1]);

    if (selected.match(snipReg)) {
      selected = selected.replace(snipReg, (_, p1, p2) => ((id === list.link || id === list.image) ? p1.replace(/\[/, '') + p2.replace(p2, ' ') : p2));
    } else if (selection2.match(snipReg)) {
      start = textarea.selectionStart - range[0];
      end = textarea.selectionEnd + range[1];
    } else if ([list.bold, list.italic, list.code, list.strikethrough].includes(id)) {
      selected = `${snipSym}${selected.trim()}${snipSym} `;
    } else if (id === list['code-block']) {
      selected = `${snipSym}\n${selected.trim()}\n${snipSym} `;
    } else if (id === list.link) {
      selected = `[${selected.trim()}](url) `;
    } else if (id === list.image) {
      selected = `![${selected.trim()}](image_url) `;
    } else {
      selected = `${snipSym}${selected}`;
    }
    textarea.focus();
    textarea.setRangeText(selected.trim(), start, end, selectMode);
    autoUpdatePreviewInput(textarea);
  };

  const cmdBlock = (id, blockStyle, list, e) => {
    let snipReg;
    let snipSym;
    let synCon = '';
    let range;
    switch (id) {
      case list.heading:
        snipReg = new RegExp(/(###)([\S\s]*?)/, 'g');
        snipSym = '### ';
        range = [4, 0];
        break;
      case list.bold:
        snipReg = blockStyle('bold')[1];
        snipSym = blockStyle('bold')[0];
        range = [2, 2];
        break;
      case list.italic:
        snipReg = blockStyle('italic')[1];
        snipSym = blockStyle('italic')[0];
        range = [1, 1];
        break;
      case list.mention:
        snipReg = new RegExp(/(@)([\S\s]*?)/, 'g');
        snipSym = '@';
        range = [1, 0];
        break;
      case list.blockquote:
        snipReg = new RegExp(/(>\s)([\S\s]*?)/, 'g');
        snipSym = '> ';
        range = [2, 0];
        break;
      case list.table:
        snipReg = null;
        synCon = '';
        synCon += '\n| Default-aligned | Left-aligned | Center-aligned  | Right-aligned  |';
        synCon += '\n|-----------------|:-------------|:---------------:|---------------:|';
        synCon += '\n| First-row cell-1 | cell-2  | cell-3      | cell-4    |';
        synCon += '\n| Second-row cell-1 | cell-2  | cell-3      | cell-4    |';
        synCon += '\n| Third-row cell-1 | cell-2  | cell-3      | cell-4    |\n';
        snipSym = synCon;
        range = [0, 0];
        break;
      case list.strikethrough:
        snipReg = new RegExp(/(~~)([\S\s]*?)(~~)/, 'g');
        snipSym = '~~';
        range = [2, 2];
        break;
      case list['horizontal-rule']:
        snipReg = null;
        snipSym = '---';
        range = [4, 0];
        break;
      case list.code:
        snipReg = new RegExp(/(`)([\S\s]*?)(`)/, 'g');
        snipSym = '`';
        range = [1, 1];
        break;
      case list['unordered-list']:
        snipReg = new RegExp(/(-\s)([\S\s]*?)/, 'g');
        snipSym = '- ';
        range = [2, 0];
        break;
      case list['code-block']:
        snipReg = blockStyle('code-block')[1];
        snipSym = blockStyle('code-block')[0];
        range = [3, 3];
        break;
      case list['ordered-list']:
        snipReg = new RegExp(/(1.\s)([\S\s]*?)/, 'g');
        snipSym = '1. ';
        range = [3, 0];
        break;
      case list.tasklist:
        snipReg = new RegExp(/(-\s\[\s\]\s)([\S\s]*?)/, 'g');
        snipSym = '- [ ] ';
        range = [6, 0];
        break;
      case list.link:
        snipReg = new RegExp(/\[(.*?)\]\((.*?)\)(.*)/, 'g');
        snipSym = '';
        range = [1, 4];
        break;
      case list.image:
        snipReg = new RegExp(/!\[(.*?)\]\((.*?)\)(.*)/, 'g');
        snipSym = '';
        range = [1, 4];
        break;
      default:
        break;
    }

    if (range === undefined) {
      return;
    }

    execCommand(textarea, snipReg, snipSym, range, list, id);

    e.preventDefault();
  };

  const execCommandOnButtons = (buttonElement) => {
    const allButtons = document.querySelectorAll(buttonElement);
    allButtons.forEach((button) => {
      let { id } = button;
      if (id.includes('suggester')) {
        const idSplit = id.split('-');
        idSplit.pop();
        id = idSplit.join('-');
      }

      function blockStyle(style) {
        const str = extendDefaults(prop).blockStyles[style];
        const str2 = str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${str2})([\\S\\s]*?)(${str2})`, 'g');
        return [str, regex];
      }

      const idList = {
        heading: `heading-${editorId}`,
        bold: `bold-${editorId}`,
        italic: `italic-${editorId}`,
        mention: `mention-${editorId}`,
        blockquote: `blockquote-${editorId}`,
        table: `table-${editorId}`,
        strikethrough: `strikethrough-${editorId}`,
        'horizontal-rule': `horizontal-rule-${editorId}`,
        code: `code-${editorId}`,
        'unordered-list': `unordered-list-${editorId}`,
        'code-block': `code-block-${editorId}`,
        'ordered-list': `ordered-list-${editorId}`,
        tasklist: `tasklist-${editorId}`,
        link: `link-${editorId}`,
        image: `image-${editorId}`,
      };

      button.addEventListener('click', (e) => {
        cmdBlock(id, blockStyle, idList, e);
      });
    });
  };

  const execCommandOnShortcut = (e) => {
    function blockStyle(style) {
      const str = extendDefaults(prop).blockStyles[style];
      const str2 = str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${str2})([\\S\\s]*?)(${str2})`, 'g');
      return [str, regex];
    }

    const listShortCuts = {
      heading: 72,
      bold: 66,
      italic: 73,
      mention: 50,
      blockquote: 190,
      table: 51,
      strikethrough: 52,
      // 'horizontal-rule': 73,
      code: 192,
      'unordered-list': 85,
      'code-block': 222,
      'ordered-list': 79,
      tasklist: 189,
      link: 76,
      image: 77,
    };

    let id;
    const shiftSC = [51, 52];
    if (shiftSC.includes(id)) {
      id = e.ctrlKey && e.shiftKey && e.which;
    } else {
      id = e.ctrlKey && e.which;
    }

    if (extendDefaults(prop).inlineShortcut) {
      cmdBlock(id, blockStyle, listShortCuts, e);
    }
  };

  const toolbarShortcut = () => {
    textarea.addEventListener('keydown', (e) => {
      indentTab(e, textarea);
      if (isSelected) {
        execCommandOnShortcut(e);
      }
    });
  };

  const displayToolbar = () => {
    const toolbarButtonArea = document.querySelector(`.toolbar-button-area-${editorId}`);
    const suggestorButtons = extendDefaults(prop).inlineToolbar;
    const toolbarTooltip = document.createElement('span');
    toolbarTooltip.className = `toolbar-tooltip toolbar-tooltip-${editorId}`;

    if (suggestorButtons !== '') {
      textarea.addEventListener('select', () => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.slice(start, end).length;
        if (selected > 0) {
          placeAreasByCoord(`.toolbar-button-area-${editorId}`, 40, false);
          toolbarButtonArea.classList.add('dropdown');
          toolbarTooltip.classList.add('dropdown');
          // eslint-disable-next-line max-len

          toolbarButtonArea.innerHTML = displayCommandButtons(editorId, prop, suggestorButtons, '', true)[1];
          execCommandOnButtons(`.buttons.markdown-button-${editorId}-suggester`);

          const write = document.querySelector(`.snip-writearea-${editorId}`);
          write.insertBefore(toolbarTooltip, toolbarButtonArea);

          const boundArea = toolbarButtonArea.getBoundingClientRect();
          const boundArea1 = textarea.getBoundingClientRect();
          if ((boundArea.right > boundArea1.right) || (yy > 200)) {
            toolbarButtonArea.style.left = `${yy - 200}px`;
          } else {
            toolbarButtonArea.style.left = '0';
          }

          toolbarTooltip.style.left = `${yy}px`;
          toolbarTooltip.style.top = `${xx + 33}px`;

          // if (boundArea.bottom > boundArea1.bottom) {
          //   toolbarButtonArea.style.top = `${boundArea1.height - 30}px`;
          // }
          isSelected = true;
        }
        document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('dropdown');
      });
    } else {
      toolbarButtonArea.style.display = 'none';
      toolbarTooltip.style.display = 'none';
    }
  };

  const insertAllTextOnInput = () => {
    let savedInterval = null;
    const textAreaHeight = textarea.style.height;
    textarea.addEventListener('input', (e) => {
      startSelection = textarea.selectionStart;
      endSelection = textarea.selectionEnd;
      const allowedEmojiPrefix = ['-', ':', '/', '!', '#', '$', '&', '*', '=', '+', '^'];
      const { emojiPrefix } = extendDefaults(prop).inlineEmoji;
      if (e.data === emojiPrefix && allowedEmojiPrefix.includes(emojiPrefix)) {
        placeAreasByCoord(`.filter-emoji-area-${editorId}`);
      }

      autoUpdatePreviewInput(textarea);

      textarea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;
      const toolbarButtonArea = document.querySelector(`.toolbar-button-area-${editorId}`);
      const toolbarTooltip = document.querySelector(`.toolbar-tooltip-${editorId}`);
      toolbarButtonArea.classList.remove('dropdown');
      if (toolbarTooltip !== null) {
        toolbarTooltip.classList.remove('dropdown');
      }
    });

    textarea.addEventListener('focus', () => {
      savedInterval = setStorageInterval(editorId, prop);
    });

    textarea.addEventListener('blur', () => {
      clearInterval(savedInterval);
    });

    document.addEventListener('click', (e) => {
      // const toolbarButtonArea = `.toolbar-button-area-${editorId}`;
      // const filterEmojiArea = `.filter-emoji-area-${editorId}`;
      // const toolbarTooltip = `.toolbar-tooltip-${editorId}`;
      const aa = [`toolbar-button-area-${editorId}`, `filter-emoji-area-${editorId}`, `toolbar-tooltip-${editorId}`];
      aa.forEach((area) => {
        const a = document.querySelector(`.${area}`);
        if (!e.target.classList.contains(area) && a !== null) {
          a.classList.remove('dropdown');
        }
      });

      insertImage = textarea.selectionEnd;
    });

    textarea.addEventListener('scroll', () => {
      scrollT = textarea.scrollTop;
    });
    displayToolbar(textarea);
  };

  const execAllCommands = () => {
    execCommandOnButtons(`.buttons.markdown-button-${editorId}`);

    buttonTooltip();
  };

  const outputMarkDown = () => {
    if (extendDefaults(prop).inlineEmoji.enabled) {
      insertEmojijiOnKeyEvent();
    }

    if (extendDefaults(prop).toolbarEmoji) {
      insertEmojiOnEmojiAreaClick();
      toggleEmojiArea(editorId);
      document.getElementById(`smiley-${editorId}`).style.display = 'initial';
    } else {
      document.getElementById(`smiley-${editorId}`).style.display = 'none';
    }

    insertAllTextOnInput();

    execAllCommands();

    updatePreviewInputOnClick();

    toolbarShortcut();
  };

  const uploadImage = () => {
    function callUploaded(fileUpload) {
      const storageRef = firebaseSetting(prop).storage().ref().child(fileUpload.name);
      const uploadImage = storageRef.put(fileUpload);
      const progressStatus = document.getElementById(`upload-image-progress-${editorId}`);
      let repl;
      let insertImageSelected = insertImage;
      let lineBreak = '\n';
      uploadImage.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress === 0) {
          let textVal = textarea.value;
          if (insertImage - 1 < 0) { insertImageSelected = 0; lineBreak = ''; }
          repl = `${lineBreak}![uploading ${fileUpload.name} ... ]()\n`;
          textVal = `${textVal.slice(0, insertImageSelected)}${repl}${textVal.slice(insertImage)}`;
          insertWriteInput(textVal);
          progressStatus.innerHTML = '<span class="snip-loader"><img src="https://adaorachi.github.io/snipdown_emojis/toolbar/loader.svg" style="width:20px" /></span> Uploading your files ..';
        }
      }, (error) => {
        // eslint-disable-next-line no-console
        console.log(error.message);
        progressStatus.innerHTML = 'Error uploading file!';
      }, () => {
        uploadImage.snapshot.ref.getDownloadURL().then((downloadURL) => {
          let textVal = textarea.value;
          const str = repl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = RegExp(str);
          const uploadedImage = `${lineBreak}![${fileUpload.name}](${downloadURL})\n`;
          if (regex.test(textVal)) {
            textVal = textVal.replace(repl, uploadedImage);
            insertWriteInput(textVal);
            progressStatus.innerHTML = 'Attach files by draggng and dropping or selecting them';
            const uploadInput = document.getElementById(`snip-uploadimage-${editorId}`);
            uploadInput.value = '';
          }
        });
      });
    }

    if (extendDefaults(prop).uploadImage.enabled) {
      const fileInput = document.getElementById(`snip-uploadimage-${editorId}`);
      const fileInputContainer = document.querySelector(`.snip-footer-${editorId}`);

      fileInput.addEventListener('change', (e) => {
        const fileUpload = e.target.files[0];
        callUploaded(fileUpload);
      });

      fileInput.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const { files } = dt;
        const fileUpload = files[0];
        callUploaded(fileUpload);
        e.preventDefault();
        e.stopPropagation();
      });

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileInput.addEventListener(eventName, () => {
          if (['dragenter', 'dragover'].includes(eventName)) {
            fileInputContainer.classList.add('highlight');
          } else {
            fileInputContainer.classList.remove('highlight');
          }
        });
      });
    }
  };

  return {
    outputMarkDown, getMarkdown, uploadImage, execCommandOnButtons,
  };
};

export default Exec;