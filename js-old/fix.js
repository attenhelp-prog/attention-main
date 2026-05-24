// ========== ДОБАВЛЯЕМ ПОДПИСКИ И "МОИ АВТОРЫ" ==========

// Расширяем данные
let subscribedAuthors = [];

function saveSubscribed() {
  localStorage.setItem(`subscribed_${currentUser}`, JSON.stringify(subscribedAuthors));
}

function loadSubscribed() {
  const saved = localStorage.getItem(`subscribed_${currentUser}`);
  if (saved) {
    subscribedAuthors = JSON.parse(saved);
  }
}

function subscribeToAuthor(authorName) {
  if (authorName === currentUser) return;
  if (!subscribedAuthors.includes(authorName)) {
    subscribedAuthors.push(authorName);
    saveSubscribed();
  }
}

// Сохраняем оригинальный renderFeed
const originalRenderFeed = renderFeed;

// Переопределяем renderFeed
window.renderFeed = function() {
  const isMyAuthors = document.getElementById('suBTN')?.classList.contains('active');
  
  // Фильтруем посты перед отрисовкой
  if (isMyAuthors && window.posts) {
    const originalPosts = window.posts;
    window.posts = originalPosts.filter(post => subscribedAuthors.includes(post.author));
    originalRenderFeed();
    window.posts = originalPosts;
  } else {
    originalRenderFeed();
  }
};

// Добавляем подписку в лайк
document.addEventListener('DOMContentLoaded', () => {
  loadSubscribed();
  
  // Перехватываем создание кнопок лайка
  const originalRenderFeedBackup = renderFeed;
  window.renderFeed = function() {
    originalRenderFeedBackup();
    
    // Добавляем подписку на все кнопки лайка
    document.querySelectorAll('.like').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Находим пост
        const postCard = newBtn.closest('.post-card');
        const authorName = postCard?.querySelector('.nik')?.textContent;
        if (authorName && authorName !== currentUser) {
          subscribeToAuthor(authorName);
        }
      });
    });
  };
  
  renderFeed();
});

// Добавляем обработчики кнопок
document.addEventListener('DOMContentLoaded', () => {
  const reBtn = document.getElementById('reBTN');
  const suBtn = document.getElementById('suBTN');
  
  if (reBtn) {
    reBtn.onclick = () => {
      reBtn.classList.add('active');
      suBtn.classList.remove('active');
      renderFeed();
    };
  }
  
  if (suBtn) {
    suBtn.onclick = () => {
      suBtn.classList.add('active');
      reBtn.classList.remove('active');
      renderFeed();
    };
  }
});