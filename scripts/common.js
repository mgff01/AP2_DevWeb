// Requisito 2: controle do menu hamburguer para dispositivos móveis
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('site-navigation');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
