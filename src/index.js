import ToggleTab from './toggleTab';
import Exec from './execMarkdown';
import {
  extendDefaults,
  concatClassName,
  toggleEmojiArea,
  containerStyles,
} from './utils';
import { displayButtons } from './toolbar';

import './styles.css';

const snipText = () => {
  const outputData = (editorId, args) => {
    try {
      const { form } = document.getElementById(editorId);
      form.addEventListener('submit', (e) => {
        let textArea = document.getElementById(editorId).value;
        const snipWrite = document.getElementById(`snip-write-${editorId}`);
        const textAreaHeight = document.querySelector(`.snip-text-body-${editorId}`);
        const exec = Exec(editorId);
        textArea = exec.getMarkdown();
        snipWrite.value = '';
        textAreaHeight.style.height = extendDefaults(args).height;
        console.log(textArea);
        e.preventDefault();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getData = (editorId) => {
    const exec = Exec(editorId);
    console.log(exec.getMarkdown());
    return exec.getMarkdown();
  };

  const markDown = (...args) => {
    let options = {};
    if (args[0] && typeof args[0] === 'object') {
      options = extendDefaults(args[0]);
    }

    const defaultTextarea = document.querySelector(`textarea#${options.id}`);

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

      snipTextContainer.append(snipMarkDown);
      areaParentEle.append(snipTextContainer);

      const snipTextBody = document.createElement('div');
      const snipTextArea = document.createElement('textarea');
      const snipPreviewArea = document.createElement('div');

      const displayEmoji = document.createElement('div');
      displayEmoji.className = `filter-emoji-area filter-emoji-area-${editorId}`;
      const displayToolbar = document.createElement('div');
      displayToolbar.className = `toolbar-button-area toolbar-button-area-${editorId}`;

      const defaultTextClassName = concatClassName(defaultTextarea, editorId);
      snipTextBody.className = `snip-text-body snip-text-body-${editorId}`;
      snipTextBody.id = 'snip-text-body';
      snipTextBody.style.height = options.height;

      snipTextArea.id = `snip-write-${editorId}`;
      snipTextArea.className = `snip-write snip-write-${editorId} snip-tab-content-${editorId} snip-tab-content tab-content active ${defaultTextClassName}`;
      snipTextArea.placeholder = 'Leave your comment';

      snipPreviewArea.id = `snip-preview-${editorId}`;
      snipPreviewArea.className = `snip-preview snip-preview-${editorId} snip-tab-content-${editorId} snip-tab-content tab-content ${defaultTextClassName}`;

      snipTextBody.append(snipTextArea);
      snipTextBody.append(displayEmoji);
      snipTextBody.append(displayToolbar);
      snipTextBody.append(snipPreviewArea);

      window.addEventListener('load', () => {
        snipPreviewArea.style.minHeight = `${snipTextArea.clientHeight}px`;
        toggleEmojiArea(args[0]);
        containerStyles(args[0], editorId);
        const exec = Exec(editorId);
        exec.outputMarkDown(args[0]);
        ToggleTab.toggle(`snip-text-tabnav-tabs-${editorId}`, editorId);
        outputData(editorId, args[0]);
      });

      const buttonContainer = document.createElement('div');
      buttonContainer.className = `snip-text-header snip-text-header-${editorId}`;

      snipMarkDown.append(buttonContainer);
      displayButtons(args[0]);
      snipMarkDown.append(snipTextBody);
    }
  };

  return { markDown, getData };
};

export default snipText;


const opt = {
  id: 'snip1',
  // width: '30%',
  // height: '300px',
  // buttons: 'heading|bold|italic|underline|strikethrough|quote-left|code|link|list-ul|list-ol|check-square',
  // buttonBgColor: '#eee'
  // frameStyles: { color: 'red', borderRadius: '10px' },
};

const sniptext = snipText();
sniptext.markDown(opt);

// document.getElementById('button').addEventListener('click', (e) => {
//   sniptext.getData('snip1');
//   e.preventDefault();
// });



const sniptext2 = snipText();
sniptext2.markDown({ id: 'snip2' });

// const sniptext3 = snipText();
// sniptext3.markDown({ id: 'snip3' });

document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">');
