const Utils = (() => {
  const extendDefaults = (properties) => {
    let defaults = {
      className: 'fade-and-drop',
      width: '100%',
      height: '100px',
      buttons: 'underline|bold|italic',
      buttonBgColor: '#eee',
      buttonColor: '#555',
      frameStyles: {
        border: '1px solid #ced4da',
        borderRadius: '0.25rem',
        color: '#495057',
        // padding: '0.375rem 0.75rem',
      },
    };

    const concatframeStyle = { ...defaults.frameStyles, ...properties.frameStyles };

    Object.keys(properties).forEach((property) => {
      if (property !== 'frameStyles') {
        // eslint-disable-next-line no-prototype-builtins
        if (properties.hasOwnProperty(property)) {
          defaults[property] = properties[property];
        }
      } else {
        defaults[property] = concatframeStyle;
      }
    });

    return defaults;
  };


  return { extendDefaults };
})();

export default Utils;