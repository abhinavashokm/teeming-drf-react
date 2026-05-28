const useWelcomeBanner = () => {
  const setWelcome = (slug) => {
    localStorage.setItem(`welcome-${slug}`, JSON.stringify(true))
  }

  const getWelcome = (slug) => {
    return JSON.parse(localStorage.getItem(`welcome-${slug}`))
  }

  const removeWelcome = (slug) => {
    localStorage.removeItem(`welcome-${slug}`)
  }

  return { setWelcome, getWelcome, removeWelcome }
}

export default useWelcomeBanner