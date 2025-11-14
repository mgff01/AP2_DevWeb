const CATEGORY_API_URL = 'https://dummyjson.com/products/category/';
const categoryGallery = document.getElementById('categoryGallery');
const categoryFeedback = document.getElementById('categoryFeedback');
const filterButtons = document.querySelectorAll('.filter-button');
const focusFiltersButton = document.getElementById('focusFilters');
const filterWrapper = document.querySelector('.button-grid');

// Requisito 3: botão dedicado para direcionar o usuário aos filtros
if (focusFiltersButton && filterWrapper) {
  focusFiltersButton.addEventListener('click', () => {
    filterWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Requisito 6: filtrar produtos por categoria ao clicar nos botões
async function fetchProductsByCategory(category) {
  const response = await fetch(`${CATEGORY_API_URL}${category}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar a categoria.');
  }
  const data = await response.json();
  return data.products ?? [];
}

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

function renderCategoryProducts(products) {
  categoryGallery.innerHTML = products.map(buildCategoryCard).join('');
}

function setButtonsState(isDisabled) {
  filterButtons.forEach((button) => {
    button.disabled = isDisabled;
  });
}

function showCategoryFeedback(message, isError = false) {
  categoryFeedback.textContent = message;
  categoryFeedback.style.color = isError ? '#b42318' : '#0a6f65';
}

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
