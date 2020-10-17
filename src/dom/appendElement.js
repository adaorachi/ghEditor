/* eslint-disable max-len */
import { appendToDOM } from '../helpers/helpers';
import createElement from './createElement';
import { appendHeaderToDOM } from './appendHeaderToDOM';

const appendElementToDOM = (editorId, options, defaultTextarea) => {
  const [snipMarkDown, snipTextContainer, snipTextBody, snipTextAreaContainer, snipTextArea, snipPreviewArea, displayEmoji, displayToolbar, snipUploadImage, mirrorDiv, buttonContainer] = createElement(editorId, options);

  defaultTextarea.classList.add(editorId);
  defaultTextarea.style.display = 'none';

  const areaParentEle = defaultTextarea.parentElement;

  appendToDOM(snipTextContainer, snipMarkDown);
  appendToDOM(areaParentEle, snipTextContainer);
  snipTextContainer.prepend(defaultTextarea);

  const appended = [snipTextArea, displayEmoji, displayToolbar, snipUploadImage];
  appendToDOM(snipTextAreaContainer, ...appended);

  appendToDOM(snipMarkDown, ...[buttonContainer, snipTextBody]);

  appendHeaderToDOM(options);

  const appended2 = [snipTextAreaContainer, snipPreviewArea, mirrorDiv];
  appendToDOM(snipTextBody, ...appended2);
};

export default appendElementToDOM;