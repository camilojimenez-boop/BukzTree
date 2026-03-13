import { useState } from "react";

const files = {
  "package.json": `{
  "name": "bukztree",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@supabase/auth-helpers-react": "^0.5.0"
  }
}`,

  "next.config.js": `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['*.supabase.co'] },
}
module.exports = nextConfig`,

  "lib/supabase.js": `import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)`,

  "pages/_app.js": `import '../styles/globals.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export default function App({ Component, pageProps }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}`,

  "pages/index.js": `import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <main style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex',
      flexDirection:'column', alignItems:'center', justifyContent:'center',
      fontFamily:'system-ui', color:'#fff', padding:'20px', textAlign:'center' }}>
      <h1 style={{ fontSize:'52px', fontWeight:800, marginBottom:'10px' }}>
        🌳 Bukztree
      </h1>
      <p style={{ fontSize:'18px', color:'#888', marginBottom:'40px', maxWidth:'400px' }}>
        Tu página de enlaces personalizada. Comparte todo en un solo link.
      </p>
      <button onClick={() => router.push('/login')}
        style={{ background:'#6c63ff', border:'none', color:'#fff',
          padding:'14px 36px', borderRadius:'50px', fontSize:'16px',
          fontWeight:600, cursor:'pointer' }}>
        Crear mi Bukztree gratis
      </button>
    </main>
  )
}`,

  "pages/login.js": `import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    if (mode === 'register') {
      const { data: existing } = await supabase
        .from('profiles').select('id').eq('username', username).single()
      if (existing) { setError('Ese username ya está en uso'); setLoading(false); return }
      const { data, error: err } = await supabase.auth.signUp({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      await supabase.from('profiles').insert({ id: data.user.id, username: username.toLowerCase(), display_name: username })
      router.push('/dashboard')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError('Email o contraseña incorrectos'); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const s = {
    page: { minHeight:'100vh', background:'#0f0f0f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui', color:'#fff' },
    card: { background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'400px' },
    label: { fontSize:'13px', color:'#888', marginBottom:'5px', display:'block' },
    input: { width:'100%', background:'#111', border:'1px solid #333', borderRadius:'10px', color:'#fff', fontSize:'14px', padding:'11px 14px', outline:'none', boxSizing:'border-box', marginBottom:'14px', fontFamily:'system-ui' },
    btn: { width:'100%', background:'#6c63ff', border:'none', color:'#fff', padding:'13px', borderRadius:'12px', fontSize:'15px', fontWeight:600, cursor:'pointer', marginTop:'6px' },
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ fontSize:'28px', fontWeight:700, marginBottom:'6px', textAlign:'center' }}>🌳 Bukztree</div>
        <div style={{ color:'#888', textAlign:'center', marginBottom:'28px', fontSize:'14px' }}>
          {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta gratis'}
        </div>
        {mode === 'register' && <>
          <label style={s.label}>Username</label>
          <input style={s.input} placeholder="miusuario" value={username}
            onChange={e => setUsername(e.target.value.replace(/[^a-z0-9_]/gi,'').toLowerCase())} />
        </>}
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label style={s.label}>Contraseña</label>
        <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div style={{ color:'#ff6b6b', fontSize:'13px', marginBottom:'12px', textAlign:'center' }}>{error}</div>}
        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
        <div style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#888' }}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button style={{ color:'#6c63ff', cursor:'pointer', background:'none', border:'none', fontSize:'14px', fontWeight:600 }}
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}`,

  "pages/dashboard.js": `import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

const THEMES = [
  { id:'dark', bg:'#0f0f0f', label:'⚫ Dark' },
  { id:'purple', bg:'#1c0a2e', label:'🟣 Purple' },
  { id:'ocean', bg:'#0d1b2a', label:'🔵 Ocean' },
  { id:'forest', bg:'#0a2e1c', label:'🟢 Forest' },
  { id:'light', bg:'#f5f5f0', label:'⚪ Light' },
]
const EMOJIS = ['🔗','🌐','📸','🎵','🎬','📧','💼','🛒','🎮','📚','💡','🚀','⭐','🔥','💜']
const COLORS = ['#1a1a1a','#6c63ff','#833ab4','#0d1b2a','#0a2e1c','#2e0a0a','#c0392b','#e67e22']

export default function Dashboard() {
  const user = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [tab, setTab] = useState('links')
  const [saving, setSaving] = useState(false)
  const [nl, setNl] = useState({ title:'', url:'', description:'', emoji:'🔗', accent_color:'#1a1a1a' })

  useEffect(() => { if (!user) { router.push('/login'); return } loadData() }, [user])

  async function loadData() {
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: l } = await supabase.from('links').select('*').eq('user_id', user.id).order('position')
    setProfile(p); setLinks(l || [])
  }

  async function saveProfile() {
    setSaving(true)
    await supabase.from('profiles').update(profile).eq('id', user.id)
    setSaving(false)
  }

  async function uploadAvatar(file) {
    const path = \`\${user.id}/avatar.\${file.name.split('.').pop()}\`
    await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setProfile(p => ({ ...p, avatar_url: data.publicUrl }))
  }

  async function uploadCover(file, lid) {
    const path = \`\${user.id}/\${lid}.\${file.name.split('.').pop()}\`
    await supabase.storage.from('covers').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('covers').getPublicUrl(path)
    setLinks(ls => ls.map(l => l.id === lid ? { ...l, cover_url: data.publicUrl } : l))
    await supabase.from('links').update({ cover_url: data.publicUrl }).eq('id', lid)
  }

  async function addLink() {
    if (!nl.title || !nl.url) return
    const { data } = await supabase.from('links').insert({ ...nl, user_id: user.id, position: links.length }).select().single()
    setLinks(ls => [...ls, data])
    setNl({ title:'', url:'', description:'', emoji:'🔗', accent_color:'#1a1a1a' })
  }

  async function deleteLink(id) {
    await supabase.from('links').delete().eq('id', id)
    setLinks(ls => ls.filter(l => l.id !== id))
  }

  async function toggleLink(id, active) {
    await supabase.from('links').update({ active: !active }).eq('id', id)
    setLinks(ls => ls.map(l => l.id === id ? { ...l, active: !active } : l))
  }

  if (!profile) return <div style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'system-ui' }}>Cargando...</div>

  const inp = { width:'100%', background:'#111', border:'1px solid #333', borderRadius:'10px', color:'#fff', fontSize:'14px', padding:'10px 14px', outline:'none', boxSizing:'border-box', fontFamily:'system-ui' }
  const lbl = { fontSize:'12px', color:'#666', marginBottom:'4px', display:'block', marginTop:'10px' }
  const card = { background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'14px', padding:'16px', marginBottom:'10px' }
  const pbtn = { background:'#6c63ff', border:'none', color:'#fff', padding:'11px 20px', borderRadius:'10px', fontSize:'14px', fontWeight:600, cursor:'pointer' }
  const tabBtn = (a) => ({ padding:'9px 18px', borderRadius:'20px', fontSize:'14px', fontWeight:a?600:400, background:a?'#6c63ff':'#1a1a1a', border:\`1px solid \${a?'#6c63ff':'#2a2a2a'}\`, color:a?'#fff':'#888', cursor:'pointer' })

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', fontFamily:'system-ui', color:'#fff', paddingBottom:'60px' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #1e1e1e', display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'22px', fontWeight:800, flex:1 }}>🌳 Bukztree</span>
        <button style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#aaa', borderRadius:'8px', padding:'8px 14px', fontSize:'13px', cursor:'pointer' }}
          onClick={() => window.open(\`/\${profile.username}\`, '_blank')}>Ver mi página →</button>
        <button style={{ background:'transparent', border:'1px solid #333', color:'#666', borderRadius:'8px', padding:'8px 14px', fontSize:'13px', cursor:'pointer' }}
          onClick={() => { supabase.auth.signOut(); router.push('/') }}>Salir</button>
      </div>
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'24px 20px' }}>
        <div style={{ marginBottom:'20px' }}>
          <div style={{ fontSize:'13px', color:'#666' }}>Tu enlace público:</div>
          <div style={{ color:'#6c63ff', fontSize:'15px', fontWeight:600 }}>bukztree.vercel.app/{profile.username}</div>
        </div>
        <div style={{ display:'flex', gap:'8px', marginBottom:'24px' }}>
          {[['links','🔗 Enlaces'],['profile','👤 Perfil'],['theme','🎨 Tema']].map(([id,label]) => (
            <button key={id} style={tabBtn(tab===id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === 'links' && <>
          <div style={card}>
            <div style={{ fontSize:'14px', fontWeight:600, marginBottom:'14px' }}>➕ Nuevo enlace</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
              <div><div style={lbl}>Título</div><input style={inp} placeholder="Mi Instagram" value={nl.title} onChange={e => setNl(n => ({...n, title:e.target.value}))} /></div>
              <div><div style={lbl}>URL</div><input style={inp} placeholder="https://..." value={nl.url} onChange={e => setNl(n => ({...n, url:e.target.value}))} /></div>
            </div>
            <div style={lbl}>Descripción</div>
            <input style={inp} placeholder="Opcional" value={nl.description} onChange={e => setNl(n => ({...n, description:e.target.value}))} />
            <div style={lbl}>Ícono</div>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', margin:'6px 0' }}>
              {EMOJIS.map(e => <span key={e} onClick={() => setNl(n => ({...n, emoji:e}))}
                style={{ background:nl.emoji===e?'#6c63ff22':'#222', border:\`1px solid \${nl.emoji===e?'#6c63ff':'#333'}\`, borderRadius:'8px', padding:'5px 8px', fontSize:'16px', cursor:'pointer' }}>{e}</span>)}
            </div>
            <div style={lbl}>Color de acento</div>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', margin:'6px 0 14px' }}>
              {COLORS.map(c => <div key={c} onClick={() => setNl(n => ({...n, accent_color:c}))}
                style={{ width:'24px', height:'24px', borderRadius:'50%', background:c, cursor:'pointer', border:\`2px solid \${nl.accent_color===c?'#fff':'transparent'}\` }} />)}
            </div>
            <button style={pbtn} onClick={addLink}>Agregar enlace</button>
          </div>
          {links.map(link => (
            <div key={link.id} style={{...card, opacity:link.active?1:0.5}}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'20px' }}>{link.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:600 }}>{link.title}</div>
                  <div style={{ fontSize:'12px', color:'#555', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'200px' }}>{link.url}</div>
                </div>
                <button style={{ background:'none', border:'1px solid #2a2a2a', color:'#888', borderRadius:'8px', padding:'6px 10px', fontSize:'12px', cursor:'pointer' }}
                  onClick={() => toggleLink(link.id, link.active)}>{link.active?'Ocultar':'Mostrar'}</button>
                <label style={{ background:'#1e1e1e', border:'1px solid #2a2a2a', color:'#888', borderRadius:'8px', padding:'6px 10px', fontSize:'12px', cursor:'pointer' }}>
                  🖼 Portada<input type="file" accept="image/*" style={{ display:'none' }} onChange={e => uploadCover(e.target.files[0], link.id)} />
                </label>
                <button style={{ background:'transparent', border:'1px solid #3a1a1a', color:'#e55', padding:'7px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer' }}
                  onClick={() => deleteLink(link.id)}>🗑</button>
              </div>
              {link.cover_url && <img src={link.cover_url} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'8px', marginTop:'10px' }} />}
            </div>
          ))}
        </>}

        {tab === 'profile' && <div style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px' }}>
            <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#6c63ff', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:700 }}>
              {profile.avatar_url ? <img src={profile.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : profile.display_name?.[0]?.toUpperCase()}
            </div>
            <label style={{ background:'#222', border:'1px solid #333', color:'#aaa', borderRadius:'8px', padding:'8px 14px', fontSize:'13px', cursor:'pointer' }}>
              📷 Cambiar foto<input type="file" accept="image/*" style={{ display:'none' }} onChange={e => uploadAvatar(e.target.files[0])} />
            </label>
          </div>
          <div style={lbl}>Nombre visible</div>
          <input style={{...inp, marginBottom:'10px'}} value={profile.display_name||''} onChange={e => setProfile(p => ({...p, display_name:e.target.value}))} />
          <div style={lbl}>Biografía</div>
          <textarea style={{...inp, minHeight:'70px', resize:'none', marginBottom:'10px'}} value={profile.bio||''} onChange={e => setProfile(p => ({...p, bio:e.target.value}))} />
          <button style={pbtn} onClick={saveProfile} disabled={saving}>{saving?'Guardando...':'Guardar perfil'}</button>
        </div>}

        {tab === 'theme' && <div style={card}>
          <div style={{ fontSize:'14px', fontWeight:600, marginBottom:'14px' }}>Color de fondo</div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {THEMES.map(t => (
              <div key={t.id} onClick={() => setProfile(p => ({...p, bg_color:t.bg, theme:t.id}))}
                style={{ width:'56px', height:'56px', borderRadius:'12px', background:t.bg, cursor:'pointer', border:\`2px solid \${profile.theme===t.id?'#6c63ff':'#333'}\` }} />
            ))}
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginTop:'8px' }}>
            {THEMES.map(t => <span key={t.id} style={{ fontSize:'12px', color:profile.theme===t.id?'#6c63ff':'#555' }}>{t.label}</span>)}
          </div>
          <button style={{...pbtn, marginTop:'16px'}} onClick={saveProfile}>Guardar tema</button>
        </div>}
      </div>
    </div>
  )
}`,

  "pages/[username].js": `import { supabase } from '../lib/supabase'

export default function PublicProfile({ profile, links }) {
  if (!profile) return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'system-ui', textAlign:'center' }}>
      <div><div style={{ fontSize:'48px' }}>🌳</div><div style={{ fontSize:'18px', fontWeight:600, marginTop:'12px' }}>Perfil no encontrado</div></div>
    </div>
  )
  const bg = profile.bg_color || '#0f0f0f'
  const isLight = bg === '#f5f5f0'
  const tc = isLight ? '#111' : '#fff'
  const mc = isLight ? '#555' : '#aaa'
  return (
    <main style={{ minHeight:'100vh', background:bg, fontFamily:'system-ui', color:tc, display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 20px 60px' }}>
      <div style={{ width:'88px', height:'88px', borderRadius:'50%', background:'#6c63ff', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', fontWeight:700, color:'#fff', marginBottom:'14px' }}>
        {profile.avatar_url ? <img src={profile.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : profile.display_name?.[0]?.toUpperCase() || '?'}
      </div>
      <h1 style={{ fontSize:'20px', fontWeight:700, marginBottom:'6px' }}>{profile.display_name || profile.username}</h1>
      {profile.bio && <p style={{ fontSize:'14px', color:mc, textAlign:'center', maxWidth:'320px', marginBottom:'32px', lineHeight:1.5 }}>{profile.bio}</p>}
      <div style={{ width:'100%', maxWidth:'480px', display:'flex', flexDirection:'column', gap:'12px' }}>
        {links.map(link => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener"
            style={{ textDecoration:'none', display:'block', borderRadius:'16px', overflow:'hidden', background:link.cover_url?link.accent_color:(isLight?'#fff':'#1a1a1a'), border:\`1px solid \${isLight?'#ddd':'#2a2a2a'}\`, position:'relative', ...(link.cover_url?{height:'120px'}:{}) }}>
            {link.cover_url ? <>
              <img src={link.cover_url} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 40%, transparent)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'14px 16px' }}>
                <div style={{ fontSize:'15px', fontWeight:600, color:'#fff' }}>{link.title}</div>
                {link.description && <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', marginTop:'2px' }}>{link.description}</div>}
              </div>
            </> : (
              <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:link.accent_color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>{link.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'15px', fontWeight:600, color:tc }}>{link.title}</div>
                  {link.description && <div style={{ fontSize:'12px', color:mc, marginTop:'2px' }}>{link.description}</div>}
                </div>
                <span style={{ color:mc, fontSize:'18px' }}>›</span>
              </div>
            )}
          </a>
        ))}
      </div>
      <div style={{ marginTop:'48px', fontSize:'12px', color:mc }}>🌳 Hecho con <strong>Bukztree</strong></div>
    </main>
  )
}

export async function getServerSideProps({ params }) {
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', params.username).single()
  if (!profile) return { props: { profile: null, links: [] } }
  const { data: links } = await supabase.from('links').select('*').eq('user_id', profile.id).eq('active', true).order('position')
  return { props: { profile, links: links || [] } }
}`,

  "styles/globals.css": `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; }
a { text-decoration: none; }`,

  "supabase/schema.sql": `create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  theme text default 'dark',
  bg_color text default '#0f0f0f',
  created_at timestamp default now()
);

create table links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  emoji text default '🔗',
  cover_url text,
  accent_color text default '#1a1a1a',
  position integer default 0,
  active boolean default true,
  created_at timestamp default now()
);

insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public)
  values ('covers', 'covers', true);

alter table profiles enable row level security;
alter table links enable row level security;

create policy "Perfil publico" on profiles for select using (true);
create policy "Editar perfil" on profiles for all using (auth.uid() = id);
create policy "Enlaces publicos" on links for select using (active = true);
create policy "Editar enlaces" on links for all using (auth.uid() = user_id);

create policy "Subir avatar" on storage.objects
  for insert with check (bucket_id = 'avatars');
create policy "Ver avatares" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Subir portadas" on storage.objects
  for insert with check (bucket_id = 'covers');
create policy "Ver portadas" on storage.objects
  for select using (bucket_id = 'covers');`
};

