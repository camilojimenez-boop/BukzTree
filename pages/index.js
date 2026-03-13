import { useRouter } from 'next/router'

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
}
