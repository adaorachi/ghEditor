import extendDefaults from '../settings/customOptionSetting';
import { createDOMElement } from '../helpers/helpers';

const createElement = (editorId, options) => {
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

  // eslint-disable-next-line max-len
  return [snipMarkDown, snipTextContainer, snipTextBody, snipTextAreaContainer, snipTextArea, snipPreviewArea, displayEmoji, displayToolbar, snipUploadImage, mirrorDiv, buttonContainer];
};

export default createElement;
