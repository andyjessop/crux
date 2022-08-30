import { selectToggleButtonActions, selectToggleButtonData } from '../features/dark-mode-toggle/dark-mode-toggle-button.selectors';
import { selectUserData } from '../features/users/user.selectors';

export const views = {
  toggleButton: {
    root: 'top-left',
    selectActions: selectToggleButtonActions,
    selectData: selectToggleButtonData,
    factory: () => import('../features/dark-mode-toggle/dark-mode-toggle-button.view').then(mod => mod.createToggleButtonView),
  },
  user: {
    root: 'top-right',
    selectData: selectUserData,
    factory: () => import('../features/users/user.view').then(mod => mod.createUserView),
  }
}