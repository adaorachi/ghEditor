/* eslint-disable max-len */
import { appendToDOM } from '../helpers/helpers';
import createElement from './createElement';
import { appendHeaderToDOM } from './appendHeaderToDOM';

const appendElementToDOM = (editorId, options, defaultTextarea) => {
  const [gheditorMarkDown, gheditorTextContainer, gheditorTextBody, gheditorTextAreaContainer, gheditorTextArea, gheditorPreviewArea, displayEmoji, displayToolbar, gheditorUploadImage, mirrorDiv, buttonContainer] = createElement(editorId, options);

  defaultTextarea.classList.add(editorId);
  defaultTextarea.style.display = 'none';

  defaultTextarea.parentNode.insertBefore(gheditorTextContainer, defaultTextarea);
  gheditorTextContainer.appendChild(defaultTextarea);

  appendToDOM(gheditorTextContainer, gheditorMarkDown);

  const appended = [gheditorTextArea, displayEmoji, displayToolbar, gheditorUploadImage];
  appendToDOM(gheditorTextAreaContainer, ...appended);

  appendToDOM(gheditorMarkDown, ...[buttonContainer, gheditorTextBody]);

  appendHeaderToDOM(options);

  const appended2 = [gheditorTextAreaContainer, gheditorPreviewArea, mirrorDiv];
  appendToDOM(gheditorTextBody, ...appended2);
};

export default appendElementToDOM;