import Utils from './utils';

const snipText = () => {
  const defaultTextarea = document.querySelector('textarea.snip-text');

  const markDown = (...args) => {
    let options = {};
    if (args[0] && typeof args[0] === 'object') {
      options = Utils.extendDefaults(args[0]);
    }
  };

  return { markDown };
};

export default snipText;