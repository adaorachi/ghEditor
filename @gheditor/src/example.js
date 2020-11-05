import ghEditor from '../../src/index';
import '../../scss/style.scss';

const opt = {
  container: 'gheditor1',
  placeholder: "What's on your mind ...",
  allowedAttributes: ['style'],
  autoSave: {
    enabled: true,
    delay: 3000,
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
    enabled: false,
    config: { storageBucket: 'snip-editor.appspot.com' },
  },
  autoSave: {
    enabled: false,
    delay: 3000,
  },
});

gheditortext2.setValue('# This is me oooo');

// console.log(gheditortext2.getValue());
// console.log(gheditortext2.getOptions());
// console.log(gheditortext2.getDefaultOptions());
// console.log(gheditortext2.getOption('autoSave'));