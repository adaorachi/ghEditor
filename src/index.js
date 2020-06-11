import Utils from './utils';
import ToggleTab from './toggleTab';
import ExecCmdButton from './execCmdButton';

import styles from './styles.css';

const snipText = () => {
  const defaultTextarea = document.querySelector('textarea.snip-markdown');

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
      snipMarkDown.className = 'snip-text-mark-down';
      areaParentEle.append(snipMarkDown);

      const snipTextBody = document.createElement('div');
      const snipTextArea = document.createElement('textarea');
      const snipPreviewArea = document.createElement('div');

      const defaultTextClassName = Utils.concatClassName(defaultTextarea);
      snipTextBody.className = 'snipTextBody';
      Utils.textBody(snipTextBody);

      snipTextArea.id = 'snip-write';
      snipTextArea.className = `meme snip-write snip-tab-content tab-content active ${defaultTextClassName}`;
      Utils.textBody(snipTextArea, true, false);

      snipPreviewArea.id = 'snip-preview';
      snipPreviewArea.className = `snip-preview snip-tab-content tab-content ${defaultTextClassName}`;
      Utils.textBody(snipPreviewArea, true, true);

      snipTextBody.append(snipTextArea);
      snipTextBody.append(snipPreviewArea);

      window.addEventListener('load', () => {
        snipPreviewArea.style.minHeight = `${snipTextArea.clientHeight}px`;
        Utils.containerStyles(args[0]);
        const exec = ExecCmdButton();
        exec.execCmd('.buttons');
        ToggleTab.toggle('snipText-tabnav-tabs');
      });

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'snipText-button-container';

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
  buttons: 'heading|bold|italic|underline|strikethrough|quote-left|code|link|list-ul|list-ol|check-square|question-circle|jnsda',
  // buttonBgColor: '#eee'
  // frameStyles: { color: 'red', borderRadius: '10px' },
};

const sniptext = snipText();
sniptext.markDown(opt);