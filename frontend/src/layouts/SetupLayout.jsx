import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SetupHeader from '../components/setup/SetupHeader'
import useAuth from '../hooks/auth/useAuth'


function SetupLayout() {

  const [centerContent, setCenterContent] = useState(true)
  const { data: currentUser } = useAuth()


  return (
    <div className="h-screen w-full flex flex-col relative font-sans shell-bg">

      {currentUser && <SetupHeader />}

      <div className={`flex-1 w-full flex flex-col items-center px-6 pb-20 z-10 
      ${currentUser ? "-mt-10" : ""}
      ${centerContent
          ? "justify-center"
          : "justify-start pt-15 "
        }`}
      >
        <div className="w-full flex flex-col items-center">

          <Outlet context={{
            setCenterContent,
          }} />

        </div>
      </div>

    </div>
  )
}

export default SetupLayout