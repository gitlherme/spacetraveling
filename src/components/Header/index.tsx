import Link from 'next/link';
import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={commonStyles.container}>
        <div className={commonStyles.content}>
          <div className={styles.logo}>
            <Link href="/">
              <a>
                <img src="/logo.svg" alt="logo" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
