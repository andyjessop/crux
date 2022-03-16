import styles from './layout.module.scss';
import React from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { selectLayout } from '../../modules/layout/selectors';


export const Layout: React.FC = () => {
  const {
    main, nav, sidebar
  } = useSelector(selectLayout);

  const rootClass = cx(
    styles.layout,
    sidebar ? undefined : styles['sidebar-closed'],
  );

  return (
    <div className={rootClass}>
      {nav ? <div data-region="nav" className={styles.nav}>Nav</div> : null}
      {sidebar ? <div data-region="sidebar" className={styles.sidebar}>Sidebar</div> : null}
      {main ? <div data-region="main" className={styles.main}>Main</div> : null}
    </div>
  );
}
