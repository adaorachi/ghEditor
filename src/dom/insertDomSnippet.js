import { getCurrentTime } from '../helpers/helpers';

const savedTimer = (editorId) => `
  <span class="auto-save-icon" id="auto-save-icon-${editorId}"><img src="https://adaorachi.github.io/snipdown_emojis/toolbar/save.svg" /></span>
  <div id="auto-saved-${editorId}" class="auto-saved">
    <span id="timer-pre-${editorId}">Autosaved:</span>
    <span class="saved-timer" id="saved-timer-${editorId}">${getCurrentTime()}</span>
  </div>`;

const fileInput = (editorId) => `<input type="file"
id="snip-uploadimage-${editorId}" class="snip-uploadimage-input" name="snip-uploadimage-${editorId}">
<span id="upload-image-progress-${editorId}" class="upload-image-progress">Attach files by draggng and dropping or selecting them</span>`;

const progressStatusText = () => '<span class="snip-loader"><img src="https://adaorachi.github.io/snipdown_emojis/toolbar/loader.svg" style="width:20px" /></span> Uploading your files ..';

const headerTabs = (editorId) => `<div class="snip-text-tabnav-tabs-${editorId} snip-text-tabnav-tabs" id="snip-text-tabnav-tabs-${editorId}">
        <div class="snip-text-tabnav-buttons snip-text-tabnav-buttons-${editorId}" id="snip-text-tabnav-buttons-${editorId}">
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav write-tab-nav active" id="snip-writearea-tab-${editorId}" role="tab">Write</button>
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav preview-tab-nav" id="snip-preview-tab-${editorId}" role="tab">Preview</button>
        </div>
      </div>`;

const toggleMoreButton = (editorId, noLength) => `<button type="button" class="buttons toggle-toolbar-button toggle-toolbar-${editorId} display ${noLength}">
<img src="https://adaorachi.github.io/snipdown_emojis/toolbar/typography.svg" />
<img src="https://adaorachi.github.io/snipdown_emojis/toolbar/chevron-up.svg" class="chevron-up" id="chevron-up-${editorId}" />
</button>`;

const displayNoWordCount = (editorId) => `<div class="snip-word-count snip-word-count-${editorId} remove" id="snip-word-count-${editorId}"></div>`;

const headerContent = (arg) => `${headerTabs(arg.editorId)}
<div class="snip-text-header-content snip-text-header-content-${arg.editorId}" id="snip-text-header-content-${arg.editorId}">
<div class="snip-text-button-container remove snip-text-button-container-${arg.editorId}">
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