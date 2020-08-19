import ToggleTab from './toggleTab';
import Exec from './execMarkdown';
import {
  extendDefaults,
  containerStyles,
  expandHeight,
  setEditorTextToStore,
  stopStorageInterval,
  autoSaveOnClicked,
  defaultOptionSnippet,
  appendToDOM,
  createDOMElement,
} from './utils';
import { displayButtons, toggleToolbar } from './toolbar';
import image from '../dist/images/table.svg';


const snipDown = () => {
  let options = {};
  let editorId;
  let initialSetVal = '';

  const syncValue = () => {
    const defaultTextArea = document.getElementById(editorId);
    const exec = Exec(editorId, {});
    defaultTextArea.value = exec.getMarkdown();
    return defaultTextArea.value;
  };

  const outputData = (editorId, args) => {
    try {
      const { form } = document.getElementById(editorId);
      form.addEventListener('submit', (e) => {
        syncValue();
        const snipWrite = document.getElementById(`snip-write-${editorId}`);
        snipWrite.value = '';
        snipWrite.style.height = extendDefaults(args).minHeight;
        window.localStorage.removeItem('snipText');
        stopStorageInterval(editorId);
        e.preventDefault();
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  const getValue = () => {
    const exec = Exec(editorId, {});
    return exec.getMarkdown();
  };

  const getOptions = () => extendDefaults(options);

  const getDefaultOptions = () => extendDefaults({});

  const getOption = (key) => {
    const obj = extendDefaults(options);
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
    return 'Not an option';
  };

  const setValue = (data) => {
    const allText = {};
    allText[editorId] = data;
    localStorage.setItem('snipText', JSON.stringify(allText));
    const snipWrite = document.getElementById(`snip-write-${editorId}`);
    snipWrite.value = data;
    initialSetVal = data;
  };

  const markDown = (...args) => {
    let defaultTextarea;
    if (args[0] && typeof args[0] === 'object') {
      options = extendDefaults(args[0]);
      defaultTextarea = document.querySelector(`textarea.snip-markdown#${options.container}`);
    } else {
      options = extendDefaults({});

      // eslint-disable-next-line prefer-destructuring
      defaultTextarea = document.querySelectorAll('textarea.snip-markdown')[0];
    }

    if (defaultTextarea !== null) {
      editorId = options.container;
      defaultTextarea.classList.add(editorId);

      const areaParentEle = defaultTextarea.parentElement;
      defaultTextarea.style.display = 'none';

      const snipMarkDown = createDOMElement('div', `snip-text-mark-down snip-text-mark-down-${editorId}`, `snip-text-mark-down-${editorId}`);

      const snipTextContainer = createDOMElement('div', `snip-text-container snip-text-container-${editorId}`);

      const snipTextBody = createDOMElement('div', `snip-text-body snip-text-body-${editorId}`, `snip-text-body-${editorId}`);

      const snipTextAreaContainer = createDOMElement('div', `snip-writearea snip-writearea-${editorId} snip-tab-content snip-tab-content-${editorId} tab-content active`, `snip-writearea-${editorId}`);

      const snipTextAreaParams = [`snip-write-${editorId}`, extendDefaults(options).placeholder, options.minHeight, options.maxHeight];
      const snipTextArea = createDOMElement('textarea', `snip-write snip-write-${editorId}`, ...snipTextAreaParams);

      const snipPreviewArea = createDOMElement('div', `snip-preview snip-preview-${editorId} snip-tab-content-${editorId} snip-tab-content tab-content`, `snip-preview-${editorId}`);

      const displayEmoji = createDOMElement('div', `filter-emoji-area filter-emoji-area-${editorId}`);

      const displayToolbar = createDOMElement('div', `toolbar-button-area toolbar-button-area-${editorId}`);

      const snipUploadImage = createDOMElement('div', `snip-footer snip-footer-${editorId}`);

      const mirrorDiv = createDOMElement('div', `${editorId}--mirror-div snip-mirror-div`, `${editorId}--mirror-div`);

      const buttonContainer = createDOMElement('div', `snip-text-header snip-text-header-${editorId}`);

      window.addEventListener('load', () => {
        const textarea = document.getElementById(`snip-write-${editorId}`);

        defaultOptionSnippet(options, editorId, snipUploadImage);
        toggleToolbar(editorId);

        containerStyles(options, editorId);
        const exec = Exec(editorId, options);
        exec.outputMarkDown();
        ToggleTab.toggle(`snip-text-tabnav-tabs-${editorId}`, editorId);
        ToggleTab.togglePreview(editorId, options);

        outputData(editorId, options);
        setEditorTextToStore(editorId, options, initialSetVal);
        exec.uploadImage();
        autoSaveOnClicked(editorId, options);

        const textAreaHeight = textarea.style.height;
        textarea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;
      });

      appendToDOM(snipTextContainer, snipMarkDown);
      appendToDOM(areaParentEle, snipTextContainer);

      const appended = [snipTextArea, displayEmoji, displayToolbar, snipUploadImage];
      appendToDOM(snipTextAreaContainer, ...appended);

      appendToDOM(snipMarkDown, ...[buttonContainer, snipTextBody]);

      displayButtons(options);
      const appended2 = [snipTextAreaContainer, snipPreviewArea, mirrorDiv];
      appendToDOM(snipTextBody, ...appended2);
    }
  };

  return {
    markDown,
    getValue,
    syncValue,
    setValue,
    getOptions,
    getOption,
    getDefaultOptions,
  };
};

export default snipDown;


const opt = {
  container: 'snip-1',
  width: '30%',
  // minHeight: '100px',
  placeholder: 'A message ...',
  // allowedTags: ['h1', 'h2', 'h3', 'ul', 'li', 'ol'],
  // disallowedTags: ['p'],
  allowedAttributes: ['style'],
  // maxHeight: '300px',
  // buttonBgColor: '#eee'
  // frameStyles: { color: 'red', borderRadius: '10px' },
  autoSave: {
    enabled: false,
    delay: 3000,
  },
  uploadImageConfig: {
    storageBucket: 'snip-editor.appspot.com',
  },
  toolTip: {
    enabled: true,
  },
};

// :(?=[a-zA-Z]+)

const snipdown = snipDown();
snipdown.markDown(opt);
// snipdown.setValue('# This is me');
// snipdown.getValue('snip1');
// console.log(snipdown.getOptions());
// console.log(snipdown.getDefaultOptions());

// console.log(snipdown.getOption('minHeight'));


// document.getElementById('button').addEventListener('click', (e) => {
//   console.log(sniptext.syncValue());
//   // e.preventDefault();
// });


// const sniptext2 = snipDown();
// sniptext2.markDown({container: 'snip2'});
// document.getElementById('button').addEventListener('click', (e) => {
//   console.log(sniptext2.syncValue());
//   // e.preventDefault();
// });


// const sniptext3 = snipText();
// sniptext3.markDown({ id: 'snip3' });

// document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">');
