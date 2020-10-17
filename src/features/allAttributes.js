/* eslint-disable no-prototype-builtins */
import extendDefaults from '../settings/customOptionSetting';

const isAllowed = (obj, content, args) => {
  let allContent = content;
  if (obj.hasOwnProperty(args[0])) {
    allContent = allContent.concat(args[1]);
  }

  if (obj.hasOwnProperty(args[2])) {
    allContent = allContent.filter((attr) => args[3].indexOf(attr) < 0);
  }

  return allContent;
};

const getAllAllowedAttributes = (attributes, prop) => {
  const { allowedAttributes } = extendDefaults(prop);
  const { disallowedAttributes } = extendDefaults(prop);
  const args = ['allowedAttributes', allowedAttributes, 'disallowedAttributes', disallowedAttributes];

  return isAllowed(extendDefaults(prop), attributes, args);
};

const getAllAllowedTags = (tags, prop) => {
  const { allowedTags } = extendDefaults(prop);
  const { disallowedTags } = extendDefaults(prop);

  const args = ['allowedTags', allowedTags, 'disallowedTags', disallowedTags];

  return isAllowed(extendDefaults(prop), tags, args);
};

export { getAllAllowedAttributes, getAllAllowedTags };