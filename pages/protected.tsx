import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"

export default function ProtectedPage() {
  const { data: session } = useSession()
  const [content, setContent] = useState()

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/jwt")
      const jwt = await res.json()
      console.log('jwt: ', jwt)
      console.log('session: ', session)
      if (jwt) {
        setContent(jwt.sub)
      }
    }
    fetchData()
  }, [session])

  // When rendering client side don't display anything until loading is complete
  // if (typeof window !== "undefined" && loading) return null

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <code>{`const res = await fetch("/api/examples/jwt")`}</code>
      <h1>Protected Page</h1>
      {}
      <p>
        {/* <strong>{content ?? "\u00a0"}</strong> */}
        <strong>{content ? 'You can access this page: ' + content : 'loading...'}</strong>
      </p>
      <p>
        <em>Log out and see what happens</em>
      </p>
    </Layout>
  );
}
