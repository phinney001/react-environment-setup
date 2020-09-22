import React from 'react'
import { Link } from 'umi'

import logo from '@/assets/logo.svg'
import styles from './index.less'
import CustomModal from '@/components/CustomModal'

export interface PassportLayoutProps {
  children: React.ReactNode
}

const PassportLayout: React.FC<PassportLayoutProps> = ({ children }) => {
  return (
    <div className={styles.passportContainer}>
      <div className={styles.passportContent}>
        <div className={styles.passportTop}>
          <div className={styles.passportHeader}>
            <Link to="/">
              <img className={styles.passportLogo} src={logo} alt="logo" />
              <span className={styles.passportTitle}>PROJECTNAME</span>
            </Link>
          </div>
          <div className={styles.passportDesc}>PROJECTNAME</div>
        </div>
        <div className={styles.passportMain}>{children}</div>
      </div>
      <CustomModal />
    </div>
  )
}

export default PassportLayout
