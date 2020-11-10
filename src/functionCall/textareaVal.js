import extendDefaults from '../settings/customOptionSetting';

const textareaVal = (args) => {
  let defaultTextarea;
  let options;
  if (args[0] && typeof args[0] === 'object') {
    options = extendDefaults(args[0]);
    defaultTextarea = document.querySelector(`textarea.ghEditor#${options.container}`);
    defaultTextarea = defaultTextarea === null ? document.querySelectorAll('textarea.ghEditor')[0] : defaultTextarea;
  } else {
    options = extendDefaults({});

    // eslint-disable-next-line prefer-destructuring
    defaultTextarea = document.querySelectorAll('textarea.ghEditor')[0];
  }

  defaultTextarea.setAttribute('data-editor', options.container);
  return [defaultTextarea, options];
};

export default textareaVal;