import './styles/variables.scss';
import './styles/normalise.css';
import './styles/main.scss';
import 'animate.css';
import { xapp } from '@crux/xapp';
import { toasterSlice, toasterView } from './features/toaster/toaster.index';
import { layoutSlice, layoutView } from './layout/layout.index';
import { routerSlice } from './shared/router/router.index';
import { darkModeSlice, darkModeView } from './features/dark-mode/dark-mode.index';
import { navSlice, navView } from './features/nav/nav.index';

main();

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw 'No root found!!';
  }

  const slices = [
    layoutSlice,
    navSlice,
    routerSlice,
    toasterSlice,
    darkModeSlice,
  ];

  const views = [
    layoutView,
    navView,
    toasterView,
    darkModeView,
  ];

  const app = xapp({
    root,
    slices,
    views,
  });
}