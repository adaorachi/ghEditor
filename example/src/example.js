// import snipDown from 'snipdown';
import snipDown from '../../src/index';
import '../../scss/style.scss';

const opt = {
  container: 'snip1',
  // width: '30%',
  // minHeight: '100px',
  // maxHeight: '300px',
  placeholder: "What's on your mind ...",
  // allowedTags: ['h1', 'h2', 'h3', 'ul', 'li', 'ol'],
  // disallowedTags: ['p'],
  allowedAttributes: ['style'],
  // buttonBgColor: '#eee'
  // frameStyles: { color: 'red', borderRadius: '10px' },
  // autoSave: {
  //   enabled: true,
  //   delay: 3000,
  // },
  headerToolbar: {
    // icons: 'heading|bold|italic|',
    iconSize: '16',
  },
  uploadImage: {
    config: { storageBucket: 'snip-editor.appspot.com' },
  },
  toolTip: {
    enabled: true,
  },
};

const sniptext1 = snipDown();
sniptext1.markDown(opt);
// sniptext1.setValue('# This is me');
// console.log(sniptext1.getValue());

const sniptext2 = snipDown();
sniptext2.markDown({ container: 'snip2' });

// const sniptext3 = snipDown;
// sniptext3.markDown({container: 'snip3'});