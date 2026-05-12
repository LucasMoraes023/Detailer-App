import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Camera from './components/Camera.jsx'
import AssistenteIA from './components/AssistenteIA.jsx'
import { config } from './config.js'

// Configuração do Supabase
const supabase = createClient(config.supabase.url, config.supabase.anonKey)

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login') // login, cadastro, app
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    servico: 'Polimento',
    horario: '08:00'
  })

  useEffect(() => {
    // Verificar se usuário já está logado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        setView('app')
      }
    }
    checkUser()

    // Listener para mudanças de auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
          setView('app')
        } else {
          setUser(null)
          setView('login')
        }
      }
    )

    return () => authListener.subscription.unsubscribe()
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const login = async () => {
    if (!formData.email || !formData.senha) {
      alert('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      })
      if (error) throw error
    } catch (error) {
      alert('Erro no login: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const cadastrar = async () => {
    if (!formData.email || !formData.senha || !formData.nome) {
      alert('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome
          }
        }
      })
      if (error) throw error
      alert('Conta criada com sucesso! Verifique seu email.')
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const agendar = async () => {
    if (!formData.nome) {
      alert('Digite seu nome')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase
        .from('agendamentos')
        .insert([{
          nome: formData.nome,
          servico: formData.servico,
          horario: formData.horario,
          status: 'pendente',
          user_id: user?.id
        }])
      if (error) throw error
      alert('Agendamento realizado com sucesso!')
      // Limpar formulário
      setFormData({...formData, nome: '', servico: 'Polimento', horario: '08:00'})
    } catch (error) {
      alert('Erro ao agendar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    logo: {
      width: '120px',
      height: '120px',
      background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '20px',
      boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      padding: '30px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    title: {
      textAlign: 'center',
      color: '#ff6b35',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
    },
    subtitle: {
      textAlign: 'center',
      color: '#cccccc',
      marginBottom: '30px',
      fontSize: '16px'
    },
    input: {
      width: '100%',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '10px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '10px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px',
      outline: 'none'
    },
    button: {
      width: '100%',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
    },
    buttonSecondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    loading: {
      opacity: 0.7,
      pointerEvents: 'none'
    }
  }

  if (view === 'login') {
    return (
      <div style={styles.container}>
        <div style={styles.logo}>🚗</div>
        <div style={styles.card}>
          <h1 style={styles.title}>DETAILER LUCAS MORAES</h1>
          <p style={styles.subtitle}>Excelência em cuidado automotivo</p>

          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            name="senha"
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleInputChange}
          />

          <button
            style={{...styles.button, ...(loading ? styles.loading : {})}}
            onClick={login}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={() => setView('cadastro')}
          >
            Criar Conta
          </button>
        </div>
      </div>
    )
  }

  if (view === 'cadastro') {
    return (
      <div style={styles.container}>
        <div style={styles.logo}>🚗</div>
        <div style={styles.card}>
          <h1 style={styles.title}>Criar Conta</h1>
          <p style={styles.subtitle}>Junte-se à nossa equipe</p>

          <input
            style={styles.input}
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            name="senha"
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleInputChange}
          />

          <button
            style={{...styles.button, ...(loading ? styles.loading : {})}}
            onClick={cadastrar}
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>

          <button
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={() => setView('login')}
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.logo}>🚗</div>
      <div style={styles.card}>
        <h1 style={styles.title}>Bem-vindo!</h1>
        <p style={styles.subtitle}>Olá, {user?.email}</p>

        <h3 style={{color: '#ff6b35', marginBottom: '20px'}}>Agendar Serviço</h3>

        <input
          style={styles.input}
          name="nome"
          placeholder="Seu nome"
          value={formData.nome}
          onChange={handleInputChange}
        />

        <select
          style={styles.select}
          name="servico"
          value={formData.servico}
          onChange={handleInputChange}
        >
          <option value="Polimento">Polimento</option>
          <option value="Vitrificação">Vitrificação</option>
          <option value="Lavagem Completa">Lavagem Completa</option>
          <option value="Higienização Interna">Higienização Interna</option>
        </select>

        <select
          style={styles.select}
          name="horario"
          value={formData.horario}
          onChange={handleInputChange}
        >
          <option value="08:00">08:00</option>
          <option value="09:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00</option>
        </select>

        <button
          style={{...styles.button, ...(loading ? styles.loading : {})}}
          onClick={agendar}
          disabled={loading}
        >
          {loading ? 'Agendando...' : 'Agendar Serviço'}
        </button>

        <button
          style={{...styles.button, ...styles.buttonSecondary}}
          onClick={logout}
        >
          Sair
        </button>

        <div style={{marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px'}}>
          <h3 style={{color: '#ff6b35', marginBottom: '15px'}}>Ferramentas</h3>
          <Camera />
          <AssistenteIA />
        </div>
      </div>
    </div>
  )
}

export default App