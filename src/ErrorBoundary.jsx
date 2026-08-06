import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Error no controlado en PJC Scout · Mi Calendario:', error, info)
  }

  handleReintentar = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app">
          <div className="error-boundary">
            <h1 className="error-boundary__titulo">Algo ha fallado</h1>
            <p className="error-boundary__texto">
              Ha ocurrido un error inesperado al cargar el calendario. Puedes intentarlo de nuevo.
            </p>
            <button className="error-boundary__boton" onClick={this.handleReintentar}>
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
