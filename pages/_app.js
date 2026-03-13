import '../styles/globals.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export default function App({ Component, pageProps }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
