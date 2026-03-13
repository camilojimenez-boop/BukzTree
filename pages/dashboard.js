import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

const THEMES = [
  { id: 'dark', bg: '#0f0f0f', label: '⚫ Dark' },
  { id: 'purple', bg: '#1c0a2e', label: '🟣 Purple' },
  { id: 'ocean', bg: '#0d1b2a', label: '🔵 Ocean' },
  { id: 'forest', bg: '#0a2e1c', label: '🟢 Forest' },
  { id: 'light', bg: '#f5f5f0', label: '⚪ Light' },
]
const EMOJIS = ['🔗','🌐','📸','🎵','🎬','📧','💼','🛒','🎮','📚','💡','🚀','⭐','🔥','💜']
const COLORS = ['#1a1a1a','#6c63ff','#833ab4','#0d1b2a','#0a2e1c','#2e0a0a','#c0392b','#e67e22']

export default function Dashboard() {
  const user = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [tab, setTab] = useState('links') // 'links' | 'profile' | 'theme'
  const [saving, setSaving] = useState(false)
  const [newLink, setNewLink] = useState({ title:'', url:'', description:'', emoji:'🔗', accent_color:'#1a1a1a' })

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    loadData()
  }, [user])

  async function loadData() {
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: lnks } = await supabase.from('links').select('*').eq('user_id', user.id).order('position')
    setProfile(prof)
    setLinks(lnks || [])
  }

  async function saveProfile() {
    setSaving(true)
    await supabase.from('profiles').update(profile).eq('id', user.id)
    setSaving(false)
  }

  async function uploadAvatar(file) {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setProfile(p => ({ ...p, avatar_url: data.publicUrl }))
  }

  async function uploadCover(file, linkId) {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${linkId}.${ext}`
    await supabase.storage.from('covers').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('covers').getPublicUrl(path)
    setLinks(ls => ls.map(l => l.id === linkId ? { ...l, cover_url: data.publicUrl } : l))
    await supabase.from('links').update({ cover_url: data.publicUrl }).eq('id', linkId)
  }

  async function addLink() {
    if (!newLink.title || !newLink.url) return
    const { data } = await supabase.from('links').insert({
      ...newLink, user_id: user.id, position: links.length
    }).select().single()
    setLinks(ls => [...ls, data])
    setNewLink({ title:'', url:'', description:'', emoji:'🔗', accent_color:'#1a1a1a' })
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

  const s = {
    page: { minHeight:'100vh', background:'#0f0f0f', fontFamily:'system-ui', color:'#fff', paddingBottom:'60px' },
    header: { padding:'16px 20px', borderBottom:'1px solid #1e1e1e', display:'flex', alignItems:'center', gap:'12px' },
    logo: { fontSize:'22px', fontWeight:800, flex:1 },
    viewBtn: { background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#aaa', borderRadius:'8px', padding:'8px 14px', fontSize:'13px', cursor:'pointer' },
    logoutBtn: { background:'transparent', border:'1px solid #333', color:'#666', borderRadius:'8px', padding:'8px 14px', fontSize:'13px', cursor:'pointer' },
    body: { maxWidth:'600px', margin:'0 auto', padding:'24px 20px' },
    tabs: { display:'flex', gap:'8px', marginBottom:'24px' },
    tab: (active) => ({ padding:'9px 18px', borderRadius:'20px', fontSize:'14px', fontWeight: active?600:400,
      background: active?'#6c63ff':'#1a1a1a', border:`1px solid ${active?'#6c63ff':'#2a2a2a'}`,
      color: active?'#fff':'#888', cursor:'pointer' }),
    card: { background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'14px', padding:'16px', marginBottom:'10px' },
    input: { width:'100%', background:'#111', border:'1px solid #333', borderRadius:'10px', color:'#fff',
      fontSize:'14px', padding:'10px 14px', outline:'none', boxSizing:'border-box', fontFamily:'system-ui' },
    label: { fontSize:'12px', color:'#666', marginBottom:'4px', display:'block', marginTop:'10px' },
    primaryBtn: { background:'#6c63ff', border:'none', color:'#fff', padding:'11px 20px', borderRadius:'10px', fontSize:'14px', fontWeight:600, cursor:'pointer' },
    dangerBtn: { background:'transparent', border:'1px solid #3a1a1a', color:'#e55', padding:'7px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer' },
    linkRow: { display:'flex', alignItems:'center', gap:'10px' },
    emoji: (sel, e) => ({ background: sel===e?'#6c63ff22':'#222', border:`1px solid ${sel===e?'#6c63ff':'#333'}`, borderRadius:'8px', padding:'5px 8px', fontSize:'16px', cursor:'pointer' }),
    colorDot: (sel, c) => ({ width:'24px', height:'24px', borderRadius:'50%', background:c, cursor:'pointer', border:`2px solid ${sel===c?'#fff':'transparent'}` }),
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.logo}>🌳 Bukztree</span>
        <button style={s.viewBtn} onClick={() => window.open(`/${profile.username}`, '_blank')}>Ver mi página →</button>
        <button style={s.logoutBtn} onClick={() => { supabase.auth.signOut(); router.push('/') }}>Salir</button>
      </div>

      <div style={s.body}>
        <div style={{ marginBottom:'20px' }}>
          <div style={{ fontSize:'13px', color:'#666' }}>Tu enlace público:</div>
          <div style={{ color:'#6c63ff', fontSize:'15px', fontWeight:600 }}>
            bukztree.vercel.app/{profile.username}
          </div>
        </div>

        <div style={s.tabs}>
          {[['links','🔗 Enlaces'],['profile','👤 Perfil'],['theme','🎨 Tema']].map(([id,label]) => (
            <button key={id} style={s.tab(tab===id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {/* ── ENLACES ── */}
        {tab === 'links' && <>
          <div style={s.card}>
            <div style={{ fontSize:'14px', fontWeight:600, marginBottom:'14px' }}>➕ Nuevo enlace</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
              <div>
                <div style={s.label}>Título</div>
                <input style={s.input} placeholder="Mi Instagram" value={newLink.title}
                  onChange={e => setNewLink(n => ({...n, title: e.target.value}))} />
              </div>
              <div>
                <div style={s.label}>URL</div>
                <input style={s.input} placeholder="https://..." value={newLink.url}
                  onChange={e => setNewLink(n => ({...n, url: e.target.value}))} />
              </div>
            </div>
            <div style={s.label}>Descripción (opcional)</div>
            <input style={s.input} placeholder="Sígueme en Instagram" value={newLink.description}
              onChange={e => setNewLink(n => ({...n, description: e.target.value}))} />
            <div style={s.label}>Ícono</div>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', margin:'6px 0' }}>
              {EMOJIS.map(e => <span key={e} style={s.emoji(newLink.emoji,e)} onClick={() => setNewLink(n => ({...n, emoji:e}))}>{e}</span>)}
            </div>
            <div style={s.label}>Color de acento</div>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', margin:'6px 0 14px' }}>
              {COLORS.map(c => <div key={c} style={s.colorDot(newLink.accent_color,c)} onClick={() => setNewLink(n => ({...n, accent_color:c}))} />)}
            </div>
            <button style={s.primaryBtn} onClick={addLink}>Agregar enlace</button>
          </div>

          {links.map(link => (
            <div key={link.id} style={{...s.card, opacity: link.active ? 1 : 0.5 }}>
              <div style={s.linkRow}>
                <span style={{ fontSize:'20px' }}>{link.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:600 }}>{link.title}</div>
                  <div style={{ fontSize:'12px', color:'#666', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'240px' }}>{link.url}</div>
                </div>
                <button style={{ background:'none', border:'1px solid #2a2a2a', color:'#888', borderRadius:'8px', padding:'6px 10px', fontSize:'12px', cursor:'pointer' }}
                  onClick={() => toggleLink(link.id, link.active)}>
                  {link.active ? 'Ocultar' : 'Mostrar'}
                </button>
                <label style={{ background:'#1e1e1e', border:'1px solid #2a2a2a', color:'#888', borderRadius:'8px', padding:'6px 10px', fontSize:'12px', cursor:'pointer' }}>
                  🖼 Portada
                  <input type="file" accept="image/*" style={{ display:'none' }}
                    onChange={e => uploadCover(e.target.files[0], link.id)} />
                </label>
                <button style={s.dangerBtn} onClick={() => deleteLink(link.id)}>🗑</button>
              </div>
              {link.cover_url && <img src={link.cover_url} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'8px', marginTop:'10px' }} />}
            </div>
          ))}
        </>}

        {/* ── PERFIL ── */}
        {tab === 'profile' && <>
          <div style={s.card}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#6c63ff', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:700 }}>
                {profile.avatar_url ? <img src={profile.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : profile.display_name?.[0]?.toUpperCase()}
              </div>
              <label style={{ background:'#222', border:'1px solid #333', color:'#aaa', borderRadius:'8px', padding:'8px 14px', fontSize:'13px', cursor:'pointer' }}>
                📷 Cambiar foto
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => uploadAvatar(e.target.files[0])} />
              </label>
            </div>
            <div style={s.label}>Nombre visible</div>
            <input style={{...s.input, marginBottom:'10px'}} value={profile.display_name||''} onChange={e => setProfile(p => ({...p, display_name: e.target.value}))} />
            <div style={s.label}>Biografía</div>
            <textarea style={{...s.input, minHeight:'70px', resize:'none', marginBottom:'10px'}} value={profile.bio||''} onChange={e => setProfile(p => ({...p, bio: e.target.value}))} />
            <button style={s.primaryBtn} onClick={saveProfile} disabled={saving}>{saving ? 'Guardando...' : 'Guardar perfil'}</button>
          </div>
        </>}

        {/* ── TEMA ── */}
        {tab === 'theme' && <>
          <div style={s.card}>
            <div style={{ fontSize:'14px', fontWeight:600, marginBottom:'14px' }}>Color de fondo</div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {THEMES.map(t => (
                <div key={t.id} onClick={() => setProfile(p => ({...p, bg_color: t.bg, theme: t.id}))}
                  style={{ width:'56px', height:'56px', borderRadius:'12px', background:t.bg, cursor:'pointer',
                    border:`2px solid ${profile.theme===t.id?'#6c63ff':'#333'}`, display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:'10px', color:'#fff' }}>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'10px' }}>
              {THEMES.map(t => <span key={t.id} style={{ fontSize:'12px', color: profile.theme===t.id?'#6c63ff':'#666' }}>{t.label}</span>)}
            </div>
            <button style={{...s.primaryBtn, marginTop:'16px'}} onClick={saveProfile}>Guardar tema</button>
          </div>
        </>}
      </div>
    </div>
  )
}
