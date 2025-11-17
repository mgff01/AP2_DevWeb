// Requisito 2: controle do menu hamburguer para dispositivos móveis
// Seleciona o botão de menu e a navegação principal utilizados nas páginas
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('site-navigation');

// Só aplica o comportamento se ambos os elementos existirem no DOM atual
if (menuToggle && navigation) {
  // Alterna o estado aberto/fechado ao clicar no botão do menu
  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Em telas maiores, garante que o menu fique visível e com aria consistente
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
