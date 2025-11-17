//API pública dummyjson
const CATEGORY_API_URL = 'https://dummyjson.com/products/category/';
// Cache de elementos do DOM para evitar queries repetidas durante as interações
const categoryGallery = document.getElementById('categoryGallery');
const categoryFeedback = document.getElementById('categoryFeedback');
const filterButtons = document.querySelectorAll('.filter-button');
const focusFiltersButton = document.getElementById('focusFilters');
const filterWrapper = document.querySelector('.button-grid');

//botão dedicado para direcionar o usuário aos filtros
if (focusFiltersButton && filterWrapper) {
  focusFiltersButton.addEventListener('click', () => {
    filterWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}


// Função responsável por buscar os produtos da categoria informada
async function fetchProductsByCategory(category) {
  const response = await fetch(`${CATEGORY_API_URL}${category}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar a categoria.');
  }
  const data = await response.json();
  return data.products ?? [];
}

// Monta cada cartão de produto com fallback para a imagem, caso não exista thumbnail
function buildCategoryCard(product) {
  const image = Array.isArray(product.images) && product.images.length ? product.images[0] : product.thumbnail;
  return `
    <article class="product-card">
      <span class="pill">${product.category}</span>
      <img src="${image}" alt="${product.title}" loading="lazy" />
      <div>
        <h3>${product.id} - ${product.title}</h3>
        <p>${product.description}</p>
      </div>
    </article>
  `;
}

// Insere os cartões na galeria de forma dinâmica
function renderCategoryProducts(products) {
  categoryGallery.innerHTML = products.map(buildCategoryCard).join('');
}

// Desabilita ou habilita todos os botões de filtro durante a requisição
function setButtonsState(isDisabled) {
  filterButtons.forEach((button) => {
    button.disabled = isDisabled;
  });
}

// Atualiza a mensagem de feedback para o usuário, exibindo sucesso ou erro
function showCategoryFeedback(message, isError = false) {
  categoryFeedback.textContent = message;
  categoryFeedback.style.color = isError ? '#b42318' : '#0a6f65';
}

// Pipeline acionado ao clicar em um filtro de categoria
async function handleCategoryClick(category) {
  showCategoryFeedback('Carregando produtos...');
  setButtonsState(true);
  try {
    const products = await fetchProductsByCategory(category);
    if (!products.length) {
      showCategoryFeedback('Nenhum produto encontrado para esta categoria.', true);
      categoryGallery.innerHTML = '';
      return;
    }
    renderCategoryProducts(products);
    showCategoryFeedback(`Exibindo ${products.length} produtos de ${category}.`);
  } catch (error) {
    console.error(error);
    showCategoryFeedback('Erro ao carregar a categoria. Tente novamente.', true);
  } finally {
    setButtonsState(false);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleCategoryClick(button.dataset.category);
  });
});
