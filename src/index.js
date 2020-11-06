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

const ghEditor = () => {
  let optionVal = {};
  let editorId;
  let initialSetVal = '';
  const syncValue = () => {
    syncValueFunc(editorId);
  };

  const outputData = (editorId, args) => {
    outputDataFunc(editorId, args);
  };

  const getValue = () => getMarkdown(editorId, optionVal);

  const getOptions = () => extendDefaults(optionVal);

  const getDefaultOptions = () => extendDefaults({});

  const getOption = (key) => getOptionFunc(key, optionVal);

  const setValue = (data) => {
    setValueFunc(data, editorId);
    initialSetVal = data;
  };

  const markDown = (...args) => {
    const val = textareaVal(args);
    // eslint-disable-next-line prefer-destructuring
    optionVal = val[1];

    const [defaultTextarea, options] = textareaVal(args);

    if (defaultTextarea !== null) {
      editorId = options.container;

      appendElementToDOM(editorId, options, defaultTextarea);

      window.addEventListener('load', () => {
        callFuncOnInit(editorId, options, initialSetVal);

        outputData(editorId, options);
      });

      window.addEventListener('resize', () => {
        toggleToolbarOnResize(editorId);
        removeSplitScreenOnResize(editorId);
      });
    }
  };

  return {
    markDown,
    getValue,
    syncValue,
    setValue,
    getOptions,
    getOption,
    getDefaultOptions,
  };
};

export default ghEditor;