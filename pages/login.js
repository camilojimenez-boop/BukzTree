import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'register') {
      // Verificar username disponible
      const { data: existing } = await supabase
        .from('profiles').select('id').eq('username', username).single()
      if (existing) { setError('Ese username ya está en uso'); setLoading(false); return }

      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }

      await supabase.from('profiles').insert({
        id: data.user.id,
        username: username.toLowerCase(),
        display_name: username
      })
      router.push('/dashboard')
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) { setError('Email o contraseña incorrectos'); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const s = {
    page: { minHeight:'100vh', background:'#0f0f0f', display:'flex',
      alignItems:'center', justifyContent:'center', fontFamily:'system-ui', color:'#fff' },
    card: { background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'20px',
      padding:'40px', width:'100%', maxWidth:'400px' },
    title: { fontSize:'28px', fontWeight:700, marginBottom:'6px', textAlign:'center' },
    sub: { color:'#888', textAlign:'center', marginBottom:'28px', fontSize:'14px' },
    label: { fontSize:'13px', color:'#888', marginBottom:'5px', display:'block' },
    input: { width:'100%', background:'#111', border:'1px solid #333', borderRadius:'10px',
      color:'#fff', fontSize:'14px', padding:'11px 14px', outline:'none', boxSizing:'border-box',
      marginBottom:'14px', fontFamily:'system-ui' },
    btn: { width:'100%', background:'#6c63ff', border:'none', color:'#fff',
      padding:'13px', borderRadius:'12px', fontSize:'15px', fontWeight:600,
      cursor:'pointer', marginTop:'6px' },
    err: { color:'#ff6b6b', fontSize:'13px', marginBottom:'12px', textAlign:'center' },
    toggle: { textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#888' },
    toggleBtn: { color:'#6c63ff', cursor:'pointer', background:'none', border:'none',
      fontSize:'14px', fontWeight:600 }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>🌳 Bukztree</div>
        <div style={s.sub}>{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta gratis'}</div>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && <>
            <label style={s.label}>Username (tu link será bukztree.com/username)</label>
            <input style={s.input} placeholder="miusuario" value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, '').toLowerCase())} required />
          </>}
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="tu@email.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <label style={s.label}>Contraseña</label>
          <input style={s.input} type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div style={s.err}>{error}</div>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
        <div style={s.toggle}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button style={s.toggleBtn} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}
