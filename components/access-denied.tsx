import { signIn } from "next-auth/react"

export default function AccessDenied() {
  return (
    <>
      <h1>Access Denied</h1>
      <p>
        <a
          href="/siwe"
        >
          You must be signed in to view this page
        </a>
      </p>
    </>
  )
}
