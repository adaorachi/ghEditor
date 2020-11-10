import ghEditor from '../../src/index';
import '../../src/scss/style.scss';

const opt = {
  container: 'gheditor1',
  placeholder: "What's on your mind ...",
  allowedAttributes: ['style'],
  autoSave: {
    enabled: false,
    delay: 3000,
  },
  frameStyles: {
  },
  uploadImage: {
    enabled: true,
    config: { storageBucket: 'snip-editor.appspot.com' },
  },
};

const textarea1 = new ghEditor();
textarea1.markDown(opt);
textarea1.setValue('# GhEditor\n\nGhEditor is an all-in-one cloud-enabled file-storage, built-in autosaving, emoji-integrated, preview & split-screen JavaScript-powered HTML5 Markdown editor. An awesome web-based markdown editor!\n- Type some Markdown here\n- See the HTML result in the preview section or click the toolbar toggle button.\n- Magic, right!\n\nYou can also:\n- Use cool emojis just by typing the prefix symbol - : and it autocompletes with a list of emojis to choose from. (**check out this feature in the demo below!**)\n- Attach image files by selecting or dragging and dropping them (**requires your Google Firebase configuration to be linked**)\n- Make use of FontAwesome Icons (**check out this feature in the demo below!**)\n- Autosave your markdown content to in-built storage.\n- Split-screen to see live HTML result as you type.\n- Use inline toolbar. Select this word to see it!\n\n### Instructions on how to use GHEditor in your own application are linked below.\n\n| Site | Links |\n| ------ | ------ |\n| Github | [Repo](https://github.com/adaorachi/ghEditor) |\n| NPM | [Installation](https://www.npmjs.com/package/gheditor) |\n| Github Wiki | [Cheat Sheet](https://github.com/adaorachi/ghEditor/wiki/markdown_cheat_sheet) |\n\nGo ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com). What about a ~~strikethrough~~ text or a direct mention @adaorachi You can type the Markdown syntax, use the header toolbar, utilize the inline toolbar or use shortcuts like `cmd-B`/ `ctrl-B` for bolded text OR `cmd-I`/ `ctrl-I` for italicized text and other available shortcuts.\n\n > Here is a [link](url) to all available keyboard shortcuts for all buttons. \n\n## Lists Unordered lists can be started using the toolbar or by typing `* `, `- `, or `+ `. Ordered lists can be started by typing `1. `.\n#### Unordered\n\n- Lists are a piece of cake\n- I\'m sure you agree with me\n- Indented Tabs work too\n- Haha! I\'m sure you\'re trying it out now.\n\n#### Ordered\n1. Numbered lists...\n2. ...work too!\n\nAnd not just the lists. You should also try the tasklist too.\n\n - [ ] This is super useful for listing tasks.\n\n## What about images?\n![Yes](https://i.imgur.com/sZlktY7.png)');

// console.log(textarea1.getValue());
// console.log(textarea1.getOptions());
// console.log(textarea1.getDefaultOptions());
// console.log(textarea1.getOption('autoSave'));

const gheditortext2 = new ghEditor();
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