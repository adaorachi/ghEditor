import { createDOMElement } from '../helpers/helpers';

const createElement = (editorId, options) => {
  const gheditorMarkDown = createDOMElement('div', `gheditor-text-mark-down gheditor-text-mark-down-${editorId}`, `gheditor-text-mark-down-${editorId}`);

  const gheditorTextContainer = createDOMElement('div', `gheditor-text-container gheditor-text-container-${editorId}`);

  const gheditorTextBody = createDOMElement('div', `gheditor-text-body gheditor-text-body-${editorId}`, `gheditor-text-body-${editorId}`);

  const gheditorTextAreaContainer = createDOMElement('div', `gheditor-writearea gheditor-writearea-${editorId} gheditor-tab-content gheditor-tab-content-${editorId} tab-content active`, `gheditor-writearea-${editorId}`);

  const gheditorTextAreaParams = [`gheditor-write-${editorId}`, options.placeholder, options.minHeight, options.maxHeight];
  const gheditorTextArea = createDOMElement('textarea', `gheditor-write gheditor-write-${editorId}`, ...gheditorTextAreaParams);

  const gheditorPreviewArea = createDOMElement('div', `gheditor-preview gheditor-preview-${editorId} gheditor-tab-content-${editorId} gheditor-tab-content tab-content`, `gheditor-preview-${editorId}`);

  const displayEmoji = createDOMElement('div', `filter-emoji-area filter-emoji-area-${editorId}`);

  const displayToolbar = createDOMElement('div', `toolbar-button-area toolbar-button-area-${editorId}`);

  const gheditorUploadImage = createDOMElement('div', `gheditor-footer gheditor-footer-${editorId}`);

  const mirrorDiv = createDOMElement('div', `${editorId}--mirror-div gheditor-mirror-div`, `${editorId}--mirror-div`);

  const buttonContainer = createDOMElement('div', `gheditor-text-header gheditor-text-header-${editorId}`);

  // eslint-disable-next-line max-len
  return [gheditorMarkDown, gheditorTextContainer, gheditorTextBody, gheditorTextAreaContainer, gheditorTextArea, gheditorPreviewArea, displayEmoji, displayToolbar, gheditorUploadImage, mirrorDiv, buttonContainer];
};

export default createElement;
