// import snipDown from 'snipdown';
import snip from '../../src/index';
// import snip from '../../src/index';
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
  // frameStyles: { color: 'red', fontSize: '10rem' },
  // autoSave: {
  //   enabled: true,
  //   delay: 3000,
  // },
  headerToolbar: {
    // icons: 'heading|bold|italic|',
  },
  toolTip: {
    enabled: true,
  },
  uploadImage: {
    enabled: true,
    config: { storageBucket: 'snip-editor.appspot.com' },
  },
};

const textarea1 = snip();
textarea1.markDown(opt);
// sniptext1.setValue('# This is me');

// console.log(sniptext1.getValue());
// console.log(sniptext1.getOptions());
// console.log(sniptext1.getDefaultOptions());
// console.log(sniptext1.getOption('autoSave'));

const sniptext2 = snip();
sniptext2.markDown({
  container: 'snip2',
  uploadImage: {
    // enabled: false,
    config: { storageBucket: 'snip-editor.appspot.com' },
  },
});

// const sniptext3 = snipDown;
// sniptext3.markDown({container: 'snip3'});