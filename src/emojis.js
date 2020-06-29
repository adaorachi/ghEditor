import * as emoji from './emoji.json';

const Emojis = () => {
  const getEmojiIcons = (editorId) => {
    let emojiIcons = '';
    const allEmojis = Object.values(emoji)[0];
    emojiIcons += `<div class="snip-emoji-area-content snip-emoji-area-content-${editorId}">`;
    Object.entries(allEmojis).forEach((icon) => {
      const key = icon[0];
      const value = icon[1];
      emojiIcons += `<span class="${key} emoji-area-button emoji-area-button-${editorId}" title="${key}" id="${key}-${editorId}">${value}</span>`;
    });
    emojiIcons += '</div>';
    return emojiIcons;
  };

  const filterEmojiIcons = (ele, editorId) => {
    const allEmojis = Object.entries(Object.values(emoji)[0]);
    try {
      const filterEmoji = allEmojis.filter((item) => item[0].match(ele)).sort((a, b) => {
        const x = a[0];
        const y = b[0];
        // eslint-disable-next-line no-nested-ternary
        return x < y ? -1 : x > y ? 1 : 0;
      }).slice(0, 5);

      let dropDownSuggester = `<ul class="emoji-suggester emoji-suggester-${editorId}">`;
      filterEmoji.forEach((emo, index) => {
        dropDownSuggester += `<li role="option" data-emoji-name="${emo[0]}" class="display-emoji display-emoji-${editorId} emoji-${index}" id="emoji-${index}-${editorId}" aria-selected="false">${emo[1]} ${emo[0]}</li>`;
      });
      dropDownSuggester += '</ul>';

      return {
        content: dropDownSuggester,
        content_length: filterEmoji.length,
      };
    } catch (e) {
      return {
        content: '',
        content_length: 0,
      };
    }
  };

  return { getEmojiIcons, filterEmojiIcons };
};

export default Emojis;