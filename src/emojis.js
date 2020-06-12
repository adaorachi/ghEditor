import * as emoji from './emoji.json';

const Emojis = () => {
  const getEmojiIcons = () => {
    let emojiIcons = '';
    const allEmojis = Object.values(emoji)[0];
    Object.entries(allEmojis).forEach((icon) => {
      const key = icon[0];
      const value = icon[1];
      emojiIcons += `<span class="${key}">${value}</span>`;
    });
    return emojiIcons;
  };


  const filterEmojiIcons = (ele) => {
    const allEmojis = Object.entries(Object.values(emoji)[0]);
    const filterEmoji = allEmojis.filter((item) => item[0].match(ele)).sort((a, b) => {
      const x = a[0];
      const y = b[0];
      // eslint-disable-next-line no-nested-ternary
      return x < y ? -1 : x > y ? 1 : 0;
    }).slice(0, 5);

    let meme = '<ul class="emoji-suggester">';
    filterEmoji.forEach((emo, index) => {
      meme += `<li role="option" data-emoji-name="${emo[0]}" class="display-emoji emoji-${index}" id="${emo[0]}">${emo[0]} ${emo[1]}</li>`;
    });
    meme += '</ul>';
    return meme;
  };

  return { getEmojiIcons, filterEmojiIcons };
};

export default Emojis;