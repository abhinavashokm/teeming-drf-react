import { useNavigate } from 'react-router-dom'

const useNavigateWithToast = () => {
  const navigate = useNavigate()

  return ({path, message, error=false, replace=false}) => {
    navigate(path, {
      state: { toast: { message, type: error? "error" : "success" } },
      replace,
    })
  }
}

export default useNavigateWithToast