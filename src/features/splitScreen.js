// import { expandHeight } from './utils/computedProps';
import { toggleToolbarOnResize } from '../dom/appendHeaderToDOM';
import {
  displayWordCount,
  nothingToPreviewDisplay,
} from '../helpers/helpers';

const gheditorMinorContainers = (editorId) => ([
  `gheditor-writearea-${editorId}`,
  `gheditor-preview-${editorId}`,
  `gheditor-text-body-${editorId}`,
  `gheditor-text-tabnav-buttons-${editorId}`,
  `${editorId}--mirror-div`,
  `gheditor-text-header-content-${editorId}`,
  `gheditor-upload-container-${editorId}`,
  `gheditor-autosave-${editorId}`,
  `button-container-toggle-${editorId}`,
]);

const gheditorMainContainers = (editorId) => ([
  `gheditor-write-${editorId}`,
  `gheditor-preview-${editorId}`,
]);

const scrollSync = (editorId) => {
  const fixedDiv = document.getElementById(gheditorMainContainers(editorId)[0]);
  const scrollableDiv = document.getElementById(gheditorMainContainers(editorId)[1]);

  fixedDiv.addEventListener('scroll', () => {
    scrollableDiv.scrollTop = fixedDiv.scrollTop
      * ((scrollableDiv.scrollHeight - scrollableDiv.clientHeight)
        / (fixedDiv.scrollHeight - fixedDiv.clientHeight));
  });
};

const heightSync = (editorId, prop) => {
  const gheditorPreview = document.querySelector(`#gheditor-preview-${editorId}.preview`);
  if (gheditorPreview !== null) {
    const gheditorPreviewStyle = {
      // height: gheditorWriteHeight.clientHeight,
      minHeight: prop.minHeight,
      maxHeight: prop.maxHeight,
      padding: '6px 20px',
    };
    Object.assign(gheditorPreview.style, gheditorPreviewStyle);
  }
};

const mutateTextFeaturesOnToggle = (editorId, gheditorWriteHeight) => {
  const gheditorMiContainers = gheditorMinorContainers(editorId);
  gheditorMiContainers.forEach(container => {
    const containerDOM = document.getElementById(container);
    if (containerDOM !== null) {
      containerDOM.classList.toggle('preview');
    }
  });

  const textarea = document.getElementById(`gheditor-write-${editorId}`);

  const gheditorMaContainers = gheditorMainContainers(editorId);

  document.getElementById(gheditorMaContainers[1]).style.height = `${textarea.clientHeight}px`;

  const body = document.getElementById(`gheditor-text-body-${editorId}`);
  if (![...body.classList].includes('preview')) {
    gheditorWriteHeight.focus();
  }
};

const splitScreen = (editorId, prop) => {
  const previewBut = document.querySelector(`.gheditor-preview-button-${editorId}`);
  if (prop.splitScreen.enabled) {
    previewBut.style.display = 'initial';

    const gheditorWriteHeight = document.getElementById(`gheditor-write-${editorId}`);
    previewBut.addEventListener('click', () => {
      displayWordCount(editorId);
      nothingToPreviewDisplay(editorId);
      document.getElementById(`gheditor-word-count-${editorId}`).classList.toggle('remove');

      mutateTextFeaturesOnToggle(editorId, gheditorWriteHeight);

      heightSync(editorId, prop);

      toggleToolbarOnResize(editorId);
    });

    scrollSync(editorId);
  } else {
    previewBut.style.display = 'none';
  }
};

export default splitScreen;
