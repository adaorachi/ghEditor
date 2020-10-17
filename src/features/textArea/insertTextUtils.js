import extendDefaults from '../../settings/customOptionSetting';

const coupleClass = (attr, prevAttr) => {
  const splitAttr = attr.split(' ');
  const splitPrevAttr = prevAttr.split(' ');
  let concatPrevAttr = '';
  splitPrevAttr.forEach((attr) => {
    if (!(attr.includes('class=') || attr.includes('id='))) {
      concatPrevAttr += attr;
    }
  });
  let classNames = '';
  let ids = '';
  let otherAtt = '';
  splitAttr.forEach((att) => {
    att = att.trim();
    if (att.charAt(0) === '.') {
      classNames += ` ${att.slice(1)}`;
    } else if (att.charAt(0) === '#') {
      ids += ` ${att.slice(1)}`;
    } else {
      otherAtt += att;
    }
  });

  const classNames1 = `class="${classNames.trim()}"`;
  const ids1 = `id="${ids.trim()}"`;
  let attribute = '';
  if (classNames !== '') {
    attribute += `${classNames1}`;
  }
  if (ids !== '') {
    attribute += ` ${ids1}`;
  }

  return `${attribute}${otherAtt}${concatPrevAttr}`;
};

const replacegheditorpet = (text, prop) => {
  if (extendDefaults(prop).inlineAttributes) {
    text = text.replace(/((<br \/>\n)*)({::\s+comment})([\s\S]*?)({:\/comment})((<br \/>\n)*)/g, ' ');

    text = text.replace(/(<p>)(.*)(<br \/>\n)({:\s+)(.+?)(}=?)(<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7) => p1.replace(p1, `<p ${coupleClass(p5, '')}>`) + p2 + p7);

    text = text.replace(/(<p>)({:\s+)(.+?)(}=?)(<br \/>)([\s\S]*?)({:\s+\/})(<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => p1.replace(p1, `<p ${coupleClass(p3, '')}>`) + p6 + p8);

    text = text.replace(/(<a|h1|h2|h3|h4|h5|h6|img)([^>]*)(>.*?)(<\/(h1|h2|h3|h4|h5|h6|a|img)>)(\n<p>|.*)({:\s+)(.+?)(})((.*?)<\/p>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p8, p2)}${p3}${p4}`);

    text = text.replace(/(<li|h1|h2|h3|h4|h5|h6|img|p)([^>]*)(>.*?)({:\s+)(.+?)(})(.*?)(<\/(li|h1|h2|h3|h4|h5|h6|img|p)>)/g, (_, p1, p2, p3, p4, p5, p6, p7, p8) => `${p1} ${coupleClass(p5, p2)} ${p3}${p7}${p8}`);
  }

  return text;
};

const insertQuote = (text) => {
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  return text;
};

export {
  coupleClass,
  replacegheditorpet,
  insertQuote,
};