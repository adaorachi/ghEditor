import * as firebase from 'firebase/app';
import 'firebase/firebase-storage';
import { extendDefaults } from './utils';

const firebaseSetting = (prop) => {
  const firebaseConfig = extendDefaults(prop).uploadImage.config;
  return !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
};

export default firebaseSetting;