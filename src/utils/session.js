const TOKEN_KEY = 'token'

export function saveToken(user) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)

}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(token);
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getUser()?.user?.role || null;
}
