
// Утилиты для работы с куками
function getCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || null;
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

// Определяем текущую тему (без сохранения)
function getCurrentTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  const hour = new Date().getHours();
  return (hour >= 20 || hour < 7) ? 'dark' : 'light';
}

// Применить тему на странице
function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'auto') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', theme);
  }
}

// Инициализация темы и попапа
(function () {
  const savedTheme = getCookie('themeColor');
  const noAsk = getCookie('noAskTheme');

  // Если тема уже выбрана — применяем и выходим
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }

  // Если пользователь отключил уведомления — применяем тему по умолчанию и выходим
  if (noAsk === '1') {
    const fallback = getCurrentTheme();
    applyTheme(fallback);
    return;
  }

  // Определяем текущую тему
  const current = getCurrentTheme();
  applyTheme(current);

  // Формируем сообщение и варианты (без текущей темы)
  let message, options = [];
  if (current === 'dark') {
    message = 'О, рад тебя видеть снова! Хочешь попробовать <strong>светлую</strong> или <strong>адаптивную</strong> тему?';
    options = [
      { label: 'Светлая', value: 'light' },
      { label: 'Адаптивная', value: 'auto' }
    ];
  } else {
    message = 'О, рад тебя видеть снова! Хочешь попробовать <strong>тёмную</strong> или <strong>адаптивную</strong> тему?';
    options = [
      { label: 'Тёмная', value: 'dark' },
      { label: 'Адаптивная', value: 'auto' }
    ];
  }

  // Обновляем текст
  document.getElementById('welcome-text').innerHTML = message;

  // Генерируем кнопки выбора
  const container = document.getElementById('theme-options');
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt.label;
    btn.style.cssText = `
      padding: 0.45rem 1.1rem;
      background: #e6e6ff;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.95rem;
      min-width: 80px;
      transition: background 0.2s;
    `;
    btn.onmouseenter = () => btn.style.background = '#d0d0ff';
    btn.onmouseleave = () => btn.style.background = '#e6e6ff';
    btn.onclick = () => {
      setCookie('themeColor', opt.value);
      applyTheme(opt.value);
      document.getElementById('theme-welcome').style.display = 'none';
    };
    container.appendChild(btn);
  });

  // Показываем попап с небольшой задержкой (чтобы не мешать загрузке)
  setTimeout(() => {
    document.getElementById('theme-welcome').style.display = 'block';
  }, 600);
})();

// Обработчики кнопок "Нет" и "Не задавайте больше"
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('theme-no')?.addEventListener('click', () => {
    document.getElementById('theme-welcome').style.display = 'none';
  });

  document.getElementById('theme-never')?.addEventListener('click', () => {
    setCookie('noAskTheme', '1');
    document.getElementById('theme-welcome').style.display = 'none';
  });
});