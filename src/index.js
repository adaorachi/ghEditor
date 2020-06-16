import Utils from './utils';
import ToggleTab from './toggleTab';
import ExecCmdButton from './execCmdButton';

import styles from './styles.css';

const snipText = () => {
  const markDown = (...args) => {
    let options = {};
    if (args[0] && typeof args[0] === 'object') {
      options = Utils.extendDefaults(args[0]);
    }

    const defaultTextarea = document.querySelector(`textarea#${options.id}`);
    const defaultAvatar = document.querySelector('.snip-markdown-avatar');

    if (defaultTextarea !== null) {
      const editorId = options.id;
      const areaParentEle = defaultTextarea.parentElement;
      areaParentEle.style.width = options.width;
      defaultTextarea.style.display = 'none';

      const snipMarkDown = document.createElement('div');
      const snipTextContainer = document.createElement('div');
      snipTextContainer.className = `snip-text-container snip-text-container-${editorId}`;
      snipMarkDown.className = `snip-text-mark-down snip-text-mark-down-${editorId}`;
      snipMarkDown.id = `snip-text-mark-down-${editorId}`;

      // if (defaultAvatar !== null) {
      //   const avatarSrc = defaultAvatar.getAttribute('src');
      //   const avatar = document.createElement('img');
      //   avatar.setAttribute('src', avatarSrc);
      //   snipTextContainer.append(avatar);
      // }
      snipTextContainer.append(snipMarkDown);
      areaParentEle.append(snipTextContainer);

      const snipTextBody = document.createElement('div');
      const snipTextArea = document.createElement('textarea');
      const snipPreviewArea = document.createElement('div');

      const displayEmoji = document.createElement('div');
      displayEmoji.className = `filter-emoji-area filter-emoji-area-${editorId}`;

      const defaultTextClassName = Utils.concatClassName(defaultTextarea, editorId);
      snipTextBody.className = `snip-text-body snip-text-body-${editorId}`;
      snipTextBody.id = 'snip-text-body';

      snipTextArea.id = `snip-write-${editorId}`;
      snipTextArea.className = `snip-write snip-write-${editorId} snip-tab-content-${editorId} snip-tab-content tab-content active ${defaultTextClassName}`;
      snipTextArea.placeholder = 'Leave your comment';

      snipPreviewArea.id = `snip-preview-${editorId}`;
      snipPreviewArea.className = `snip-preview snip-preview-${editorId} snip-tab-content-${editorId} snip-tab-content tab-content ${defaultTextClassName}`;

      snipTextBody.append(snipTextArea);
      snipTextBody.append(displayEmoji);
      snipTextBody.append(snipPreviewArea);

      window.addEventListener('load', () => {
        snipPreviewArea.style.minHeight = `${snipTextArea.clientHeight}px`;
        Utils.toggleEmojiArea(args[0]);
        Utils.containerStyles(args[0], editorId);
        const exec = ExecCmdButton(editorId);
        exec.execEditorCommand(args[0]);
        ToggleTab.toggle(`snip-text-tabnav-tabs-${editorId}`, editorId);
      });

      const buttonContainer = document.createElement('div');
      buttonContainer.className = `snip-text-header snip-text-header-${editorId}`;

      snipMarkDown.append(buttonContainer);
      Utils.displayButtons(args[0]);
      snipMarkDown.append(snipTextBody);
    }
  };

  return { markDown };
};

export default snipText;


const opt = {
  id: 'snip1',
  // width: '30%',
  // height: 'auto',
  buttons: 'heading|bold|italic|underline|strikethrough|quote-left|code|link|list-ul|list-ol|check-square',
  // buttonBgColor: '#eee'
  // frameStyles: { color: 'red', borderRadius: '10px' },
};

const sniptext = snipText();
sniptext.markDown(opt);

const sniptext2 = snipText();
sniptext2.markDown({ id: 'snip2' });

const sniptext3 = snipText();
sniptext3.markDown({ id: 'snip3', width: '30%' });