// import extendDefaults from '../settings/customOptionSetting';
import firebaseSetting from '../settings/firebaseSetting';
import { insertWriteInput } from './textArea/updateEditorArea';
import { fileInput, progressStatusText } from '../dom/insertDomSnippet';

let insertImage = 0;
const setCaret = (editorId) => {
  const textarea = document.getElementById(`gheditor-write-${editorId}`);

  ['input', 'click'].forEach(event => {
    textarea.addEventListener(event, () => {
      insertImage = textarea.selectionEnd;
    });
  });
};

const callUploaded = (fileUpload, editorId, prop) => {
  const textarea = document.getElementById(`gheditor-write-${editorId}`);

  const storageRef = firebaseSetting(prop).storage().ref().child(fileUpload.name);
  const uploadedImage = storageRef.put(fileUpload);
  const progressStatus = document.getElementById(`upload-image-progress-${editorId}`);
  let repl;
  const insertImageSelected = insertImage;
  const lineBreak = '\n';
  uploadedImage.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if (progress === 0) {
      let textVal = textarea.value;
      repl = `![uploading ${fileUpload.name} ... ]()${lineBreak}`;
      textVal = `${textVal.slice(0, insertImageSelected)}${repl}${textVal.slice(insertImage)}`;
      insertWriteInput(textVal, editorId, prop);
      progressStatus.innerHTML = progressStatusText();
    }
  }, (error) => {
    // eslint-disable-next-line no-console
    console.log(error.message);
    progressStatus.innerHTML = 'Error uploading file!';
  }, () => {
    uploadedImage.snapshot.ref.getDownloadURL().then((downloadURL) => {
      let textVal = textarea.value;
      const str = repl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = RegExp(str);
      const uploadedImage = `![${fileUpload.name}](${downloadURL})${lineBreak}`;
      if (regex.test(textVal)) {
        textVal = textVal.replace(repl, uploadedImage);
        insertWriteInput(textVal, editorId, prop);
        progressStatus.innerHTML = 'Attach files by dragging and dropping or selecting them';
        const uploadInput = document.getElementById(`gheditor-uploadimage-${editorId}`);
        uploadInput.value = '';
      }
    });
  });
};

const dragImageHighlight = (editorId, fileInput) => {
  const fileInputContainer = document.querySelector(`.gheditor-footer-${editorId}`);
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileInput.addEventListener(eventName, () => {
      if (['dragenter', 'dragover'].includes(eventName)) {
        fileInputContainer.classList.add('highlight');
      } else {
        fileInputContainer.classList.remove('highlight');
      }
    });
  });
};

const imageInputAttr = (fileInputContainer, editorId) => {
  const uploadProgress = document.createElement('div');
  uploadProgress.id = `gheditor-upload-container-${editorId}`;
  uploadProgress.className = 'gheditor-upload-container';
  uploadProgress.innerHTML = fileInput(editorId);
  fileInputContainer.append(uploadProgress);
};

const removeImageBorder = (fileInputContainer, prop) => {
  if (prop.uploadImage.enabled || prop.autoSave.enabled) {
    fileInputContainer.classList.add('enabled');
  } else {
    fileInputContainer.classList.remove('enabled');
  }
};

const uploadImage = (editorId, prop) => {
  const fileInputContainer = document.querySelector(`.gheditor-footer-${editorId}`);

  if (prop.uploadImage.enabled) {
    setCaret(editorId);
    imageInputAttr(fileInputContainer, editorId);

    const fileInput = document.getElementById(`gheditor-uploadimage-${editorId}`);

    fileInput.addEventListener('change', (e) => {
      const fileUpload = e.target.files[0];
      callUploaded(fileUpload, editorId, prop);
    });

    fileInput.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const { files } = dt;
      const fileUpload = files[0];
      callUploaded(fileUpload, editorId, prop);
      e.preventDefault();
      e.stopPropagation();
    });

    dragImageHighlight(editorId, fileInput);
  }

  removeImageBorder(fileInputContainer, prop);
};

export default uploadImage;
