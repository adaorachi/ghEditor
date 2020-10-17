/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';
import extendDefaults from '../settings/customOptionSetting';

const syncHighlightCode = (lang, code) => {
  const lang1 = lang === 'html' ? 'xml' : lang;
  try {
    hljs.registerLanguage(lang1, require(`highlight.js/lib/languages/${lang1}`));
    const highlightedCode = hljs.highlight(lang1, code).value;
    return highlightedCode.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/'/g, '&#039;');
  } catch (err) {
    return code;
  }
};

const highlightCode = (text, prop) => {
  if (extendDefaults(prop).highlightCode) {
    text = text.replace(/(<code class=")([a-z]+)(\s+[^>]*>)([\S\s]*?)(<\/code>)/g, (_, p1, p2, p3, p4, p5) => p1 + p2 + p3 + syncHighlightCode(p2, p4) + p5);

    text = text.replace(/(<pre><code>)([\S\s]*?)(<\/code><\/pre>([\n\s]+))(<p>{: .language-)([a-z]+)(}<\/p>)([\n]*)/g, (_, p1, p2, p3, p4, p5, p6) => p1 + syncHighlightCode(p6, p2) + p3);
  }
  return text;
};

export default highlightCode;