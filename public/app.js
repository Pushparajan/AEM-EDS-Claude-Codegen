// AEM EDS Code Generator - Web Application

let currentGenerator = null;
let selectedCategory = null;
let selectedComponent = null;
let uploadedImage = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadCoreComponentCategories();
});

function initializeEventListeners() {
  // Generator card selection
  document.querySelectorAll('.card[data-generator]').forEach(card => {
    card.addEventListener('click', () => {
      const generator = card.dataset.generator;
      showGenerator(generator);
    });
  });

  // Form submissions
  document.getElementById('blockForm')?.addEventListener('submit', handleBlockSubmit);
  document.getElementById('componentForm')?.addEventListener('submit', handleComponentSubmit);
  document.getElementById('htmlTemplateForm')?.addEventListener('submit', handleTemplateSubmit);
  document.getElementById('imageAnalysisForm')?.addEventListener('submit', handleImageSubmit);
  document.getElementById('initForm')?.addEventListener('submit', handleProjectInitSubmit);
  document.getElementById('urlForm')?.addEventListener('submit', handleUrlSubmit);

  // Image upload
  setupImageUpload();

  // Analysis mode change
  document.querySelectorAll('input[name="analysisMode"]').forEach(radio => {
    radio.addEventListener('change', handleAnalysisModeChange);
  });

  // Color picker sync
  syncColorPickers();
}

function showGenerator(type) {
  hideAllSections();
  currentGenerator = type;

  const formMap = {
    'custom-block': 'customBlockForm',
    'custom-component': 'customComponentForm',
    'template': 'templateForm',
    'core-component': 'coreComponentForm',
    'image-component': 'imageComponentForm',
    'project-init': 'projectInitForm',
    'url-site': 'urlSiteForm'
  };

  const formId = formMap[type];
  if (formId) {
    document.getElementById(formId).classList.remove('hidden');
  }
}

function showGeneratorSelect() {
  hideAllSections();
  document.getElementById('generatorSelect').classList.remove('hidden');
  currentGenerator = null;
}

function hideAllSections() {
  document.querySelectorAll('.generator-form, .result').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById('generatorSelect').classList.add('hidden');
}

