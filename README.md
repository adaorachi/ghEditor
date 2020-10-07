## SnipDown - MarkDown Editor

SnipDown is a lightweight, flexible, highly customizable WYSIGWG for your web applications. It is a drop-in JavaScript textarea replacement for writing beautiful and understandable Markdown. The WYSIWYG-esque editor allows users who may be less experienced with Markdown to use familiar toolbar buttons and shortcuts. If you never have written a single line in markdown markup, don't worry, it's easy to learn and even easier to use. You'll probably be surprised how handy it is once you get used to it. And you'll miss it whenever the tech you're using doesn't support markdown.


### Demo
See [**Live Demo**](https://adaorachi.github.io/snipdown-demo/)

<img src="https://adaorachi.github.io/snipdown_emojis/demo/snipdown-demo.gif" alt="snipdown-demo">

### Why use SnipDown Editor?

SnipDown is one of the first markdown editors to implement an all-in-one built-in autosaving, custom-designed-icons, code-highlighting, emoji-integrated, height-auto-grow, split-screen-preview and file upload and storage WYSIWYG-style features. It is also designed to mimic [github.com](https://github.com) markdown editor features and implements most Github flavoured markdown syntax and much more.
In other words, SnipDown uses and produces almost all Github markdowns and their equivalent HTML markups and solves the problem of having a Github-flavored markdown editor embedded in your web application just by a simple installation; plus SnipDown can be rendered natively on more than one textarea container in a web page.
SnipDown Editor has been written using vanilla JavaScript, no additional frameworks required.

### Table of Contents

- [Installation](#installtion)
- [Quick Start](#quick-start)
- [Useful methods](#useful-methods)
- [Configuration](#configuration)
- [Toolbar icons and keyboard shortcuts](#shortcuts)
- [Contributing](#contributing)


### Installation

##### Via npm.

    npm install snipDown


##### Via jsDelivr. Please note, jsDelivr may take a few days to update to the latest release.

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/snipdown/latest/snipdown.min.css">
    <script src="https://cdn.jsdelivr.net/snipdown/latest/snipdown.min.js"></script>


### Quick Start
In order to import the stylesheet for this module and use the module from within JavaScript, you need to install and add the [style-loader](https://webpack.js.org/loaders/style-loader) and [css-loader](https://webpack.js.org/loaders/css-loader) to your module configuration.

`npm install style-loader css-loader --save-dev`

Also you need to install and add the sass-loader and sass.

`npm install sass-loader sass --save-dev`


And then, webpack is also needed to configure the SASS settings.

`npm install webpack --save-dev`

Add the SASS module into your module configuration, which is usually in the `webpack.config.js` file.

  ```
  module.exports = {
    module: {
      rules: [
      {
        test: /\.s[ac]ss|.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
    },
  };
  ```

After installing and defining the above dependencies, you can initialize SnipDown by the following ways;

1. Define a textarea element in an HTML page. A `class` of `snip-markdown` must be added to the textarea element. Add an `id` attribute of your choice (this is optional if there is only one textarea to apply).
``` 
<textarea class="snip-markdown" id="textarea-1"></textarea>
```

2. Import the scss file that is bundled with the snipdown module into your index.js file. This file add all required and pre-defined styles needed for any Snipdown editor. Depending on where you index.js file is located, you have to specify the path of the scss module file. In this case we assume that the index.js file is inside the src folder.

```
import '../node_modules/snipdown/scss/style.scss';
```

3. To initialize snipdown for the first textarea on a page

- **Node**

      var snipDown  = require('snipDown');
      const sniptext = snipDown();
      sniptext.markDown();

    - **ES6**

          import snipDown from 'snipDown';
          const sniptext = snipDown();
          sniptext.markDown();

- **Browser**

      <script>
        var snipdown = snipdown();
        sniptext.markDown();
      </script>

4. To initialize for a specific textarea or for mutiple textarea containers in a page.
    _Note that an object is needed to be passed in and set the 'container' value to the 'id' of the textarea container. This can be applied with the initialize methods stated above._
    For example:

    - **ES6**

          import snipDown from 'snipDown';
          const sniptext = snipDown();
          sniptext.markDown({container: 'textarea-1'});


### Useful methods
The following self-explanatory methods may be of use while developing with SnipDown.

#### Get the textarea value

      sniptext.getValue()
      
#### Set the textarea value
      
      sniptext.setValue('This text will appear in the editor')

#### Sync snipdown editor value to default textarea
This is considered useful when it is called in an action takes place like an event listener. Note that this is automatically called when the form which has the default textarea is submitted.

      syncValue()

#### Getting an option

SnipDown provides a method to retrieve;

- a set option

      var anOption = snipDown.getOption('optionKey');
    
- all options

      var allOptions = snipDown.getOptions();

#### Retrieve the default options

You can get snipDown's default options with:

      var defaultOptions = snipDown.getDefaultOptions();

### Configuration

The following are the set of valid options that can be used in SnipDown. When the SnipDown editor is loaded, it inherit the following computed styles from the default textarea - 'fontSize, color, fontFamily, margin, padding'. These styles can be overwritten and more styling properties can be added with the **frameStyles** option.

- **autoUseFontAwesome:** (Boolean) This defaults to `false` which intelligently check whether [Font Awesome](https://fontawesome.com/) (used for icons) has already been included in a web app, and if not, it installs it accordingly. If set to `false`, prevents installation. When set to `true`, Font Awesome icons can be added in the textarea input just like you would in an HTML markup, e.g - `<i class="fa fas-smiley"></i>`.
- **autoSave:** (Object) This saves the textarea content that is being written and will load it back in the future or when the page is refreshed. The saved input or text is automatically cleared when the form it's contained in is submitted. SnipDown automatically uses the textarea `id` as the unique string identifier for its saved content. Do ensure that each textarea has a unique `id`.
  - **enabled:** (Boolean) If set to `true`, autosaves the text and also provides a save button which when clicked saves content instantly. It also shows the saved timestamp. Defaults to `false`.
  - **delay:** (Number) Delay between saves, in milliseconds. Defaults to 10000 (10s).
- **allowedAttributes:** (Array) This receives a list of HTML attribute that should be allowed to be parsed into HTML markup for sanitizing. Here is the default array - `['class', 'id', 'href', 'align', 'alt', 'target', 'src']`
- **allowedTags:** (Array) This receives a list of HTML tags that should be allowed to be parsed into HTML markup for sanitizing. Here is the default array - `['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'span', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'details', 'summary', 'figure']`,
- **disallowedAttributes:** (Array) This receives a list of HTML attributes that should not be allowed to be parsed into HTML markup for sanitizing. It defaults to an empty array.
- **disallowedTags:** (Array) This receives a list of HTML tags that should not be allowed to be parsed into HTML markup for sanitizing. It defaults to an empty array.
- **blockStyles:** (Object) This defines and customize the markdown syntax for how certain buttons that style blocks of text behave.
  - **bold:** (String) Can be set to ** or __. Defaults to **.
  - **code:** (String) Can be set to \`\`\` or ~~~. Defaults to ```.
  - **italic:** (String) Can be set to * or _. Defaults to _.
- **frameStyles:** (Object) This is contains a key-pair-values of styling properties and their equivalent values that should be applied to the textarea. The styling syntax must be written just like it would in JavaScript and not in CSS. E.g - Instead of `font-family: 1rem`, it should be `fontSize: '1rem'`.
- **headerToolbar:** (Object) This defines the toolbar icons used for editing contents in the editor.
  - **icons:** (String) The following is the complete set of icon names in SnipDown, - 
  `heading|bold|italic|blockquote|strikethrough|horizontal-rule|code|link|code-block|unordered-list|ordered-list|tasklist|mention|image|table`.
  By default, snipDown only include the following subset of icon names - `heading|bold|italic|blockquote|strikethrough|code|link|code-block|unordered-list|ordered-list|tasklist|`.
  Other icon names from the complete set and not included in the subset above can be added to it or removed likewise. To define a subset of icon names, it must be separated with a `|`, e.g - `heading|bold|italic`. And the equivalent icons are displayed in the order their names are defined.
- **hideToolBar:** (Boolean) This hides the toolbar when set to `true` and display it when set to `false`. It defaults to `false`. Should this option be set to `true`, it is recommended that the **splitScreenShortcut** option be set to `true`. This is to enable users toggle the preview panel by keyboard shortcuts, since the preview button is not displayed.
- **highlightCode:** (Boolean) If set to `true`, will highlight code syntax using [highlight.js](https://github.com/isagalaev/highlight.js) and otherwise if set to `false`. Defaults to `true`.
- **indentWithTab:** (Boolean) If set to `true`, indent content using tabs. Defaults to `false`. When set to true, it is important to be aware of your web app users navigation preference. Navigating with tabs in the web page can no longer be possible.
- **inlineAttributes:** (Boolean) Defaults to `false`. If set to `true`, it allows defining CSS classes, and elements IDs and attributes that are enclosed in curly braces - `{}`. In order to use this, Classes are defined with a period like so - `.class-1`. Ids are defined with an hash symbol - `#id-1`. Other attributes are defined just like you would for any HTML tag, like so - `aria-label="true"`. Note that for this to work, these attributes must be defined just below the line of text it will be applied to and ensure a empty line is left after it. E.g - 
    ```
    Paragraph
    {: .class .class-1 .class-2}

    Paragraph
    {: #custom-id}
    ```
- **inlineEmoji:** (Object) This sets the emoji container in the editor textarea with the first five filtered emoji icons and names when the **emojiPrefix** is inputted and the subsequent characters after it, considering that the inputted characters has an equivilant emoji name and there is no space or the Enter key is not hit.
  - **enabled:** (Boolean) If set to `false`, disables the inlineEmoji. Defaults to `true`.
  - **emojiPrefix:** (String) This sets a character that is inputted followed by the name of the emoji. When inputted, SnipDown recognizes it as the emoji prefix and the emoji suggester dropdown is made visible. The emoji prefix must be picked from the following set of prefixes - `[':', '-', '/', '!', '#', '$', '&', '*', '=', '+', '^']`. It defaults to `:`.
- **inlineToolbar:** (String) This sets an inline icon names. It defines a handy minature version of the toolbar buttons. The dropdown is made visible by making a selection in the editor textarea. It is usually used to set the most frequently used toolbar buttons and can take a maximum of 6 buttons. To define a subset of icon names, it must be separated with a `|`, e.g - `heading|bold|italic`. To disable this, set the value to an empty string. It default to the subset - `heading|bold|italic|code|link|unordered-list`.
- **inlineShortcut** (Boolean) When set to `true` defines keyboard shortcuts for the **headerToolbar** buttons. See below for the list of all available keyboard shortcuts and buttons. It defaults to `false`.
- **maxHeight:** (String) This set the maximum height of the snipDown editor in any available CSS height values,  e.g - `px, rem, %, initial`. If sets to `auto` will have no max-height and SnipDown editor height elongates on input. Defaults to `auto`.
- **minHeight:** (String) This set the minimum height of the snipDown editor in any available CSS height values, e.g - `px, rem, %, initial`. It defaults to `100px`.
- **placeholder:** (String) This sets a custom placeholder that should be displayed.
- **splitScreen:** (Object) This enables a screen split feature.
  - **enabled:** (Boolean) If set to `true`, includes a split-screen button in the toolbar. When the split-screen button is clicked, splits the SnipDown editor into SnipDown textarea and SnipDown preview screens. This enables a real time WYSIWYG-style. It defaults to `false`.
  - **shortcut:** (Boolean) If set to `true` sets the following keyboard shortcut (ctrl/cmd + alt + P ) to toggle into the split screen feature and out. It defaults to `false`.
- **toolbarEmoji:** (Boolean) If set to `true`, includes a emoji button in the toolbar. When the emoji button is clicked, it displays a dropdown of all available emojis. This is an alternative to the **inlineEmoji** feature. It defaults to `false`.
- **toolTip:** (Object) This displays icon tooltips, an informational text box when a toolbar icon is hovered on.
  - **enabled:** (Boolean) If set to `false`, disable toolbar button tooltips. Defaults to `true`.
  - **toolTipText:** (Object) This defines a key-pair-value of icon names and their respective tooltip text. A list of the tooltip texts is seen in the **Toolbar** section.
- **uploadImage:** (Object) This defines the upload image feature. This is configured to use the [google firebase](https://firebase.google.com/) storage bucket. In order to make this feature work, you must create a [firebase](https://firebase.google.com/) storage bucket for your app and have access to its configurtion.
   - **enabled:** (Boolean) If set to `true`, enables the upload image feature.Defaults to `false`.
    - **config:** (Object) This includes the firebase configuration which can be copied from your firebase app console. The only detail needed is the `storageBucket` value.
- **width:** (String) This set the width of the snipDown editor in any available CSS width values, e.g - `px, rem, %, initial`. It defaults to `100%`.


```
const snipdown = snipDown();
snipdown.markDown({
    container: 'snip-text',
    autoSave: {
      enabled: false,
      delay: 10000,
    },
    autoUseFontAwesome: true,
    blockStyles: {
      bold: '**',
      italic: '_',
      'code-block': '```',
    },
    frameStyles: {
      fontSize: '1rem',
    },
    headerToolbar: {
      icons: 'heading|bold|italic|quote|code|link|code-square|list-unordered|list-ordered|tasklist|',
    },
    hideToolBar: false,
    highlightCode: true,
    indentWithTab: false,
    inlineEmoji: {
      enabled: true,
      emojiPrefix: ':',
    },
    inlineToolbar: 'heading|bold|italic|code|link|list-unordered',
    inlineShortcut: false,
    maxHeight: 'auto',
    minHeight: '100px',
    placeholder: 'Leave your comment....',
    splitScreen: {
      enabled: true,
      shortcut: true,
    },
    toolbarEmoji: true,
    toolTip: true,
    uploadImage: {
      enabled: true,
      config: {
         storageBucket: '<your-firebase-app-name>.appspot.com',
      },
    },
    width: '100%',
});
```

### Toolbar icons and keyboard shortcuts
Below are the custom-designed built-in toolbar icons (only some of which are enabled by default), which can be reorganized however you like. "Name" is the name of the icon, referenced in the SnipDown editor. "Class" is the SnipDown class names given to the icon. "Tooltip" is the informational text box (via the title="" attribute) that appears when a button is hovered on tooltip that appears. "Shortcut" is the combination of keyboard keys that reflect the exact action of what the button does.

| Name            | Class                     | Tooltip                  | Shortcut         |
|:----------------|:------------------------- |:-------------------------|:-----------------|
| smiley          | snip-down-smiley          | Insert an emoji          | None             |
| screen-split    | snip-down-screen-split    | Toggle Preview           | Ctrl + alt + P   |
| heading         | snip-down-heading         | Add header text          | Ctrl + H         |
| bold            | snip-down-bold            | Add bold text            | Ctrl + B         |
| italic          | snip-down-italic          | Add italic text          | Ctrl + I         |
| strikethrough   | snip-down-strikethrough   | Add a strikethrough text | Ctrl + $         |
| horizontal-rule | snip-down-horizontal-rule | Add an horizontal rule   | None             |
| quote           | snip-down-quote           | Insert a quote           | Ctrl + >         |
| code            | snip-down-code            | Insert code              | Ctrl + `         |
| link            | snip-down-link            | Add a link               | Ctrl + L         |
| code-square     | snip-down-code-square     | Insert code block        | Ctrl + "         |
| list-unordered  | snip-down-list-unordered  | Add a bulleted list      | Ctrl + U         |
| list-ordered    | snip-down-list-ordered    | Add a numbered list      | Ctrl + O         |
| tasklist        | snip-down-tasklist        | Add a tasklist           | Ctrl + -         |
| mention         | snip-down-mention         | Mention a Github user    | Ctrl + @         |
| image           | snip-down-image           | Add an image             | Ctrl + M         |
| table           | snip-down-table           | Insert a table           | Ctrl + #         |
| help            | snip-down-help            | Help                     | None             |


Shortcuts are automatically converted between platforms. If you define a shortcut as "Cmd-B", on PC that shortcut will be changed to "Ctrl-B". Conversely, a shortcut defined as "Ctrl-B" will become "Cmd-B" for Mac users.



### Automated Tests
There are no automated tests for this plugin. It will be added as a future implementation.

### Contributing

If you wish to contribute please read the following quick guide.

#### Want a Feature?
You can request a new feature by submitting an issue. If you would like to implement a new feature feel free to issue a Pull Request.


#### Pull requests (PRs)
PRs are awesome. However, before you submit your pull request consider the following guidelines:

 - Search GitHub for an open or closed Pull Request that relates to your submission. You don't want to duplicate effort.
 - When issuing PRs that change code, make your changes in a new git branch based on master:

   ```bash
   git checkout -b my-fix-branch master
   ```

 - Documentation (i.e: README.md) changes can be made directly against master.
 - Run the full test suite before submitting and make sure all tests pass (obviously =P).
 - Refrain from fixing multiple issues in the same pull request. It's preferable to open multiple small PRs instead of one hard to review big one.
 - After your pull request is merged, you can safely delete your branch.

If you have time to contribute to this project, we feel obliged that you get credit for it.
These rules enable us to review your PR faster and will give you appropriate credit in your GitHub profile.
We thank you in advance for your contribution!
