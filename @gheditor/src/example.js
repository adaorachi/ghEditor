// import gheditorDown from 'gheditordown';
import ghEditor from '../../src/index';
// import gheditor from '../../src/index';
import '../../scss/style.scss';

const opt = {
  container: 'gheditor1',
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

const textarea1 = ghEditor();
textarea1.markDown(opt);
textarea1.setValue('# This is me');

// console.log(textarea1.getValue());
// console.log(textarea1.getOptions());
// console.log(textarea1.getDefaultOptions());
// console.log(textarea1.getOption('autoSave'));

const gheditortext2 = ghEditor();
gheditortext2.markDown({
  container: 'gheditor2',
  uploadImage: {
    enabled: true,
    config: { storageBucket: 'snip-editor.appspot.com' },
  },
});

gheditortext2.setValue('# This is me oooo');

// console.log(gheditortext2.getValue());
// console.log(gheditortext2.getOptions());
// console.log(gheditortext2.getDefaultOptions());
// console.log(gheditortext2.getOption('autoSave'));

// const gheditortext3 = gheditorDown;
// gheditortext3.markDown({container: 'gheditor3'});