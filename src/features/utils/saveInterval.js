import { setDataToStorage } from './setStorage';

const setIntervalTimers = [];

const setStorageInterval = (editorId, props) => {
  let timer = null;
  if (props.autoSave.enabled) {
    timer = setInterval(() => {
      setDataToStorage(editorId);
    }, props.autoSave.delay);
    setIntervalTimers.push(timer);
  }
  return timer;
};

const stopStorageInterval = () => {
  setIntervalTimers.forEach(timer => {
    clearInterval(timer);
  });
};

export { setStorageInterval, stopStorageInterval };