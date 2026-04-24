import { useState } from 'react'
import '../css/RegisterForm.css'

function RegisterForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefone: '',
    dataNascimento: '',
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'A password é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'A password deve ter pelo menos 6 caracteres'
    }

    if (!formData.confirmarPassword) {
      newErrors.confirmarPassword = 'Confirme a password'
    } else if (formData.password !== formData.confirmarPassword) {
      newErrors.confirmarPassword = 'As passwords não coincidem'
    }

    if (formData.telefone && !/^\d{9}$/.test(formData.telefone)) {
      newErrors.telefone = 'O telefone deve ter 9 dígitos'
    }

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log('Dados do formulário:', formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="register-success">
        <h2>Registo efetuado com sucesso!</h2>
        <p>Bem-vindo, {formData.nome}!</p>
        <button
          onClick={() => {
            setSubmitted(false)
            setFormData({
              nome: '',
              email: '',
              password: '',
              confirmarPassword: '',
              telefone: '',
              dataNascimento: '',
            })
          }}
        >
          Novo registo
        </button>
      </div>
    )
  }

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <h2>Criar Conta</h2>

      <div className="form-group">
        <label htmlFor="nome">Nome *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Insira o seu nome"
        />
        {errors.nome && <span className="error">{errors.nome}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemplo@email.com"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmarPassword">Confirmar Password *</label>
        <input
          type="password"
          id="confirmarPassword"
          name="confirmarPassword"
          value={formData.confirmarPassword}
          onChange={handleChange}
          placeholder="Repita a password"
        />
        {errors.confirmarPassword && (
          <span className="error">{errors.confirmarPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="telefone">Telefone</label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="912345678"
        />
        {errors.telefone && <span className="error">{errors.telefone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="dataNascimento">Data de Nascimento</label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="submit-btn">Registar</button>
    </form>
  )
}

export default RegisterForm
