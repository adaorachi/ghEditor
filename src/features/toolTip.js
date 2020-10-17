import { hideAndDisplayNav } from '../helpers/helpers';

const buttonTooltip = (editorId) => {
  const allButtons2 = document.querySelectorAll(`.buttons.tooltip-${editorId}`);
  allButtons2.forEach((button) => {
    const { id } = button;
    button.addEventListener('mouseover', () => {
      const tooltipAll = `.buttons.tooltip-${editorId}`;
      hideAndDisplayNav(id, tooltipAll, 'active');
    });

    button.addEventListener('mouseleave', () => {
      Array.from(allButtons2).forEach((item) => {
        item.classList.remove('active');
      });
    });
  });
};

export default buttonTooltip;