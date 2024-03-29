import firebase from 'firebase/app';
import 'firebase/firebase-storage';
import extendDefaults from './customOptionSetting';

const firebaseSetting = (prop) => {
  const firebaseConfig = extendDefaults(prop).uploadImage.config;
  return !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
};

export default firebaseSetting;