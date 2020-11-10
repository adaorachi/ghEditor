## GHEditor - MarkDown Editor

GHEditor is a lightweight, flexible, highly customizable markdown editor for your web applications. It is a drop-in JavaScript textarea replacement for writing beautiful and understandable Markdown. <br><br>GHEditor allows users who may be less experienced with Markdown to use familiar toolbar buttons and shortcuts. If you never have written a single line in markdown markup, don't worry, it's easy to learn and even easier to use. You'll probably be surprised how handy it is once you get used to it. And you'll miss it whenever the tech you're using doesn't support markdown.


### Why use GHEditor?

GHEditor is one of the first markdown editors to implement an all-in-one cloud-based file-storage, built-in autosaving, custom-designed-icons, code-highlighting, emoji-integrated, height-auto-grow and split-screen-preview features.<br>It is also designed to clone [Github](https://github.com)'s markdown editor features and implements most Github flavoured markdown syntax and much more.<br>In other words, GHEditor uses and produces almost all Github markdowns and their equivalent HTML markups and solves the problem of having a Github-flavored markdown editor embedded in your web application just by a simple installation.<br>Plus, GHEditor can be rendered natively on more than one textarea elements in a web page. It also uses a simple HTML-sanitizer to produce safe tags.<br>GHEditor Editor has been written using vanilla JavaScript, no additional frameworks required.


### Demo
See [**Live Demo**](https://adaorachi.github.io/ghEditor-demo/)

<img src="https://adaorachi.github.io/gheditor_emojis/demo/ghEditor-demo.gif" alt="ghEditor-demo">

### Table of Contents

- [Installation](#installtion)
- [Quick Start](#quick-start)
- [Useful methods](#useful-methods)
- [Configuration](#configuration)
- [Toolbar icons and keyboard shortcuts](#shortcuts)
- [Contributing](#contributing)


### Installation

##### Via npm.

    npm install gheditor


##### Via jsDelivr. Please note, jsDelivr may take a few days to update to the latest release.

    <script src="https://cdn.jsdelivr.net/gh/adaorachi/ghEditor@1.7/@gheditor/dist/main.js"></script>


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

After installing and defining the above dependencies, you can initialize ghEditor by the following steps;

1. Define a textarea element in an HTML page. A `class` of `ghEditor` must be added to the textarea element.

2. Add an `id` attribute of your choice (this is optional). When no `id` attribute is added, ghEditor is initialized on the first textarea in a page and that has a class of `ghEditor`.

``` 
<textarea class="ghEditor" id="textarea-1"></textarea>
```

3. Initialize ghEditor in a JS file
- **To initialize ghEditor for the first textarea on a page**

  - **Node**

        const ghEditor  = require('gheditor');
        const ghEditorText = ghEditor();
        ghEditorText.markDown();

      - **ES6**

            import ghEditor from 'gheditor';
            const ghEditorText = ghEditor();
            ghEditorText.markDown();

  - **Browser**

        <script>
          document.addEventListener('DOMContentLoaded', function () {
            const ghEditorText = ghEditor();
            ghEditorText.markDown();
          })
        </script>

- **To initialize ghEditor for a specific textarea or for mutiple textarea elements in a page.**
    _An object is needed to be passed as a param and set the 'container' value to the 'id' of the textarea container. When no container key/value is added, it defaults to the first textarea element in a web page.
    The above can be applied with the initialize methods stated above._
    For example:

    - **ES6**

          import ghEditor from 'gheditor';
          const ghEditorText = ghEditor();
          ghEditorText.markDown({container: 'textarea-1'});


### Useful methods
The following self-explanatory methods may be of use while developing with GHEditor.

#### Get the text content of the editor
###### *Note that this method should be called when an action takes place; like a submit event listener in order to get the full content.*

      const ghEditorText = ghEditor();
      ghEditorText.getValue()
      
#### Set the text content of the editor
###### *Note: When autosave option is set to true, the content of the editor will be overwritten when a change is made and saved.*
      const ghEditorText = ghEditor();
      ghEditorText.setValue('This text will appear in the editor')

#### Sync gheditor editor value to default textarea
###### *This syncs the text content of the editor to the default textarea and returns the content. Note that this method should be called when an action takes place; like a submit event listener in order to get the full content.*

      const ghEditorText = ghEditor();
      ghEditorText.syncValue()

#### Getting option

GHEditor provides a method to retrieve;
Note: Log the variable to the console to see result.

- a set option

      const ghEditorText = ghEditor();
      const anOption = ghEditorText.getOption(<optionKey>);
    
- all custom options

      const ghEditorText = ghEditor();
      const allOptions = ghEditorText.getOptions();

#### Retrieve the default options

You can get ghEditor's default options with:

      const ghEditorText = ghEditor();
      const defaultOptions = ghEditorText.getDefaultOptions();

### Configuration

The following are the set of valid options that can be used in GHEditor. When the GHEditor editor is loaded, it inherit the following computed styles from the default textarea - 'fontSize, color, fontFamily, margin, padding'. These styles can be overwritten and more styling properties can be added with the **frameStyles** option.

- **autoUseFontAwesome:** (Boolean) This defaults to `false` which intelligently check whether [Font Awesome](https://fontawesome.com/) (used for icons) has already been included in a web app, and if not, it installs it accordingly. If set to `false`, prevents installation. When set to `true`, Font Awesome icons can be added in the textarea input just like you would in an HTML markup, e.g - `<i class="fa fas-smiley"></i>`.
- **autoSave:** (Object) This saves the textarea content that is being written and will load it back in the future or when the page is refreshed. The saved input or text is automatically cleared when the form it's contained in is submitted. GHEditor automatically uses the textarea `id` as the unique string identifier for its saved content. Do ensure that each textarea has a unique `id`.
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
- **frameStyles:** (Object) This contains a key-pair-values of style properties and their equivalent values that should be applied to the textarea. The styling syntax must be written just like it would in JavaScript and not in CSS. E.g - Instead of `font-family: 1rem`, it should be `fontSize: '1rem'`.
- **headerToolbar:** (Object) This defines the toolbar icons used for editing contents in the editor.
  - **icons:** (String) The following is the complete set of icon names in GHEditor, - 
  `heading|bold|italic|blockquote|strikethrough|horizontal-rule|code|link|code-block|unordered-list|ordered-list|tasklist|mention|image|table`.
  By default, ghEditor only include the following subset of icon names - `heading|bold|italic|blockquote|strikethrough|code|link|code-block|unordered-list|ordered-list|tasklist|`.
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
  - **emojiPrefix:** (String) This sets a character that is inputted followed by the name of the emoji. When inputted, GHEditor recognizes it as the emoji prefix and the emoji suggester dropdown is made visible. The emoji prefix must be picked from the following set of prefixes - `[':', '-', '/', '!', '#', '$', '&', '*', '=', '+', '^']`. It defaults to `:`.
- **inlineToolbar:** (String) This sets an inline icon names. It defines a handy minature version of the toolbar buttons. The dropdown is made visible by making a selection in the editor textarea. It is usually used to set the most frequently used toolbar buttons and can take a maximum of 6 buttons. To define a subset of icon names, it must be separated with a `|`, e.g - `heading|bold|italic`. To disable this, set the value to an empty string. It default to the subset - `heading|bold|italic|code|link|unordered-list`.
- **inlineShortcut** (Boolean) When set to `true` defines keyboard shortcuts for the **headerToolbar** buttons. See below for the list of all available keyboard shortcuts and buttons. It defaults to `false`.
- **maxHeight:** (String) This set the maximum height of the ghEditor editor in any available CSS height values,  e.g - `px, rem, %, initial`. If sets to `max-content` will have no max-height and GHEditor editor height elongates on input. Defaults to `max-content`.
- **minHeight:** (String) This set the minimum height of the ghEditor editor in any available CSS height values, e.g - `px, rem, %, initial`. It defaults to `100px`.
- **placeholder:** (String) This sets a custom placeholder that should be displayed.
- **splitScreen:** (Object) This enables a screen split feature. Note that this feature is automatically disabled on small viewports (>= 550px).
  - **enabled:** (Boolean) If set to `true`, includes a split-screen button in the toolbar. When the split-screen button is clicked, splits the GHEditor editor into GHEditor textarea and GHEditor preview screens. This enables a real time WYSIWYG-style. It defaults to `false`.
  - **shortcut:** (Boolean) If set to `true` sets the following keyboard shortcut (ctrl/cmd + alt + P ) to toggle into the split screen feature and out. It defaults to `false`.
- **toolbarEmoji:** (Boolean) If set to `true`, includes a emoji button in the toolbar. When the emoji button is clicked, it displays a dropdown of all available emojis. This is an alternative to the **inlineEmoji** feature. It defaults to `false`.
- **toolTip:** (Object) This displays icon tooltips, an informational text box when a toolbar icon is hovered on.
  - **enabled:** (Boolean) If set to `false`, disable toolbar button tooltips. Defaults to `true`.
  - **toolTipText:** (Object) This defines a key-pair-value of icon names and their respective tooltip text. A list of the tooltip texts is seen in the **Toolbar** section.
- **uploadImage:** (Object) This defines the upload image feature. This is configured to use the [google firebase](https://firebase.google.com/) storage bucket. In order to make this feature work, you must create a [firebase](https://firebase.google.com/) storage bucket for your app and have access to its configuration.
   - **enabled:** (Boolean) If set to `true`, enables the upload image feature. Defaults to `false`.
    - **config:** (Object) This includes the firebase configuration which can be copied from your firebase app console. The only detail needed is the `storageBucket` option.

```
const gheditor = ghEditor();
gheditor.markDown({
    container: 'ghEditor-text',
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
      enabled: false,
      shortcut: false,
    },
    toolbarEmoji: true,
    toolTip: true,
    uploadImage: {
      enabled: true,
      config: {
         storageBucket: '<your-firebase-app-name>.appspot.com',
      },
    },
});
```

### Toolbar icons and keyboard shortcuts
Below are the custom-designed built-in toolbar icons (only some of which are enabled by default), which can be reorganized however you like. "Name" is the name of the icon, referenced in the GHEditor editor. "Class" is the GHEditor class names given to the icon. "Tooltip" is the informational text box (via the title="" attribute) that appears when a button is hovered on tooltip that appears. "Shortcut" is the combination of keyboard keys that reflect the exact action of what the button does.

| Name            | Class                     | Tooltip                  | Shortcut         |
|:----------------|:------------------------- |:-------------------------|:-----------------|
| smiley          | ghEditor-smiley          | Insert an emoji          | None             |
| screen-split    | ghEditor-screen-split    | Toggle Preview           | Ctrl + alt + P   |
| heading         | ghEditor-heading         | Add header text          | Ctrl + H         |
| bold            | ghEditor-bold            | Add bold text            | Ctrl + B         |
| italic          | ghEditor-italic          | Add italic text          | Ctrl + I         |
| strikethrough   | ghEditor-strikethrough   | Add a strikethrough text | Ctrl + $         |
| horizontal-rule | ghEditor-horizontal-rule | Add an horizontal rule   | None             |
| quote           | ghEditor-quote           | Insert a quote           | Ctrl + >         |
| code            | ghEditor-code            | Insert code              | Ctrl + `         |
| link            | ghEditor-link            | Add a link               | Ctrl + L         |
| code-square     | ghEditor-code-square     | Insert code block        | Ctrl + "         |
| list-unordered  | ghEditor-list-unordered  | Add a bulleted list      | Ctrl + U         |
| list-ordered    | ghEditor-list-ordered    | Add a numbered list      | Ctrl + O         |
| tasklist        | ghEditor-tasklist        | Add a tasklist           | Ctrl + -         |
| mention         | ghEditor-mention         | Mention a Github user    | Ctrl + @         |
| image           | ghEditor-image           | Add an image             | Ctrl + M         |
| table           | ghEditor-table           | Insert a table           | Ctrl + #         |
| help            | ghEditor-help            | Help                     | None             |


Shortcuts are automatically converted between platforms. If you define a shortcut as "Cmd-B", on PC that shortcut will be changed to "Ctrl-B". Conversely, a shortcut defined as "Ctrl-B" will become "Cmd-B" for Mac users.



### Automated Tests
- There are no automated tests for this plugin. It will be added as a future implementation.
- To create a dependent library for the image upload feature using Google firebase.

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
