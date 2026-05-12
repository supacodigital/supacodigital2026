import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#05060f', color: '#e8eef5', textAlign: 'center', padding: '40px 20px',
          fontFamily: "'Barlow Condensed', sans-serif"
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 12 }}>
            Supaco<span style={{ color: '#00e5ff' }}>.</span>Digital
          </div>
          <p style={{ color: 'rgba(232,238,245,.55)', fontSize: 16, marginBottom: 28 }}>
            Une erreur inattendue s'est produite. Rechargez la page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg,#00e5ff,#1a6bff)',
              border: 'none', color: '#05060f', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
              padding: '14px 32px', cursor: 'pointer'
            }}
          >
            Recharger
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
