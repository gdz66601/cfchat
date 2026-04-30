// Liquid Glass Interactive Effects
export function initLiquidGlass() {
  // 扩展目标元素范围
  const selectors = [
    '.ui-surface',
    '.chat-bubble',
    '.liquid-glass-panel',
    '.page-card',
    '.app-window',
    '.admin-shell',
    '.settings-shell',
    '.button',
    '.ui-button'
  ];

  const liquidElements = document.querySelectorAll(selectors.join(', '));

  liquidElements.forEach(element => {
    // 避免重复绑定
    if (element.hasAttribute('data-lg-bound')) return;
    element.setAttribute('data-lg-bound', 'true');

    element.addEventListener('mousemove', (e) => {
      // 使用 requestAnimationFrame 优化性能
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
        element.style.setProperty('--m-x', `${x}px`); // 兼容旧变量
        element.style.setProperty('--m-y', `${y}px`); // 兼容旧变量
      });
    });

    element.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        element.style.setProperty('--mouse-x', '50%');
        element.style.setProperty('--mouse-y', '50%');
        element.style.setProperty('--m-x', '50%');
        element.style.setProperty('--m-y', '50%');
      });
    });
  });
}

// 在 DOM 加载完成后初始化
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initLiquidGlass();

    // 初始化背景动画
    if (!localStorage.getItem('customBackground')) {
      document.body.style.background = 'linear-gradient(-45deg, #fefdf8, #dceced, #f0f4f8, #e6eef5)';
      document.body.style.backgroundSize = '400% 400%';
      document.body.style.animation = 'gradientBG 15s ease infinite';

      // 添加关键帧
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
    }
  });

  // 支持动态添加的元素
  const observer = new MutationObserver((mutations) => {
    let shouldInit = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldInit = true;
        break;
      }
    }

    if (shouldInit) {
      // 使用 setTimeout 避免频繁调用
      clearTimeout(window.lgInitTimeout);
      window.lgInitTimeout = setTimeout(initLiquidGlass, 50);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
