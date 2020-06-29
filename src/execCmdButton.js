/* eslint-disable import/no-dynamic-require */
import showdown from 'showdown';
import hljs from 'highlight.js/lib/core';
import Utils from './utils';
import * as emoji from './emoji.json';
import Emojis from './emojis';
import getCaretCoordinates from './caretPos';
import 'highlight.js/styles/github.css';
import ToggleTab from './toggleTab';


const ExecCmdButton = (editorId, currentFocus = 0, startSelection, endSelection, startEmo = 0) => {
  const converter = new showdown.Converter();
  converter.setFlavor('github');
  converter.setOption({
    emoji: false,
    openLinksInNewWindow: true,
    underline: true,
    smoothLivePreview: true,
  });


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

  console.log(converter.getOptions());

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

    // const aa = /(<p>)({::\s+)(.+?)(}=?)([\s\S]*?)({:\s+\/})(<\/p>)/g;
    // console.log(text.match(aa))

    // const aa = /(<p>)([\S\s]*?)(<br \/>\n)({:: .class})((?!<p[^>]*>[\S\s]*?<\/p>).*)(<\/p>)/g;
    // console.log(text.match(aa))

    text = text.replace(/(<p>)({:\s+)(.+?)(}=?)(<br \/>)([\s\S]*?)({:\s+\/})(<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => p1.replace(p1, `<p ${coupleClass(p3, '')}>`) + p6 + p8);

    text = text.replace(/(<a|h1|h2|h3|h4|h5|h6|img)([^>]*)(>.*?)(<\/(h1|h2|h3|h4|h5|h6|a|img)>)(\n<p>|.*)({:\s+)(.+?)(})((.*?)<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p8, p2)}${p3}${p4}`);

    text = text.replace(/(<li|h1|h2|h3|h4|h5|h6|img|p)([^>]*)(>.*?)({:\s+)(.+?)(})(.*?)(<\/(li|h1|h2|h3|h4|h5|h6|img|p)>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p5, p2)} ${p3}${p7}${p8}`);

    console.log(text)

    document.getElementById(`snip-preview-${editorId}`).innerHTML = text;
    document.getElementById(`${editorId}`).innerHTML = text;
  };

  const updatePreviewInput = (matchEmoji) => {
    document.getElementById(`snip-write-${editorId}`).value = matchEmoji;
    const text = converter.makeHtml(document.getElementById(`snip-write-${editorId}`).value);
    replaceSnippet(text);
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

        document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('emoji-dropdown');
        currentFocus = 0;

        const matchEmoji = insertEmoji(currentEmojiContent, textarea.value);

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
        let textVal = textarea.value;
        textVal = textVal.slice(0, startSelection) + currentEmojiHTML + textVal.slice(endSelection);
        const matchEmoji = textVal;

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

  const utilValues = () => {
    let emojiVal;
    const textVal = document.getElementById(`snip-write-${editorId}`).value;
    const diff = endSelection - startEmo;
    if (diff >= 0 && diff <= 40) {
      emojiVal = textVal.slice(startEmo - 1, endSelection);
    } else {
      emojiVal = textVal.slice(endSelection);
    }
    const emojis = Emojis();
    const filtered = emojis.filterEmojiIcons(emojiVal, editorId);
    const regex1 = /(:)([a-z0-9+-_]*)/g;
    const match = regex1.test(emojiVal);

    return [match, filtered];
  };

  const insertEmojiOnEnterKey = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    textarea.addEventListener('keydown', (e) => {
      const [match, filtered] = utilValues();

      if (match && filtered.content_length > 0 && e.keyCode === 13) {
        const currentEmojiIdHTML = document.getElementById(`emoji-${currentFocus}-${editorId}`).innerHTML;
        const currentEmojiIdContent = currentEmojiIdHTML.split(' ')[0];
        document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('emoji-dropdown');
        currentFocus = 0;

        const matchEmoji = insertEmoji(currentEmojiIdContent, textarea.value);
        updatePreviewInput(matchEmoji);
        textarea.setSelectionRange(startSelection, endSelection);

        e.preventDefault();
      }

      if (match && filtered.content_length > 0) {
        if (e.keyCode === 40 || e.keyCode === 38) {
          e.preventDefault();
        }
      }
    });
  };

  const dropDownEmoji = (e) => {
    const filterEmojiArea = document.querySelector(`.filter-emoji-area-${editorId}`);
    const [match, filtered] = utilValues();

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

  const insertEmojijiOnKeyEvent = () => {
    const textarea = document.getElementById(`snip-write-${editorId}`);
    textarea.addEventListener('keyup', (e) => {
      const [textareaValue, regex] = [textarea.value, /(:)([a-z0-9+-_]*)/g];
      dropDownEmoji(e);

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

      text = converter.makeHtml(e.target.value);
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

        const selectMode = (textarea.selectionStart === textarea.selectionEnd) ? 'end' : 'preserve';

        let selected = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        const selection2 = textarea.value.slice(start - range[0], end + range[1]);
        if (selected.match(snipReg)) {
          selected = selected.replace(snipReg, (_, p1, p2) => ((id === `link-${editorId}`) ? (p1.replace(/\[/, '') + p2.replace(p2, ' ')) : p2));
        } else if (selection2.match(snipReg)) {
          start = textarea.selectionStart - range[0];
          end = textarea.selectionEnd + range[1];
        } else if ([`bold-${editorId}`, `italic-${editorId}`, `code-${editorId}`].includes(id)) {
          selected = `${snipSym}${selected.trim()}${snipSym} `;
        } else if ([`link-${editorId}`].includes(id)) {
          selected = `[${selected.trim()}](url) `;
        } else {
          selected = `${snipSym}${selected}`;
        }

        textarea.focus();
        textarea.setRangeText(selected, start, end, selectMode);
        text = converter.makeHtml(textarea.value);
        replaceSnippet(text);
        e.preventDefault();
      });
    });

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

  const execEditorCommand = (prop) => {
    if (Utils.extendDefaults(prop).inTextEmoji) {
      insertEmojijiOnKeyEvent();
    }

    if (Utils.extendDefaults(prop).buttonEmoji) {
      insertEmojiOnEmojiAreaClick();
    }

    insertAllTextOnInput();

    btnExecuteCommand();
  };

  return { execEditorCommand };
};

export default ExecCmdButton;