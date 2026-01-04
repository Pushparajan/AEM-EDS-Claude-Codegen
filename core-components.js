/**
 * AEM Core WCM Components Library
 * Templates for all Adobe AEM Core Components
 * Based on https://github.com/adobe/aem-core-wcm-components
 */

const coreComponents = {
  // ==================== TEMPLATE COMPONENTS ====================
  page: {
    category: 'template',
    description: 'Foundation page component with header, main, footer structure',
    js: `export default function decorate(block) {
  // Page component - sets up basic page structure
  const config = {
    title: block.querySelector('h1')?.textContent || '',
    description: block.querySelector('meta[name="description"]')?.content || ''
  };

  // Set up page metadata
  document.title = config.title;

  // Initialize sections
  const sections = block.querySelectorAll('.section');
  sections.forEach((section, index) => {
    section.setAttribute('data-section-id', index);
  });

  // Accessibility enhancements
  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content');
  }
}
`,
    css: `.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--background-color, #fff);
}

.page main {
  flex: 1;
}

.page .section {
  padding: 40px 20px;
}

.page .section-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}
`
  },

  navigation: {
    category: 'template',
    description: 'Primary site navigation with dropdown support',
    js: `export default function decorate(block) {
  const nav = block.querySelector('nav') || block;
  const ul = nav.querySelector('ul');

  if (!ul) return;

  // Add ARIA attributes
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  // Handle dropdown menus
  const items = ul.querySelectorAll('li');
  items.forEach((item) => {
    const subMenu = item.querySelector('ul');
    if (subMenu) {
      item.classList.add('has-dropdown');
      const link = item.querySelector('a');

      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', !expanded);
        item.classList.toggle('active');
      });
    }
  });

  // Mobile menu toggle
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  toggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });

  block.prepend(toggle);
}
`,
    css: `.navigation {
  position: relative;
}

.navigation nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 20px;
}

.navigation nav a {
  text-decoration: none;
  color: var(--text-color, #333);
  padding: 10px 15px;
  display: block;
}

.navigation nav a:hover {
  background-color: var(--hover-bg, #f5f5f5);
}

.navigation .has-dropdown {
  position: relative;
}

.navigation .has-dropdown ul {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 200px;
  flex-direction: column;
  gap: 0;
}

.navigation .has-dropdown.active ul {
  display: flex;
}

.navigation .nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.navigation .nav-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background: var(--text-color, #333);
  margin: 5px 0;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .navigation .nav-toggle {
    display: block;
  }

  .navigation nav ul {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .navigation.nav-open nav ul {
    display: flex;
  }
}
`
  },

  breadcrumb: {
    category: 'template',
    description: 'Hierarchical page navigation breadcrumb trail',
    js: `export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  const items = [...block.children];
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';

    const link = item.querySelector('a');
    if (link) {
      li.appendChild(link);
    } else {
      li.textContent = item.textContent;
    }

    // Mark last item as current
    if (index === items.length - 1) {
      li.setAttribute('aria-current', 'page');
      li.classList.add('current');
    }

    ol.appendChild(li);
  });

  nav.appendChild(ol);
  block.textContent = '';
  block.appendChild(nav);
}
`,
    css: `.breadcrumb {
  padding: 15px 0;
}

.breadcrumb-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  margin-left: 8px;
  color: var(--text-color-muted, #666);
}

.breadcrumb-item a {
  color: var(--link-color, #0066cc);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item.current {
  color: var(--text-color, #333);
  font-weight: 500;
}
`
  },

  search: {
    category: 'template',
    description: 'Quick search functionality with autocomplete',
    js: `export default function decorate(block) {
  const searchForm = document.createElement('form');
  searchForm.className = 'search-form';
  searchForm.setAttribute('role', 'search');

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'search-input';
  searchInput.placeholder = 'Search...';
  searchInput.setAttribute('aria-label', 'Search');

  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'search-button';
  searchButton.textContent = 'Search';
  searchButton.setAttribute('aria-label', 'Submit search');

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';
  resultsContainer.setAttribute('aria-live', 'polite');

  // Autocomplete functionality
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 3) {
      resultsContainer.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(() => {
      performSearch(query, resultsContainer);
    }, 300);
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = \`/search?q=\${encodeURIComponent(query)}\`;
    }
  });

  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);

  block.textContent = '';
  block.appendChild(searchForm);
  block.appendChild(resultsContainer);
}

function performSearch(query, container) {
  // TODO: Implement search API call
  container.innerHTML = '<div class="search-loading">Searching...</div>';

  // Placeholder for search results
  setTimeout(() => {
    container.innerHTML = \`
      <div class="search-result">
        <a href="#"><strong>Example Result</strong> - Search for: \${query}</a>
      </div>
    \`;
  }, 500);
}
`,
    css: `.search {
  position: relative;
}

.search-form {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  font-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color, #0066cc);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.search-button {
  padding: 10px 20px;
  background-color: var(--primary-color, #0066cc);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.search-button:hover {
  background-color: var(--primary-color-dark, #0052a3);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-color, #ddd);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.search-result {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}

.search-result:hover {
  background-color: var(--hover-bg, #f5f5f5);
}

.search-result a {
  color: var(--text-color, #333);
  text-decoration: none;
}
`
  },

  // ==================== PAGE AUTHORING COMPONENTS ====================

  title: {
    category: 'content',
    description: 'Page or section title with customizable heading level',
    js: `export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');

  if (!heading) return;

  // Add optional subtitle support
  const subtitle = block.querySelector('p');
  if (subtitle) {
    subtitle.classList.add('title-subtitle');
  }

  // Add optional link
  const link = block.querySelector('a');
  if (link && link !== heading.querySelector('a')) {
    link.classList.add('title-link');
  }
}
`,
    css: `.title h1, .title h2, .title h3, .title h4, .title h5, .title h6 {
  margin: 0 0 10px 0;
  font-weight: 700;
  line-height: 1.2;
  color: var(--heading-color, #1a1a1a);
}

.title-subtitle {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-color-muted, #666);
  font-weight: 400;
}

.title-link {
  display: inline-block;
  margin-top: 15px;
  color: var(--link-color, #0066cc);
  text-decoration: none;
  font-weight: 500;
}

.title-link:hover {
  text-decoration: underline;
}
`
  },

  text: {
    category: 'content',
    description: 'Rich text content with formatting support',
    js: `export default function decorate(block) {
  // Process rich text elements
  const paragraphs = block.querySelectorAll('p');

  paragraphs.forEach((p) => {
    // Add responsive typography
    const words = p.textContent.split(' ').length;
    if (words > 100) {
      p.classList.add('text-long');
    }
  });

  // Style quotes
  const quotes = block.querySelectorAll('blockquote');
  quotes.forEach((quote) => {
    quote.classList.add('text-quote');
  });

  // Style code blocks
  const codeBlocks = block.querySelectorAll('pre code');
  codeBlocks.forEach((code) => {
    code.parentElement.classList.add('text-code');
  });
}
`,
    css: `.text {
  line-height: 1.7;
  color: var(--text-color, #333);
}

.text p {
  margin: 0 0 1em 0;
}

.text h1, .text h2, .text h3, .text h4, .text h5, .text h6 {
  margin: 1.5em 0 0.5em 0;
  line-height: 1.3;
}

.text a {
  color: var(--link-color, #0066cc);
}

.text-quote {
  margin: 1.5em 0;
  padding: 1em 1.5em;
  border-left: 4px solid var(--primary-color, #0066cc);
  background: var(--bg-light, #f9f9f9);
  font-style: italic;
}

.text-code {
  background: #f4f4f4;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

.text ul, .text ol {
  margin: 1em 0;
  padding-left: 2em;
}

.text li {
  margin: 0.5em 0;
}
`
  },

  image: {
    category: 'content',
    description: 'Responsive image with lazy loading and caption support',
    js: `export default function decorate(block) {
  const images = block.querySelectorAll('img');

  images.forEach((img) => {
    // Add lazy loading
    img.loading = 'lazy';

    // Wrap in picture element for responsive images
    if (!img.parentElement.tagName === 'PICTURE') {
      const picture = document.createElement('picture');
      const parent = img.parentElement;
      parent.insertBefore(picture, img);
      picture.appendChild(img);
    }

    // Add image caption if available
    const caption = img.getAttribute('alt');
    if (caption && !img.nextElementSibling?.classList.contains('image-caption')) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'image-caption';
      figcaption.textContent = caption;
      img.parentElement.appendChild(figcaption);
    }

    // Add loading state
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
  });
}
`,
    css: `.image {
  margin: 20px 0;
}

.image picture {
  display: block;
  position: relative;
}

.image img {
  width: 100%;
  height: auto;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image img.loaded {
  opacity: 1;
}

.image-caption {
  margin-top: 10px;
  font-size: 0.875rem;
  color: var(--text-color-muted, #666);
  text-align: center;
  font-style: italic;
}

.image.full-width {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}
`
  },

  button: {
    category: 'content',
    description: 'Call-to-action button with variants',
    js: `export default function decorate(block) {
  const buttons = block.querySelectorAll('a');

  buttons.forEach((button) => {
    // Determine button variant from classes or data attributes
    const variant = button.getAttribute('data-variant') || 'primary';
    button.classList.add(\`button-\${variant}\`);

    // Add icon support
    const icon = button.getAttribute('data-icon');
    if (icon) {
      const iconEl = document.createElement('span');
      iconEl.className = \`button-icon icon-\${icon}\`;
      button.insertBefore(iconEl, button.firstChild);
    }

    // Analytics tracking
    button.addEventListener('click', (e) => {
      // Track button click
      console.log('Button clicked:', button.textContent);
    });
  });
}
`,
    css: `.button a {
  display: inline-block;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.button-primary {
  background-color: var(--primary-color, #0066cc);
  color: white;
}

.button-primary:hover {
  background-color: var(--primary-color-dark, #0052a3);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.button-secondary {
  background-color: var(--secondary-color, #6c757d);
  color: white;
}

.button-secondary:hover {
  background-color: #5a6268;
}

.button-outline {
  background-color: transparent;
  border: 2px solid var(--primary-color, #0066cc);
  color: var(--primary-color, #0066cc);
}

.button-outline:hover {
  background-color: var(--primary-color, #0066cc);
  color: white;
}

.button-icon {
  margin-right: 8px;
}
`
  },

  teaser: {
    category: 'content',
    description: 'Promotional teaser card with image, title, description, and CTA',
    js: `export default function decorate(block) {
  const rows = [...block.children];

  // Restructure teaser content
  const teaser = document.createElement('div');
  teaser.className = 'teaser-content';

  rows.forEach((row) => {
    const cells = [...row.children];

    cells.forEach((cell) => {
      // Identify content type
      const img = cell.querySelector('img');
      const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
      const link = cell.querySelector('a');
      const text = cell.querySelector('p');

      if (img) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'teaser-image';
        imageWrapper.appendChild(img);
        teaser.appendChild(imageWrapper);
      }

      if (heading) {
        heading.className = 'teaser-title';
        teaser.appendChild(heading);
      }

      if (text && !text.querySelector('a')) {
        text.className = 'teaser-description';
        teaser.appendChild(text);
      }

      if (link) {
        link.className = 'teaser-cta';
        teaser.appendChild(link);
      }
    });
  });

  block.textContent = '';
  block.appendChild(teaser);
}
`,
    css: `.teaser {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.teaser:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.teaser-image {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.teaser-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.teaser:hover .teaser-image img {
  transform: scale(1.05);
}

.teaser-content {
  padding: 20px;
}

.teaser-title {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.teaser-description {
  margin: 0 0 15px 0;
  color: var(--text-color-muted, #666);
  line-height: 1.6;
}

.teaser-cta {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--primary-color, #0066cc);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
}

.teaser-cta:hover {
  background-color: var(--primary-color-dark, #0052a3);
}
`
  },

  // ==================== CONTAINER COMPONENTS ====================

  carousel: {
    category: 'container',
    description: 'Image or content carousel with navigation controls',
    js: `export default function decorate(block) {
  const slides = [...block.children];

  if (slides.length === 0) return;

  // Wrap slides
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';

  slides.forEach((slide, index) => {
    slide.className = 'carousel-slide';
    slide.setAttribute('data-slide-index', index);
    if (index === 0) slide.classList.add('active');
    slidesContainer.appendChild(slide);
  });

  // Create navigation
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-nav carousel-prev';
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.innerHTML = '‹';

  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-nav carousel-next';
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.innerHTML = '›';

  // Create indicators
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';

  slides.forEach((_, index) => {
    const indicator = document.createElement('button');
    indicator.className = 'carousel-indicator';
    indicator.setAttribute('aria-label', \`Go to slide \${index + 1}\`);
    indicator.setAttribute('data-slide', index);
    if (index === 0) indicator.classList.add('active');
    indicators.appendChild(indicator);
  });

  let currentSlide = 0;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    indicators.children[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    indicators.children[currentSlide].classList.add('active');

    slidesContainer.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
  }

  prevButton.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextButton.addEventListener('click', () => goToSlide(currentSlide + 1));

  indicators.addEventListener('click', (e) => {
    if (e.target.classList.contains('carousel-indicator')) {
      goToSlide(parseInt(e.target.getAttribute('data-slide')));
    }
  });

  // Auto-play
  let autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

  block.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  block.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });

  block.textContent = '';
  block.appendChild(prevButton);
  block.appendChild(slidesContainer);
  block.appendChild(nextButton);
  block.appendChild(indicators);
}
`,
    css: `.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  z-index: 10;
  transition: background 0.3s;
}

.carousel-nav:hover {
  background: rgba(0,0,0,0.8);
}

.carousel-prev {
  left: 20px;
}

.carousel-next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.carousel-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.carousel-indicator.active,
.carousel-indicator:hover {
  background: white;
}
`
  },

  tabs: {
    category: 'container',
    description: 'Tabbed content interface',
    js: `export default function decorate(block) {
  const sections = [...block.children];

  if (sections.length === 0) return;

  // Create tab navigation
  const tabList = document.createElement('div');
  tabList.className = 'tabs-nav';
  tabList.setAttribute('role', 'tablist');

  // Create tab panels container
  const tabPanels = document.createElement('div');
  tabPanels.className = 'tabs-panels';

  sections.forEach((section, index) => {
    const title = section.querySelector('h1, h2, h3, h4, h5, h6');
    const content = section.cloneNode(true);

    if (title) {
      title.remove();

      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.className = 'tab-button';
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', index === 0);
      tabButton.setAttribute('aria-controls', \`panel-\${index}\`);
      tabButton.textContent = title.textContent;

      if (index === 0) tabButton.classList.add('active');

      tabList.appendChild(tabButton);
    }

    // Create tab panel
    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', \`panel-\${index}\`);
    panel.innerHTML = content.innerHTML;

    if (index === 0) panel.classList.add('active');

    tabPanels.appendChild(panel);
  });

  // Tab switching logic
  tabList.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab-button')) return;

    const buttons = tabList.querySelectorAll('.tab-button');
    const panels = tabPanels.querySelectorAll('.tab-panel');
    const index = [...buttons].indexOf(e.target);

    buttons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', i === index);
    });

    panels.forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
    });
  });

  block.textContent = '';
  block.appendChild(tabList);
  block.appendChild(tabPanels);
}
`,
    css: `.tabs {
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  overflow: hidden;
}

.tabs-nav {
  display: flex;
  background: var(--bg-light, #f5f5f5);
  border-bottom: 1px solid var(--border-color, #ddd);
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  color: var(--text-color-muted, #666);
}

.tab-button:hover {
  background: var(--hover-bg, #e9e9e9);
}

.tab-button.active {
  background: white;
  border-bottom-color: var(--primary-color, #0066cc);
  color: var(--primary-color, #0066cc);
}

.tabs-panels {
  background: white;
}

.tab-panel {
  display: none;
  padding: 30px;
  animation: fadeIn 0.3s;
}

.tab-panel.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .tabs-nav {
    flex-direction: column;
  }

  .tab-button {
    border-bottom: none;
    border-left: 3px solid transparent;
  }

  .tab-button.active {
    border-left-color: var(--primary-color, #0066cc);
  }
}
`
  },

  accordion: {
    category: 'container',
    description: 'Expandable accordion panels',
    js: `export default function decorate(block) {
  const sections = [...block.children];

  sections.forEach((section, index) => {
    const title = section.querySelector('h1, h2, h3, h4, h5, h6');
    const content = section.cloneNode(true);

    if (title) {
      title.remove();

      // Create accordion item
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item';

      // Create header button
      const header = document.createElement('button');
      header.className = 'accordion-header';
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('aria-controls', \`accordion-panel-\${index}\`);
      header.innerHTML = \`
        <span class="accordion-title">\${title.textContent}</span>
        <span class="accordion-icon">+</span>
      \`;

      // Create panel
      const panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.setAttribute('id', \`accordion-panel-\${index}\`);
      panel.innerHTML = content.innerHTML;

      // Toggle functionality
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        // Close all panels (optional - remove for multi-open)
        block.querySelectorAll('.accordion-header').forEach(h => {
          h.setAttribute('aria-expanded', 'false');
          h.classList.remove('active');
        });
        block.querySelectorAll('.accordion-panel').forEach(p => {
          p.classList.remove('active');
        });

        // Toggle current panel
        if (!isExpanded) {
          header.setAttribute('aria-expanded', 'true');
          header.classList.add('active');
          panel.classList.add('active');
        }
      });

      accordionItem.appendChild(header);
      accordionItem.appendChild(panel);
      section.replaceWith(accordionItem);
    }
  });
}
`,
    css: `.accordion {
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  overflow: hidden;
}

.accordion-item {
  border-bottom: 1px solid var(--border-color, #ddd);
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  width: 100%;
  padding: 20px;
  background: white;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  transition: background 0.3s;
}

.accordion-header:hover {
  background: var(--bg-light, #f9f9f9);
}

.accordion-header.active {
  background: var(--bg-light, #f5f5f5);
}

.accordion-icon {
  font-size: 24px;
  transition: transform 0.3s;
}

.accordion-header.active .accordion-icon {
  transform: rotate(45deg);
}

.accordion-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-panel.active {
  max-height: 2000px;
  padding: 20px;
  border-top: 1px solid var(--border-color, #ddd);
}
`
  },

  // ==================== FORM COMPONENTS ====================

  form: {
    category: 'form',
    description: 'Form container with validation',
    js: `export default function decorate(block) {
  const form = block.querySelector('form');

  if (!form) return;

  // Add form validation
  form.setAttribute('novalidate', 'true');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(err => err.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

    // Validate form
    const formData = new FormData(form);
    const errors = validateForm(formData, form);

    if (Object.keys(errors).length > 0) {
      // Show errors
      Object.entries(errors).forEach(([name, message]) => {
        const field = form.querySelector(\`[name="\${name}"]\`);
        if (field) {
          field.classList.add('error');
          const errorMsg = document.createElement('span');
          errorMsg.className = 'error-message';
          errorMsg.textContent = message;
          field.parentElement.appendChild(errorMsg);
        }
      });
      return;
    }

    // Submit form
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const response = await fetch(form.action || '/api/form-submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        form.innerHTML = '<p class="form-success">Thank you! Your form has been submitted.</p>';
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      const errorMsg = document.createElement('p');
      errorMsg.className = 'form-error';
      errorMsg.textContent = 'An error occurred. Please try again.';
      form.insertBefore(errorMsg, form.firstChild);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    }
  });
}

function validateForm(formData, form) {
  const errors = {};

  // Required fields
  form.querySelectorAll('[required]').forEach(field => {
    const value = formData.get(field.name);
    if (!value || value.trim() === '') {
      errors[field.name] = 'This field is required';
    }
  });

  // Email validation
  form.querySelectorAll('[type="email"]').forEach(field => {
    const value = formData.get(field.name);
    if (value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
      errors[field.name] = 'Please enter a valid email address';
    }
  });

  return errors;
}
`,
    css: `.form {
  max-width: 600px;
  margin: 0 auto;
}

.form form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form .form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form label {
  font-weight: 600;
  color: var(--text-color, #333);
}

.form input,
.form textarea,
.form select {
  padding: 12px 15px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

.form input:focus,
.form textarea:focus,
.form select:focus {
  outline: none;
  border-color: var(--primary-color, #0066cc);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form input.error,
.form textarea.error,
.form select.error {
  border-color: #dc3545;
}

.form .error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.form button[type="submit"] {
  padding: 12px 24px;
  background-color: var(--primary-color, #0066cc);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.form button[type="submit"]:hover:not(:disabled) {
  background-color: var(--primary-color-dark, #0052a3);
}

.form button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-success {
  padding: 20px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}

.form-error {
  padding: 15px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
`
  }
};

// Component categories for organization
const componentCategories = {
  template: ['page', 'navigation', 'breadcrumb', 'search'],
  content: ['title', 'text', 'image', 'button', 'teaser'],
  container: ['carousel', 'tabs', 'accordion'],
  form: ['form']
};

module.exports = { coreComponents, componentCategories };
