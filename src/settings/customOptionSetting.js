import defaultOptions from './defaultOptionSetting';

const extendDefaults = (properties) => {
  const defaults = defaultOptions();

  const concatframeStyle = (propKey, childObj) => {
    if (childObj !== undefined) {
      return { ...defaults[propKey][childObj], ...properties[propKey][childObj] };
    }
    return { ...defaults[propKey], ...properties[propKey] };
  };

  Object.keys(properties).forEach((property) => {
    const parentProps = ['frameStyles', 'autoSave', 'headerToolbar', 'blockStyles', 'inlineEmoji', 'toolTip', 'splitScreen', 'uploadImage'];

    // eslint-disable-next-line no-prototype-builtins
    if (defaults.hasOwnProperty(property)) {
      if (parentProps.includes(property)) {
        if (property === 'toolTip') {
          defaults[property].toolTipText = concatframeStyle(property, 'toolTipText');
          defaults[property].enabled = properties[property].enabled;
        } else {
          defaults[property] = concatframeStyle(property);
        }
      } else {
        defaults[property] = properties[property];
      }
    }
  });
  return defaults;
};

export default extendDefaults;