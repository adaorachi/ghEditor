## SnipDown - MarkDown Editor

SnipDown is a lightweight, flexible, highly customizable WYSIGWG for your web applications. It is a drop-in JavaScript textarea replacement for writing beautiful and understandable Markdown. The WYSIWYG-esque editor allows users who may be less experienced with Markdown to use familiar toolbar buttons and shortcuts. If you never have written a single line in markdown markup, don't worry, it's easy to learn and even easier to use. You'll probably be surprised how handy it is once you get used to it. And you'll miss it whenever the tech you're using doesn't support markdown.


<p><a href="https://simplemde.com" rel="nofollow"><strong>Demo</strong></a></p>
<p><a href="https://simplemde.com" rel="nofollow"><img src="http://i.imgur.com/zqWfJwO.png" alt="Preview"></a></p>


### Why use SnipDown Editor?

SnipDown is one of the first markdown editors to feature an all-in-one built-in autosaving, code-highlighting, emoji-integrated WYSIWYG-style and file upload and storage. It is also designed to mimic Github markdown editor features and implements all Github flavoured markdown syntax. In other words, SnipDown uses and produces almost all Github markdowns and their equivalnet HTML markups and solves the problem of having a Github markdown editor embedded in your web application just by a simple installation, plus SnipDown can be rendered natively on more than one textarea container in a web page.



### Installation

##### Via npm.

    npm install snipdown


##### Via bower.

    bower install snipdown



##### Via jsDelivr. Please note, jsDelivr may take a few days to update to the latest release.

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/snipdown/latest/snipdown.min.css">
    <script src="https://cdn.jsdelivr.net/snipdown/latest/snipdown.min.js"></script>


### Quick Start
After installing, you can initialize SnipDown by the following ways;

1. On the first textarea on a page

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

2. On a specific textarea or for mutiple textarea containers in a page.
    _Note that an object is needed to be passed in and set the 'container' value to the 'id' of the textarea container. This can be applied with the initialize methods stated above._
    For example:

    - **ES6**

          import snipDown from 'snipDown';
          const sniptext = snipDown();
          sniptext.markDown({container: 'snipdown1'});


### Get the textarea value

      sniptext.getValue()
      
### Set the textarea value
      
      sniptext.setValue('This text will appear in the editor')

### Getting an option

SnipDown provides a method to retrieve;

- a set option

      var anOption = snipDown.getOption('optionKey');
    
- all options

      var allOptions = snipDown.getOptions();

### Retrieve the default options

You can get snipDown's default options with:

      var defaultOptions = snipDown.getDefaultOptions();

### Configuration

The following are the set of valid options that can be used in SnipDown.

- **autoUseFontAwesome:** If set to true, force downloads Font Awesome (used for icons). If set to false, prevents downloading. Defaults to undefined, which will intelligently check whether Font Awesome has already been included, then download accordingly.