const order = [
  "package.json",
  "next.config.js",
  "lib/supabase.js",
  "pages/_app.js",
  "pages/index.js",
  "pages/login.js",
  "pages/dashboard.js",
  "pages/[username].js",
  "styles/globals.css",
  "supabase/schema.sql",
];

const colors = {
  "package.json": "#f0a060",
  "next.config.js": "#60c0f0",
  "lib/supabase.js": "#a8ff78",
  "pages/_app.js": "#c084fc",
  "pages/index.js": "#c084fc",
  "pages/login.js": "#c084fc",
  "pages/dashboard.js": "#c084fc",
  "pages/[username].js": "#c084fc",
  "styles/globals.css": "#f472b6",
  "supabase/schema.sql": "#60d0a0",
};

const folders = { "📁 /": [], "📁 lib/": [], "📁 pages/": [], "📁 styles/": [], "📁 supabase/": [] };
order.forEach(f => {
  const parts = f.split("/");
  const key = parts.length === 1 ? "📁 /" : `📁 ${parts[0]}/`;
  if (folders[key]) folders[key].push(f);
});

export default function App() {
  const [sel, setSel] = useState("package.json");
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(files[sel]).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([files[sel]], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = sel.split("/").pop();
    a.click();
  }

  const idx = order.indexOf(sel);

  return (
    <div style={{ fontFamily: "system-ui", background: "#0a0a0a", minHeight: "100vh", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "16px", fontWeight: 800 }}>🌳 Bukztree</span>
        <span style={{ fontSize: "12px", color: "#444", flex: 1 }}>archivos para GitHub</span>
        <button onClick={download} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", borderRadius: "7px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>
          ⬇ Descargar
        </button>
        <button onClick={copy} style={{ background: copied ? "#16a34a" : "#6c63ff", border: "none", color: "#fff", borderRadius: "7px", padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontWeight: 600, minWidth: "100px" }}>
          {copied ? "✓ Copiado" : "Copiar código"}
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: "190px", borderRight: "1px solid #1a1a1a", padding: "10px 0", flexShrink: 0, overflowY: "auto" }}>
          {Object.entries(folders).filter(([, v]) => v.length > 0).map(([folder, ffiles]) => (
            <div key={folder}>
              <div style={{ fontSize: "11px", color: "#3a3a3a", padding: "8px 14px 3px", letterSpacing: "0.04em" }}>{folder}</div>
              {ffiles.map(f => {
                const name = f.split("/").pop();
                const active = sel === f;
                return (
                  <div key={f} onClick={() => setSel(f)} style={{ padding: "7px 14px 7px 22px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", background: active ? "#14142a" : "transparent", borderLeft: `2px solid ${active ? "#6c63ff" : "transparent"}`, color: active ? "#fff" : "#555" }}>
                    <span style={{ color: colors[f], fontSize: "10px" }}>●</span>{name}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: colors[sel], fontSize: "12px" }}>●</span>
            <span style={{ fontSize: "13px", color: "#ccc" }}>{sel}</span>
            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#333" }}>{files[sel].split("\n").length} líneas</span>
          </div>

          <div style={{ padding: "8px 14px", background: "#0e0e1a", borderBottom: "1px solid #1e1e2e", fontSize: "12px", color: "#8880cc" }}>
            📋 En GitHub: <strong style={{ color: "#a89fff" }}>Add file → Create new file</strong> → nombre: <strong style={{ color: "#fff" }}>{sel}</strong> → pega → <strong style={{ color: "#a89fff" }}>Commit changes</strong>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "14px 16px" }}>
            <pre style={{ fontSize: "12px", lineHeight: 1.75, color: "#c9d1d9", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
              {files[sel]}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", color: "#333" }}>{idx + 1}/{order.length}</span>
        <div style={{ display: "flex", gap: "4px", flex: 1 }}>
          {order.map((f, i) => (
            <div key={f} onClick={() => setSel(f)} style={{ flex: 1, height: "4px", borderRadius: "2px", cursor: "pointer", background: f === sel ? "#6c63ff" : i < idx ? "#3a3a6a" : "#1e1e1e" }} />
          ))}
        </div>
        <button onClick={() => idx > 0 && setSel(order[idx - 1])} disabled={idx === 0}
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#666", borderRadius: "7px", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>← Ant</button>
        <button onClick={() => idx < order.length - 1 && setSel(order[idx + 1])} disabled={idx === order.length - 1}
          style={{ background: "#6c63ff", border: "none", color: "#fff", borderRadius: "7px", padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>Sig →</button>
      </div>
    </div>
  );
}
