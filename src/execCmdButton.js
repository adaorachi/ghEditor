import marked from 'marked';
import Utils from './utils';
import * as emoji from './emoji.json';

const ExecCmdButton = () => {
  const outputSnippet = (text) => {
    text = text.replace(/(<p>)([\S\s]*?)(<\/p>)/g, (_, p1, p2, p3) => p1 + p2.replace(/\n/g, '<br>') + p3);
    text = text.replace(/(<li>)(<input[^>]*>)([\S\s]*?)(<\/li>)/g, (_, p1, p2, p3, p4) => p1.replace(p1, '<li class="task-list-item">') + p2 + p3 + p4);

    document.getElementById('snip-preview').innerHTML = text;
    document.querySelector('.snip-markdown').innerHTML = text;
  };

  const execCmd = (button) => {
    const textarea = document.getElementById('snip-write');
    const textAreaHeight = document.getElementById('snip-write').clientHeight;
    let text;
    textarea.addEventListener('input', (e) => {
      const v = document.getElementById('snip-write').value;
      const regex = /:[a-z]+/g;
      const n = v.replace(regex, (match) => {
        if (emoji[match] !== undefined) {
          return emoji[match];
        }
        return match;
      });

      document.getElementById('snip-write').value = n;

      text = marked(e.target.value);
      outputSnippet(text);

      textarea.style.height = `${Utils.expandHeight(textarea.value, textAreaHeight)}px`;
    });
    const allButtons = document.querySelectorAll(button);
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

        outputSnippet(text);

        e.preventDefault();
      });
    });
  };

  return { execCmd };
};

export default ExecCmdButton;