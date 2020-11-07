import { getCurrentTime } from '../helpers/helpers';

const savedTimer = (editorId) => `
  <span class="auto-save-icon" id="auto-save-icon-${editorId}"><img src="https://adaorachi.github.io/gheditor_emojis/toolbar/save.svg" /></span>
  <div id="auto-saved-${editorId}" class="auto-saved">
    <span id="timer-pre-${editorId}">Autosaved:</span>
    <span class="saved-timer" id="saved-timer-${editorId}">${getCurrentTime()}</span>
  </div>`;

const fileInput = (editorId) => `<input type="file"
id="gheditor-uploadimage-${editorId}" class="gheditor-uploadimage-input" name="gheditor-uploadimage-${editorId}" accept="image/*">
<span id="upload-image-progress-${editorId}" class="upload-image-progress">Attach files by dragging and dropping or selecting them</span>`;

const progressStatusText = () => '<span class="gheditor-loader"><img src="https://adaorachi.github.io/gheditor_emojis/toolbar/loader.svg" style="width:20px" /></span> Uploading your files ..';

const headerTabs = (editorId) => `<div class="gheditor-text-tabnav-tabs-${editorId} gheditor-text-tabnav-tabs" id="gheditor-text-tabnav-tabs-${editorId}">
        <div class="gheditor-text-tabnav-buttons gheditor-text-tabnav-buttons-${editorId}" id="gheditor-text-tabnav-buttons-${editorId}">
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav write-tab-nav active" id="gheditor-writearea-tab-${editorId}" role="tab">Write</button>
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav preview-tab-nav" id="gheditor-preview-tab-${editorId}" role="tab">Preview</button>
        </div>
      </div>`;

const toggleMoreButton = (editorId, noLength) => `<button type="button" class="buttons toggle-toolbar-button toggle-toolbar-${editorId} display ${noLength}">
<img src="https://adaorachi.github.io/gheditor_emojis/toolbar/typography.svg" />
<img src="https://adaorachi.github.io/gheditor_emojis/toolbar/chevron-up.svg" class="chevron-up" id="chevron-up-${editorId}" />
</button>`;

const displayNoWordCount = (editorId) => `<div class="gheditor-word-count gheditor-word-count-${editorId} remove" id="gheditor-word-count-${editorId}"></div>`;

const headerContent = (arg) => `${headerTabs(arg.editorId)}
<div class="gheditor-text-header-content gheditor-text-header-content-${arg.editorId}" id="gheditor-text-header-content-${arg.editorId}">
<div class="gheditor-text-button-container remove gheditor-text-button-container-${arg.editorId}">
<div class="button-container-untoggle button-container-untoggle-${arg.editorId}">${arg.appendToggleToolbarButton(arg.editorId, arg.displayCmdBtns[2])}${arg.displayCmdBtns[1]}</div>
${arg.disbandToolbarBtnFeature(arg.editorId, arg.properties, arg.mainButtons)[0]}</div>
${displayNoWordCount(arg.editorId)}
</div>`;

export {
  savedTimer,
  fileInput,
  progressStatusText,
  headerTabs,
  toggleMoreButton,
  headerContent,
};