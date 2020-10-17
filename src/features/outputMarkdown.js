import { inlineToolbar, execInlineShortcut } from './inlineToolbar';
import inlineEmoji from './inlineEmoji';
import toolbarEmoji from './toolbarEmoji';
import { toggleEmojiArea } from './fetchData/fetchEmojis';
import buttonTooltip from './toolTip';
import execCmd from './buttonCommand/execCmd';
import useEvents from './utils/events';
import { updatePreviewInputOnClick } from './textArea/updateEditorArea';
import autoUseFontAwesome from './autoUseFontAwesome';
import uploadImage from './uploadImage';

const outputMarkDown = (editorId, prop) => {
  const textarea = document.getElementById(`snip-write-${editorId}`);

  if (prop.inlineEmoji.enabled) {
    inlineEmoji(textarea, editorId, prop);
  }

  const smiley = document.getElementById(`smiley-${editorId}`);
  if (prop.toolbarEmoji) {
    toolbarEmoji(editorId, prop);
    toggleEmojiArea(editorId);
    smiley.style.display = 'initial';
  } else {
    smiley.style.display = 'none';
    smiley.nextSibling.style.display = 'none';
  }

  autoUseFontAwesome(prop);
  uploadImage(editorId, prop);
  useEvents(textarea, editorId, prop);

  execCmd(textarea, `.buttons.markdown-button-${editorId}`, editorId, prop);

  buttonTooltip(editorId);
  inlineToolbar(prop, editorId, textarea);

  execInlineShortcut(textarea, prop);

  updatePreviewInputOnClick(editorId, prop);
};

export default outputMarkDown;