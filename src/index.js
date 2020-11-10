import extendDefaults from './settings/customOptionSetting';
import { toggleToolbarOnResize, removeSplitScreenOnResize } from './dom/appendHeaderToDOM';
import {
  syncValueFunc,
  setValueFunc,
  getOptionFunc,
  outputDataFunc,
} from './methods/pluginMethods';
import appendElementToDOM from './dom/appendElement';
import callFuncOnInit from './functionCall/callFuncOnInit';
import textareaVal from './functionCall/textareaVal';
import getMarkdown from './features/getMarkdown';
// import './scss/style.scss';

class ghEditor {
  constructor() {
    this.optionVal = {};
    this.editorId;
    this.initialSetVal = '';
  }

  syncValue() {
    return syncValueFunc(this.editorId);
  }

  outputData(editorId, args) {
    outputDataFunc(editorId, args);
  }

  getValue() {
    return getMarkdown(this.editorId, this.optionVal);
  }

  getOptions() {
    return extendDefaults(this.optionVal);
  }

  getDefaultOptions() {
    return extendDefaults({});
  }

  getOption(key) {
    return getOptionFunc(key, this.optionVal);
  }

  setValue(data) {
    setValueFunc(data, this.editorId);
    this.initialSetVal = data;
  };

  markDown(...args) {
    const val = textareaVal(args);
    // eslint-disable-next-line prefer-destructuring
    this.optionVal = val[1];

    const [defaultTextarea, options] = textareaVal(args);

    if (defaultTextarea !== null) {
      this.editorId = options.container;

      appendElementToDOM(this.editorId, options, defaultTextarea);

      window.addEventListener('load', () => {
        callFuncOnInit(this.editorId, options, this.initialSetVal);

        this.outputData(this.editorId, options);
      });

      window.addEventListener('resize', () => {
        toggleToolbarOnResize(this.editorId);
        removeSplitScreenOnResize(this.editorId, options);
      });
    }
  };
}

export default ghEditor;