const API_URL = 'https://dummyjson.com/products';
const randomProductBtn = document.getElementById('randomProductBtn');
const randomProductGallery = document.getElementById('randomProductGallery');
const randomProductFeedback = document.getElementById('randomProductFeedback');

// Requisito 5: busca dos dados da API e sorteio de um produto
async function fetchAllProducts() {
  const response = await fetch(`${API_URL}?limit=100`);
  if (!response.ok) {
    throw new Error('Não foi possível obter os produtos.');
  }
  const data = await response.json();
  return data.products ?? [];
}

function buildProductCard(product) {
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

function showProduct(product) {
  randomProductGallery.innerHTML = buildProductCard(product);
}

function showFeedback(message, isError = false) {
  randomProductFeedback.textContent = message;
  randomProductFeedback.style.color = isError ? '#b42318' : '#0a6f65';
}

async function handleRandomProduct() {
  if (!randomProductBtn) return;
  randomProductBtn.disabled = true;
  showFeedback('Buscando um produto aleatório...');

  try {
    const products = await fetchAllProducts();
    if (!products.length) {
      throw new Error('A API não retornou produtos.');
    }
    const randomIndex = Math.floor(Math.random() * products.length);
    showProduct(products[randomIndex]);
    showFeedback('Produto carregado com sucesso!');
  } catch (error) {
    console.error(error);
    showFeedback('Erro ao carregar produto. Tente novamente em instantes.', true);
  } finally {
    randomProductBtn.disabled = false;
  }
}

if (randomProductBtn) {
  randomProductBtn.addEventListener('click', handleRandomProduct);
}
