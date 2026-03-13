import { supabase } from '../lib/supabase'

export default function PublicProfile({ profile, links }) {
  if (!profile) return <div style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'system-ui' }}>
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:'48px' }}>🌳</div>
      <div style={{ fontSize:'18px', fontWeight:600, marginTop:'12px' }}>Perfil no encontrado</div>
    </div>
  </div>

  const bg = profile.bg_color || '#0f0f0f'
  const isLight = bg === '#f5f5f0' || bg === '#fffbf0'
  const textColor = isLight ? '#111' : '#fff'
  const mutedColor = isLight ? '#555' : '#aaa'

  return (
    <main style={{ minHeight:'100vh', background:bg, fontFamily:'system-ui', color:textColor,
      display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 20px 60px' }}>
      
      {/* Avatar */}
      <div style={{ width:'88px', height:'88px', borderRadius:'50%', background:'#6c63ff', overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', fontWeight:700,
        color:'#fff', marginBottom:'14px', flexShrink:0 }}>
        {profile.avatar_url
          ? <img src={profile.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : profile.display_name?.[0]?.toUpperCase() || '?'}
      </div>

      <h1 style={{ fontSize:'20px', fontWeight:700, marginBottom:'6px' }}>{profile.display_name || profile.username}</h1>
      {profile.bio && <p style={{ fontSize:'14px', color:mutedColor, textAlign:'center', maxWidth:'320px', marginBottom:'32px', lineHeight:1.5 }}>{profile.bio}</p>}

      {/* Links */}
      <div style={{ width:'100%', maxWidth:'480px', display:'flex', flexDirection:'column', gap:'12px' }}>
        {links.map(link => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener"
            style={{ textDecoration:'none', display:'block', borderRadius:'16px', overflow:'hidden',
              background: link.cover_url ? link.accent_color : (isLight?'#fff':'#1a1a1a'),
              border:`1px solid ${isLight?'#ddd':'#2a2a2a'}`, cursor:'pointer',
              transition:'transform 0.15s', position:'relative',
              ...(link.cover_url ? { height:'120px' } : {}) }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            {link.cover_url ? <>
              <img src={link.cover_url} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 40%, transparent)',
                display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'14px 16px' }}>
                <div style={{ fontSize:'15px', fontWeight:600, color:'#fff' }}>{link.title}</div>
                {link.description && <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', marginTop:'2px' }}>{link.description}</div>}
              </div>
            </> : (
              <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:link.accent_color,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
                  {link.emoji}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'15px', fontWeight:600, color:textColor }}>{link.title}</div>
                  {link.description && <div style={{ fontSize:'12px', color:mutedColor, marginTop:'2px' }}>{link.description}</div>}
                </div>
                <span style={{ color:mutedColor, fontSize:'18px' }}>›</span>
              </div>
            )}
          </a>
        ))}
      </div>

      <div style={{ marginTop:'48px', fontSize:'12px', color:mutedColor }}>
        🌳 Hecho con <strong>Bukztree</strong>
      </div>
    </main>
  )
}

export async function getServerSideProps({ params }) {
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('username', params.username).single()
  if (!profile) return { props: { profile: null, links: [] } }

  const { data: links } = await supabase
    .from('links').select('*').eq('user_id', profile.id)
    .eq('active', true).order('position')

  return { props: { profile, links: links || [] } }
}
