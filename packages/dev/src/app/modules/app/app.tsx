import { Link } from '../router';
import styles from './app.module.scss';
import { useSelector } from 'react-redux';
import { selectRoute } from '../router/selectors';

export function App() {
  // eslint-disable-next-line
  // @ts-ignore
  const route = useSelector(selectRoute);

  return (
    <div className={styles['app']}>
      <div>Current route: {JSON.stringify(route)}</div>
      <Link to={{ name: 'user', params: { id: '2' }}} text="User 2" />
    </div>
  );
}

export default App;
