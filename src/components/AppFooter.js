import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>

        <span className="ms-1">&copy; 2024 BAC</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Feliciano Mosquera</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
