import config from '../config'
import { Footer } from 'antd/lib/layout/layout'
import { Link } from 'react-router-dom'
import { getRedirectPath } from '@/access'
import styles from './index.less'

export default ({ children }: any) => {
  return (
    <>
      <main className={styles.passportContainer}>
        <div className={styles.passportContent}>
          <div className={styles.passportTop}>
            {/* 标题 */}
            <Link to={getRedirectPath()} className={styles.passportHeader}>
              <img className={styles.passportLogo} src={config.logo} alt="图标" />
              <h1 className={styles.passportTitle}>{config.title}</h1>
            </Link>
            {/* 描述 */}
            <div className={styles.passportDesc}>{config.description}</div>
          </div>
          <div className={styles.passportMain}>{children}</div>
        </div>
        {/* 页脚 */}
        <Footer className={styles.passportFooter}>{config.copyright}</Footer>
      </main>
    </>
  )
}
