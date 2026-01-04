// import md5 from "md5";

export function getSessionPassword() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("shared_password");
}

export function setSessionPassword(password: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("shared_password", password);
}

export function clearSessionPassword() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("shared_password");
}

export function getApiAuthToken(password: string, /*apiToken: string*/) {
//   return md5(password + apiToken);
    return (password);
}