// Custom Block Generator
async function handleBlockSubmit(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('blockName').value,
    options: {
      hasButtons: document.getElementById('blockButtons').checked,
      lazyLoad: document.getElementById('blockLazyLoad').checked,
      responsive: document.getElementById('blockResponsive').checked
    }
  };

  showLoading(true);

  try {
    const response = await fetch('/api/generate-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    showResult(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate block. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Custom Component Generator
async function handleComponentSubmit(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('componentName').value,
    type: document.getElementById('componentType').value
  };

  showLoading(true);

  try {
    const response = await fetch('/api/generate-component', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    showResult(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate component. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Template Generator
async function handleTemplateSubmit(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('templateName').value
  };

  showLoading(true);

  try {
    const response = await fetch('/api/generate-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    showResult(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate template. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Core Component Library
async function loadCoreComponentCategories() {
  try {
    const response = await fetch('/api/core-components/categories');
    const categories = await response.json();

    const container = document.getElementById('categoryButtons');
    container.innerHTML = '';

    categories.forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      button.dataset.category = category;
      button.addEventListener('click', () => loadComponentsForCategory(category, button));
      container.appendChild(button);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadComponentsForCategory(category, button) {
  selectedCategory = category;

  // Update button states
  document.querySelectorAll('#categoryButtons button').forEach(btn => {
    btn.classList.remove('active');
  });
  button.classList.add('active');

  try {
    const response = await fetch(`/api/core-components/category/${category}`);
    const components = await response.json();

    const container = document.getElementById('componentList');
    container.innerHTML = '';

    components.forEach(component => {
      const item = document.createElement('div');
      item.className = 'component-item';
      item.dataset.component = component.name;
      item.innerHTML = `
        <h4>${component.name.charAt(0).toUpperCase() + component.name.slice(1)}</h4>
        <p>${component.description}</p>
      `;
      item.addEventListener('click', () => selectComponent(component.name, item));
      container.appendChild(item);
    });

    document.getElementById('componentListGroup').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

function selectComponent(componentName, element) {
  selectedComponent = componentName;

  document.querySelectorAll('.component-item').forEach(item => {
    item.classList.remove('selected');
  });
  element.classList.add('selected');

  document.getElementById('generateCoreBtn').classList.remove('hidden');
}

document.getElementById('generateCoreBtn')?.addEventListener('click', async () => {
  if (!selectedComponent) return;

  showLoading(true);

  try {
    const response = await fetch('/api/generate-core-component', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: selectedCategory,
        component: selectedComponent
      })
    });

    const result = await response.json();
    showResult(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate component. Please try again.');
  } finally {
    showLoading(false);
  }
});

// Image Upload
function setupImageUpload() {
  const uploadArea = document.getElementById('uploadArea');
  const imageInput = document.getElementById('imageInput');

  uploadArea.addEventListener('click', () => imageInput.click());

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  });

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  });
}

function handleImageFile(file) {
  uploadedImage = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('uploadArea').classList.add('hidden');
    document.getElementById('imagePreview').classList.remove('hidden');
    document.getElementById('imageAnalysisForm').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  uploadedImage = null;
  document.getElementById('imageInput').value = '';
  document.getElementById('uploadArea').classList.remove('hidden');
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('imageAnalysisForm').classList.add('hidden');
}

function handleAnalysisModeChange(e) {
  const mode = e.target.value;

  document.getElementById('interactiveFields').classList.add('hidden');
  document.getElementById('jsonFields').classList.add('hidden');

  if (mode === 'interactive') {
    document.getElementById('interactiveFields').classList.remove('hidden');
  } else if (mode === 'json') {
    document.getElementById('jsonFields').classList.remove('hidden');
  }
}

// Image Component Generator
async function handleImageSubmit(e) {
  e.preventDefault();

  if (!uploadedImage) {
    alert('Please upload an image first');
    return;
  }

  const mode = document.querySelector('input[name="analysisMode"]:checked').value;
  const componentName = document.getElementById('imageComponentName').value;

  let analysis = {};

  if (mode === 'interactive') {
    const layoutType = document.getElementById('layoutType').value;
    analysis = {
      layout: {
        type: layoutType,
        gap: '20px',
        hasHeader: false,
        hasFooter: false
      },
      colors: {
        primary: document.getElementById('primaryColorText').value,
        background: document.getElementById('bgColorText').value,
        text: document.getElementById('textColorText').value
      },
      typography: {
        fontFamily: document.getElementById('fontFamily').value,
        baseFontSize: '16px',
        lineHeight: '1.6'
      },
      components: [],
      interactions: []
    };

    if (layoutType === 'grid') {
      analysis.layout.columns = 'repeat(auto-fit, minmax(300px, 1fr))';
    } else if (layoutType === 'flex') {
      analysis.layout.direction = 'row';
    }

    if (document.getElementById('hasHover').checked) {
      analysis.interactions.push({ type: 'hover' });
    }
    if (document.getElementById('hasClick').checked) {
      analysis.interactions.push({ type: 'click' });
    }
  } else if (mode === 'json') {
    try {
      analysis = JSON.parse(document.getElementById('jsonInput').value);
    } catch (error) {
      alert('Invalid JSON format');
      return;
    }
  } else {
    // auto mode - use defaults
    analysis = {
      layout: { type: 'flex', direction: 'column', gap: '20px' },
      colors: { primary: '#0066cc', background: '#ffffff', text: '#333333' },
      typography: { fontFamily: 'system-ui, sans-serif', baseFontSize: '16px', lineHeight: '1.6' },
      components: [],
      interactions: []
    };
  }

  showLoading(true);

  try {
    const formData = new FormData();
    formData.append('image', uploadedImage);
    formData.append('componentName', componentName);
    formData.append('analysis', JSON.stringify(analysis));

    const response = await fetch('/api/generate-from-image', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    showResult(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate component from image. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Project Init
async function handleProjectInitSubmit(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('projectName').value
  };

  showLoading(true);

  try {
    const response = await fetch('/api/init-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    showResult(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to initialize project. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Color Picker Sync
function syncColorPickers() {
  const pairs = [
    ['primaryColor', 'primaryColorText'],
    ['bgColor', 'bgColorText'],
    ['textColor', 'textColorText']
  ];

  pairs.forEach(([colorId, textId]) => {
    const colorInput = document.getElementById(colorId);
    const textInput = document.getElementById(textId);

    if (colorInput && textInput) {
      colorInput.addEventListener('input', (e) => {
        textInput.value = e.target.value;
      });

      textInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(value)) {
          colorInput.value = value;
        }
      });
    }
  });
}

// Result Display
function showResult(result) {
  hideAllSections();

  const resultContent = document.getElementById('resultContent');
  resultContent.innerHTML = '';

  if (result.files) {
    result.files.forEach(file => {
      const fileDiv = document.createElement('div');
      fileDiv.className = 'file-item';
      fileDiv.innerHTML = `
        <div class="file-name">${file.name}</div>
        <pre><code>${escapeHtml(file.content)}</code></pre>
      `;
      resultContent.appendChild(fileDiv);
    });
  }

  if (result.message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<p>${result.message}</p>`;
    resultContent.insertBefore(messageDiv, resultContent.firstChild);
  }

  // Setup download
  document.getElementById('downloadBtn').onclick = () => downloadFiles(result);

  document.getElementById('result').classList.remove('hidden');
}

function downloadFiles(result) {
  if (!result.files || result.files.length === 0) return;

  if (result.files.length === 1) {
    // Single file download
    const file = result.files[0];
    downloadFile(file.name, file.content);
  } else {
    // Multiple files - create a zip (simplified: download each file)
    result.files.forEach(file => {
      downloadFile(file.name, file.content);
    });
  }
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Loading Overlay
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }
}

// URL Site Generator
async function handleUrlSubmit(e) {
  e.preventDefault();

  const url = document.getElementById('siteUrl').value;

  showLoading(true);

  try {
    const response = await fetch('/api/generate-from-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const result = await response.json();

    if (result.success) {
      showUrlResult(result);
    } else {
      alert(`Failed to generate site: ${result.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate site. Please check the URL and try again.');
  } finally {
    showLoading(false);
  }
}

function showUrlResult(result) {
  const content = `
    <div class="result-info">
      <h3>Site: ${result.siteName}</h3>
      <p><strong>Source URL:</strong> <a href="${result.url}" target="_blank">${result.url}</a></p>
      <p><strong>Title:</strong> ${result.analysis.title || 'N/A'}</p>
    </div>

    <div class="result-stats">
      <div class="stat-item">
        <span class="stat-number">${result.analysis.componentsCount}</span>
        <span class="stat-label">Components Identified</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">${result.generated.components}</span>
        <span class="stat-label">Components Generated</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">${result.generated.templates}</span>
        <span class="stat-label">Templates Generated</span>
      </div>
    </div>

    ${result.analysis.components.length > 0 ? `
    <div class="result-section">
      <h4>Generated Components:</h4>
      <ul class="component-list">
        ${result.analysis.components.map(comp => 
          `<li><strong>${comp.type}</strong> - ${comp.description}</li>`
        ).join('')}
      </ul>
    </div>
    ` : ''}

    ${result.analysis.patterns.length > 0 ? `
    <div class="result-section">
      <h4>Detected Patterns:</h4>
      <ul class="pattern-list">
        ${result.analysis.patterns.map(pattern => `<li>${pattern}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="result-section">
      <h4>Color Scheme:</h4>
      <div class="color-palette">
        <div class="color-item">
          <div class="color-swatch" style="background-color: ${result.analysis.colors.primary}"></div>
          <span>Primary: ${result.analysis.colors.primary}</span>
        </div>
        <div class="color-item">
          <div class="color-swatch" style="background-color: ${result.analysis.colors.secondary}"></div>
          <span>Secondary: ${result.analysis.colors.secondary}</span>
        </div>
        <div class="color-item">
          <div class="color-swatch" style="background-color: ${result.analysis.colors.background}"></div>
          <span>Background: ${result.analysis.colors.background}</span>
        </div>
        <div class="color-item">
          <div class="color-swatch" style="background-color: ${result.analysis.colors.text}"></div>
          <span>Text: ${result.analysis.colors.text}</span>
        </div>
      </div>
    </div>

    <div class="result-section">
      <h4>Next Steps:</h4>
      <ol class="next-steps">
        <li>Download the generated files using the button below</li>
        <li>Extract the ZIP file to your project directory</li>
        <li>Review the README.md for detailed documentation</li>
        <li>Customize components and templates as needed</li>
        <li>Add actual content from the source site</li>
      </ol>
    </div>

    <div class="info-message">
      <strong>💡 Note:</strong> The generated code is a starting point based on automated analysis. 
      Review and customize it to match your exact requirements.
    </div>
  `;

  currentResult = result;
  showResult({ success: true, message: result.message, files: result.files });
  document.getElementById('resultContent').innerHTML = content;
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on load
showGeneratorSelect();
