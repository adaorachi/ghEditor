import Utils from './utils';
import ToggleTab from './toggleTab';
import ExecCmdButton from './execCmdButton';

import styles from './styles.css';

const snipText = () => {
  const defaultTextarea = document.querySelector('textarea.snip-markdown');
  const defaultAvatar = document.querySelector('.snip-markdown-avatar');

  const markDown = (...args) => {
    let options = {};
    if (args[0] && typeof args[0] === 'object') {
      options = Utils.extendDefaults(args[0]);
    }

    if (defaultTextarea !== null) {
      const areaParentEle = defaultTextarea.parentElement;
      areaParentEle.style.width = options.width;
      defaultTextarea.style.display = 'none';

      const snipMarkDown = document.createElement('div');
      const snipTextContainer = document.createElement('div');
      snipTextContainer.className = 'snip-text-container';
      snipMarkDown.className = 'snip-text-mark-down';
      snipMarkDown.id = 'snip-text-mark-down';

      if (defaultAvatar !== null) {
        const avatarSrc = defaultAvatar.getAttribute('src');
        const avatar = document.createElement('img');
        avatar.setAttribute('src', avatarSrc);
        snipTextContainer.append(avatar);
      }
      snipTextContainer.append(snipMarkDown);
      areaParentEle.append(snipTextContainer);

      const snipTextBody = document.createElement('div');
      const snipTextArea = document.createElement('textarea');
      const snipPreviewArea = document.createElement('div');

      const defaultTextClassName = Utils.concatClassName(defaultTextarea);
      snipTextBody.className = 'snip-text-body';
      snipTextBody.id = 'snip-text-body';

      snipTextArea.id = 'snip-write';
      snipTextArea.className = `snip-write snip-tab-content tab-content active ${defaultTextClassName}`;
      snipTextArea.placeholder = 'Leave your comment';

      snipPreviewArea.id = 'snip-preview';
      snipPreviewArea.className = `snip-preview snip-tab-content tab-content ${defaultTextClassName}`;

      snipTextBody.append(snipTextArea);
      snipTextBody.append(snipPreviewArea);

      window.addEventListener('load', () => {
        snipPreviewArea.style.minHeight = `${snipTextArea.clientHeight}px`;
        Utils.toggleEmojiArea();
        Utils.containerStyles(args[0]);
        const exec = ExecCmdButton();
        exec.execCmd('.buttons.markdown-button');
        ToggleTab.toggle('snip-text-tabnav-tabs');
      });

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'snip-text-header';

      snipMarkDown.append(buttonContainer);
      Utils.displayButtons(args[0]);
      snipMarkDown.append(snipTextBody);
    }
  };

  return { markDown };
};

export default snipText;


const opt = {
  // className: 'fade-and',
  // width: '30%',
  // height: 'auto',
  buttons: 'heading|bold|italic|underline|strikethrough|quote-left|code|link|list-ul|list-ol|check-square',
  // buttonBgColor: '#eee'
  // frameStyles: { color: 'red', borderRadius: '10px' },
};

const sniptext = snipText();
sniptext.markDown(opt);