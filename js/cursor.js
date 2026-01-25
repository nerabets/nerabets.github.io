// Только для ПК (отключаем на тач-устройствах)
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('game-cursor');
    const dateLinks = [...document.querySelectorAll('.archive li a')].filter(el => el.offsetParent !== null);

    if (dateLinks.length === 0 || !cursor) return;

    let currentIndex = 0;

    function positionCursor(el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      cursor.style.left = (rect.left + scrollLeft - 28) + 'px';
      cursor.style.top = (rect.top + scrollTop + rect.height / 2 - 12) + 'px';
      cursor.classList.add('visible');
    }

    // Сразу позиционируем на первой дате
    positionCursor(dateLinks[0]);

    // Ховер → обновляем позицию
    dateLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        positionCursor(link);
      });
    });

    // Стрелки вверх/вниз
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % dateLinks.length;
        positionCursor(dateLinks[currentIndex]);
        dateLinks[currentIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + dateLinks.length) % dateLinks.length;
        positionCursor(dateLinks[currentIndex]);
        dateLinks[currentIndex].focus();
      }
    });

    // Скрываем курсор при уходе мыши за пределы окна
    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  });
}