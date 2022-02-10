import { Region, State } from '../types';
import styles from './layout.module.scss';
import React from 'react';

interface Props {
  regions: Region[];
}

export const Layout: React.FC<Props> = ({ regions }) => {
  console.log(regions);

  return (
    <div className={styles['layout']}>
    </div>
  );
}
