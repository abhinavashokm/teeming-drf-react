const useWelcomeBanner = () => {
  const setWelcome = (slug, userId) => {
    localStorage.setItem(`welcome-${slug}-${userId}`, JSON.stringify(true))
  }

  const getWelcome = (slug, userId) => {
    return JSON.parse(localStorage.getItem(`welcome-${slug}-${userId}`))
  }

  const removeWelcome = (slug, userId) => {
    localStorage.removeItem(`welcome-${slug}-${userId}`)
  }

  return { setWelcome, getWelcome, removeWelcome }
}

export default useWelcomeBanner