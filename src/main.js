const nav = document.querySelector('.nav-list')
const menuButton = document.querySelector('.hamburguer')
const menuLinks = document.querySelectorAll('.nav-list a')
const currentYear = document.querySelector('#ano-atual')
const contactForm = document.querySelector('#contact-form')

function toggleMenu() {
  const isOpen = nav.classList.toggle('active')
  menuButton.setAttribute('aria-expanded', String(isOpen))
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu')
  document.body.classList.toggle('menu-open', isOpen)
}

menuButton?.addEventListener('click', toggleMenu)

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('active')
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.setAttribute('aria-label', 'Abrir menu')
    document.body.classList.remove('menu-open')
  })
})

currentYear.textContent = new Date().getFullYear()

const revealElements = document.querySelectorAll('.reveal')
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.16 })

revealElements.forEach((element) => observer.observe(element))

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault()

  const nome = document.querySelector('#nome').value.trim()
  const email = document.querySelector('#email').value.trim()
  const mensagem = document.querySelector('#mensagem').value.trim()

  const subject = encodeURIComponent(`Contato pelo portfólio - ${nome}`)
  const body = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`)

  window.location.href = `mailto:seuemail@exemplo.com?subject=${subject}&body=${body}`
})


const portfolioCarousel = document.querySelector('.portfolio-carousel')

if (portfolioCarousel) {
  const track = portfolioCarousel.querySelector('.portfolio-track')
  const prevButton = portfolioCarousel.querySelector('.portfolio-arrow--prev')
  const nextButton = portfolioCarousel.querySelector('.portfolio-arrow--next')
  const originalColumns = Array.from(track.children).map((column) => column.outerHTML)

  let visibleColumns = 4
  let currentIndex = 0
  let isAnimating = false

  const getVisibleColumns = () => {
    if (window.innerWidth <= 720) return 1
    if (window.innerWidth <= 1024) return 2
    if (window.innerWidth <= 1180) return 3
    return 4
  }

  const getStep = () => {
    const firstColumn = track.querySelector('.portfolio-column')
    const gap = parseFloat(getComputedStyle(track).gap) || 0
    return firstColumn ? firstColumn.getBoundingClientRect().width + gap : 0
  }

  const setCarouselPosition = (animate = true) => {
    track.style.transition = animate ? 'transform 0.6s ease' : 'none'
    track.style.transform = `translateX(-${currentIndex * getStep()}px)`
  }

  const buildPortfolioCarousel = () => {
    visibleColumns = getVisibleColumns()
    track.innerHTML = ''

    const clonesBefore = originalColumns.slice(-visibleColumns)
    const clonesAfter = originalColumns.slice(0, visibleColumns)

    track.insertAdjacentHTML('beforeend', clonesBefore.join(''))
    track.insertAdjacentHTML('beforeend', originalColumns.join(''))
    track.insertAdjacentHTML('beforeend', clonesAfter.join(''))

    currentIndex = visibleColumns
    requestAnimationFrame(() => setCarouselPosition(false))
  }

  const movePortfolio = (direction) => {
    if (isAnimating) return
    isAnimating = true
    currentIndex += direction * visibleColumns
    setCarouselPosition(true)
  }

  prevButton?.addEventListener('click', () => movePortfolio(-1))
  nextButton?.addEventListener('click', () => movePortfolio(1))

  track.addEventListener('transitionend', () => {
    const total = originalColumns.length

    if (currentIndex >= total + visibleColumns) {
      currentIndex = visibleColumns + (currentIndex - total - visibleColumns)
      setCarouselPosition(false)
    }

    if (currentIndex < visibleColumns) {
      currentIndex = total + currentIndex
      setCarouselPosition(false)
    }

    isAnimating = false
  })

  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(buildPortfolioCarousel, 180)
  })

  buildPortfolioCarousel()
}

const modal = document.querySelector('#project-modal')
const modalImage = document.querySelector('#project-modal-image')
const modalTitle = document.querySelector('#project-modal-title')
const modalCategory = document.querySelector('#project-modal-category')
const modalDescription = document.querySelector('#project-modal-description')
const modalGithub = document.querySelector('#project-modal-github')
const modalLive = document.querySelector('#project-modal-live')

const openProjectModal = (projectElement) => {
  if (!modal || !projectElement) return

  const { title, category, description, image, github, live } = projectElement.dataset

  modalTitle.textContent = title || 'Projeto'
  modalCategory.textContent = category || 'Projeto'
  modalDescription.textContent = description || 'Descrição do projeto.'
  modalImage.src = image || 'src/imgs/caixa7.png'
  modalImage.alt = `Prévia ampliada do projeto ${title || ''}`.trim()
  modalGithub.href = github || '#'
  modalLive.href = live || '#'

  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
}

const closeProjectModal = () => {
  if (!modal) return
  modal.classList.remove('is-open')
  modal.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('modal-open')
}

document.addEventListener('click', (event) => {
  const selectedProject = event.target.closest('.portfolio-item')
  const closeButton = event.target.closest('[data-close-modal]')

  if (selectedProject && selectedProject.closest('.portfolio-carousel')) {
    openProjectModal(selectedProject)
  }

  if (closeButton) {
    closeProjectModal()
  }
})

document.addEventListener('keydown', (event) => {
  const selectedProject = document.activeElement?.closest?.('.portfolio-item')

  if ((event.key === 'Enter' || event.key === ' ') && selectedProject) {
    event.preventDefault()
    openProjectModal(selectedProject)
  }

  if (event.key === 'Escape') {
    closeProjectModal()
  }
})
