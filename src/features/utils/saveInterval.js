import extendDefaults from '../../settings/customOptionSetting';
import { setDataToStorage } from './setStorage';

const setIntervalTimers = [];

const setStorageInterval = (editorId, props) => {
  let timer = null;
  if (extendDefaults(props).autoSave.enabled) {
    timer = setInterval(() => {
      setDataToStorage(editorId);
    }, extendDefaults(props).autoSave.delay);
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