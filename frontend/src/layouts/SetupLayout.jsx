import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SetupHeader from '../components/setup/SetupHeader'
import useAuth from '../hooks/auth/useAuth'


function SetupLayout() {

  const [showHeader, setShowHeader] = useState(true)

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden font-sans shell-bg">

      {showHeader && <SetupHeader />}

      <div className="flex-1 w-full flex flex-col justify-center items-center px-6 pb-20 z-10 -mt-10">
        <div className="w-full max-w-[440px] flex flex-col items-center">

          <Outlet />

        </div>
      </div>

    </div>
  )
}

export default SetupLayout