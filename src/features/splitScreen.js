import { expandHeight } from './utils/computedProps';
import { toggleToolbarOnResize } from '../dom/appendHeaderToDOM';
import {
  displayWordCount,
  nothingToPreviewDisplay,
} from '../helpers/helpers';

const snipMinorContainers = (editorId) => ([
  `snip-writearea-${editorId}`,
  `snip-preview-${editorId}`,
  `snip-text-body-${editorId}`,
  `snip-text-tabnav-buttons-${editorId}`,
  `${editorId}--mirror-div`,
  `snip-text-header-content-${editorId}`,
  `snip-upload-container-${editorId}`,
  `snip-autosave-${editorId}`,
  `button-container-toggle-${editorId}`,
]);

const snipMainContainers = (editorId) => ([
  `snip-write-${editorId}`,
  `snip-preview-${editorId}`,
]);

const scrollSync = (editorId) => {
  const fixedDiv = document.getElementById(snipMainContainers(editorId)[0]);
  const scrollableDiv = document.getElementById(snipMainContainers(editorId)[1]);

  fixedDiv.addEventListener('scroll', () => {
    scrollableDiv.scrollTop = fixedDiv.scrollTop
      * ((scrollableDiv.scrollHeight - scrollableDiv.clientHeight)
        / (fixedDiv.scrollHeight - fixedDiv.clientHeight));
  });
};

const heightSync = (editorId, prop, snipWriteHeight) => {
  const snipPreview = document.querySelector(`#snip-preview-${editorId}.preview`);
  if (snipPreview !== null) {
    const snipPreviewStyle = {
      height: snipWriteHeight,
      minHeight: prop.minHeight,
      maxHeight: prop.maxHeight,
      padding: '6px 20px',
    };
    Object.assign(snipPreview.style, snipPreviewStyle);
  }
};

const mutateTextFeaturesOnToggle = (editorId, snipWriteHeight) => {
  const snipMiContainers = snipMinorContainers(editorId);
  snipMiContainers.forEach(container => {
    const containerDOM = document.getElementById(container);
    if (containerDOM !== null) {
      containerDOM.classList.toggle('preview');
    }
  });

  const snipMaContainers = snipMainContainers(editorId);

  snipMaContainers.forEach(container => {
    const containerArea = document.getElementById(container);
    containerArea.style.height = `${expandHeight(containerArea, snipWriteHeight)}px`;
  });
};

const splitScreen = (editorId, prop) => {
  const previewBut = document.querySelector(`.snip-preview-button-${editorId}`);
  if (prop.splitScreen.enabled) {
    previewBut.style.display = 'initial';

    previewBut.addEventListener('click', () => {
      displayWordCount(editorId);
      nothingToPreviewDisplay(editorId);
      document.getElementById(`snip-word-count-${editorId}`).classList.toggle('remove');

      const snipWriteHeight = document.getElementById(snipMainContainers(editorId)[0]).style.height;

      mutateTextFeaturesOnToggle(editorId, snipWriteHeight);

      heightSync(editorId, prop, snipWriteHeight);

      toggleToolbarOnResize(editorId);
    });

    scrollSync(editorId);
  } else {
    previewBut.style.display = 'none';
    previewBut.nextSibling.style.display = 'none';
  }
};

export default splitScreen;
