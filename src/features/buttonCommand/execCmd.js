import cmdBlock from './cmdBlock';
import { autoUpdatePreviewInput } from '../textArea/updateEditorArea';

const execCmd = (textarea, buttonElement, editorId, prop) => {
  const allButtons = document.querySelectorAll(buttonElement);
  allButtons.forEach((button) => {
    let { id } = button;
    if (id.includes('suggester')) {
      const idSplit = id.split('-');
      idSplit.pop();
      id = idSplit.join('-');
    }

    function blockStyle(style) {
      const str = prop.blockStyles[style];
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
    autoUpdatePreviewInput(editorId, prop);
    button.addEventListener('click', (e) => {
      cmdBlock(textarea, id, blockStyle, idList, e);
    });
  });
};

export default execCmd;