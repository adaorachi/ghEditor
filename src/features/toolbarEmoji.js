import { insertWriteInput } from './textArea/updateEditorArea';
// import setCaretOnEmojiInsert from './utils/setCaretOnEmojiInsert';

let startSelection = 0;
let endSelection = 0;

function setCaretOnEmojiInsert(editorId) {
  const textarea = document.getElementById(`snip-write-${editorId}`);
  textarea.addEventListener('input', () => {
    startSelection = textarea.selectionStart;
    endSelection = textarea.selectionEnd;
  });
  textarea.addEventListener('click', () => {
    startSelection = textarea.selectionStart;
    endSelection = textarea.selectionEnd;
  });
}

const toolbarEmoji = (editorId, prop) => {
  const textarea = document.getElementById(`snip-write-${editorId}`);
  setCaretOnEmojiInsert(editorId);
  const startEmo = endSelection;

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains(`emoji-area-button-${editorId}`)) {
      const { id } = e.target;
      const currentEmojiHTML = document.getElementById(id).innerText;
      let textVal = textarea.value;
      textVal = textVal.slice(0, startSelection) + currentEmojiHTML + textVal.slice(endSelection);
      const matchEmoji = textVal;

      insertWriteInput(matchEmoji, editorId, prop);
      textarea.setSelectionRange(startEmo, startEmo);
    }
  });
};

export default toolbarEmoji;
