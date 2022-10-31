import { html, render } from 'lit';
import { toggle as toggleSwitch } from '../../design/toggle/toggle';

interface Actions {
  toggle(): void;
}

interface Data {
  isDark: boolean;
}

export function createDarkModeView(root: HTMLElement) {
  return function (data: Data, actions: Actions) {
    const { toggle } = actions;
    const { isDark } = data;

    render(
      html`
        ${toggleSwitch({
          isOn: isDark,
          label: 'Toggle dark mode',
          toggle,
        })}
      `,
      root
    );
  };
}
