import sanitizeHtml from 'sanitize-html';
import showdown from 'showdown';
import { getAllAllowedAttributes, getAllAllowedTags } from './allAttributes';
import highlightCode from './highlightCode';
import {
  replaceSnippet,
  insertQuote,
} from './textArea/insertTextUtils';

const converter = new showdown.Converter();
converter.setFlavor('github');
converter.setOption({
  emoji: false,
  openLinksInNewWindow: true,
  underline: true,
  smoothLivePreview: true,
});

const getMarkdown = (editorId, prop) => {
  const textarea = document.getElementById(`gheditor-write-${editorId}`);
  const text = textarea.value;
  const attr = ['class', 'id', 'href', 'align', 'alt', 'target', 'src'];
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'span', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'details', 'summary', 'figure'];
  const sanitizedText = sanitizeHtml(text, {
    allowedAttributes: {
      '*': getAllAllowedAttributes(attr, prop),
    },
    allowedTags: getAllAllowedTags(tags, prop),
  });

  let text1 = insertQuote(sanitizedText);
  text1 = converter.makeHtml(text1);
  text1 = replaceSnippet(text1, prop);
  text1 = highlightCode(text1, prop);

  return text1;
};

export default getMarkdown;