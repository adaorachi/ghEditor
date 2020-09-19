// import snipDown from 'snipdown';
import snipDown from '../../src/index';
import '../../scss/style.scss';

const opt = {
  container: 'snip-1',
  width: '30%',
  // minHeight: '100px',
  placeholder: 'A message ...',
  // allowedTags: ['h1', 'h2', 'h3', 'ul', 'li', 'ol'],
  // disallowedTags: ['p'],
  allowedAttributes: ['style'],
  // maxHeight: '300px',
  // buttonBgColor: '#eee'
  // frameStyles: { color: 'red', borderRadius: '10px' },
  autoSave: {
    enabled: true,
    delay: 3000,
  },
  // headerToolbar: {
  //   icons: 'heading|bold|italic|',
  //   iconSize: '16',
  // },
  uploadImageConfig: {
    storageBucket: 'snip-editor.appspot.com',
  },
  toolTip: {
    enabled: true,
  },
};

const sniptext2 = snipDown;
sniptext2.markDown(opt);