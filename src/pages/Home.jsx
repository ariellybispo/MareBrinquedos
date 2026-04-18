import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import { getProducts } from "../services/productService"
import "./Home.css"

const testimonials = [
  {
    id: 1,
    name: "Ana Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Comprei vários brinquedos educativos para meu filho de 4 anos e ele adorou! A qualidade é excelente e o atendimento foi impecável. Recomendo a todos os pais!",
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    location: "Rio de Janeiro, RJ",
    rating: 4,
    text: "Minha filha ficou encantada com a boneca que comprei. A entrega foi rápida e o produto chegou em perfeito estado. Certamente voltarei a comprar!",
  },
  {
    id: 3,
    name: "Mariana Costa",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Os brinquedos para bebê são de excelente qualidade e seguros. Meu bebê de 8 meses adora os chocalhos coloridos. O preço é justo pela qualidade oferecida.",
  },
]

export default function Home() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [toast, setToast] = useState(null)
  const [isFinished, setIsFinished] = useState(false)
  const [countdown, setCountdown] = useState({
    days: 2, hours: 23, minutes: 59, seconds: 59,
  })

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.slice(0, 4))
      setBestSellers(data.slice(0, 8))
    })
  }, [])

  useEffect(() => {
    let totalSeconds =
      countdown.days * 86400 +
      countdown.hours * 3600 +
      countdown.minutes * 60 +
      countdown.seconds

    const interval = setInterval(() => {
      if (totalSeconds <= 0) {
        setIsFinished(true)
        clearInterval(interval)
        return
      }
      totalSeconds--
      setCountdown({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  function moveCarousel(direction) {
    const itemWidth = 300
    const visibleItems =
      window.innerWidth > 1200 ? 4 :
      window.innerWidth > 992 ? 3 :
      window.innerWidth > 768 ? 2 : 1
    const maxPosition = -(bestSellers.length - visibleItems) * itemWidth

    if (direction === "prev") {
      setCarouselPosition((prev) => Math.min(prev + itemWidth, 0))
    } else {
      setCarouselPosition((prev) => Math.max(prev - itemWidth, maxPosition))
    }
  }

  function subscribeNewsletter(e) {
    e.preventDefault()
    if (newsletterEmail) {
      setToast({ type: "success", title: "Inscrição realizada", message: "Obrigado por se inscrever em nossa newsletter!" })
      setNewsletterEmail("")
    } else {
      setToast({ type: "warn", title: "Campo obrigatório", message: "Por favor, informe seu e-mail para se inscrever." })
    }
  }

  function pad(n) {
    return String(n).padStart(2, "0")
  }

  return (
    <>
      <Header />

      {toast && (
        <div className={"toast-container toast-" + toast.type}>
          <strong>{toast.title}</strong>
          <p>{toast.message}</p>
        </div>
      )}

      <section className="hero">
        <div className="hero-content">
          <h1>Diversão sem fim</h1>
          <p>
            Explore nossa coleção de brinquedos encantadores e garanta momentos
            inesquecíveis para as crianças.
          </p>
          <a
            href="/products"
            className="hero-button"
            onClick={(e) => { e.preventDefault(); navigate("/products") }}
          >
            Ver todos os brinquedos
          </a>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 60 }}>
        <h2 className="section-title">Produtos em Destaque</h2>
        <div className="products">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="all-products">
          <button onClick={() => navigate("/products")}>Ver todos os produtos</button>
        </div>
      </section>

      <div className="line"></div>

      <section className="promo-section">
        <div className="promo-container">
          <div className="promo-text">
            <h2>
              Casa de Atividades para Bebês com Iluminação, Brinquedos Montessori - Emoticon
            </h2>
            <div className="price-container">
              <p className="original-price">R$ 299,90</p>
              <p className="discounted-price">R$ 199,90</p>
            </div>

            {!isFinished ? (
              <div className="countdown">
                {[
                  { value: countdown.days, label: "Dias" },
                  { value: countdown.hours, label: "Horas" },
                  { value: countdown.minutes, label: "Minutos" },
                  { value: countdown.seconds, label: "Segundos" },
                ].map(({ value, label }) => (
                  <div className="time-box" key={label}>
                    <span>{pad(value)}</span>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="promo-encerrada">Promoção encerrada!</div>
            )}

            <button className="buy-button" onClick={() => navigate("/carrinho")}>
              Compre agora
            </button>
          </div>
          <div className="promo-image">
            <img
              src="assets/img/cd7d6395-de7a-4032-bf55-3171ddae75cc.png"
              alt="Casa de Atividades Montessori"
            />
          </div>
        </div>
      </section>

      <section className="bestsellers-section">
        <div className="container">
          <h2 className="section-title">Mais Vendidos</h2>
          <div className="bestsellers-carousel">
            <div className="carousel-container">
              <div
                className="carousel-track"
                style={{ transform: "translateX(" + carouselPosition + "px)" }}
              >
                {bestSellers.map((p) => (
                  <div className="carousel-item" key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-control prev" onClick={() => moveCarousel("prev")}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="carousel-control next" onClick={() => moveCarousel("next")}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">O que nossos clientes dizem</h2>
          <div className="testimonials-container">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <div className="testimonial-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={"fas fa-star" + (star <= t.rating ? " active" : "")}
                    ></i>
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>{t.name}</h4>
                    <p>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefits-container">
          {[
            { icon: "fa-truck", title: "Entrega Rápida", desc: "Em todo o Brasil" },
            { icon: "fa-credit-card", title: "Pagamento Seguro", desc: "Diversas formas de pagamento" },
            { icon: "fa-exchange-alt", title: "Troca Garantida", desc: "7 dias para trocar" },
            { icon: "fa-headset", title: "Suporte ao Cliente", desc: "Atendimento especializado" },
          ].map(({ icon, title, desc }) => (
            <div className="benefit-item" key={title}>
              <div className="benefit-icon">
                <i className={"fas " + icon}></i>
              </div>
              <div className="benefit-text">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Fique por dentro das novidades!</h2>
              <p>Cadastre-se para receber ofertas exclusivas, lançamentos e dicas para as crianças.</p>
            </div>
            <form className="newsletter-form" onSubmit={subscribeNewsletter}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
              />
              <button type="submit">Cadastrar</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
