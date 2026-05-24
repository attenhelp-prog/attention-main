// // ========== ФУНКЦИЯ ОТРИСОВКИ ЛЕНТЫ ==========
// function renderFeed() {
//   const feedContainer = document.getElementById('feed');
//   const templateContainer = document.getElementById('form');
  
//   if (!feedContainer) {
//     console.error('Нет контейнера #feed');
//     return;
//   }
  
//   feedContainer.innerHTML = '';
  
//   posts.forEach((post, index) => {
//     const templateCard = templateContainer.querySelector('.post-card');
//     if (!templateCard) return;
    
//     const postCard = templateCard.cloneNode(true);
    
//     // Заполняем данными
//     const nik = postCard.querySelector('.nik');
//     if (nik) nik.textContent = post.author;
    
//     const timeElem = postCard.querySelector('.time');
//     if (timeElem) {
//       timeElem.innerHTML = `
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <circle cx="12" cy="12" r="10" />
//           <polyline points="12 6 12 12 16 14" />
//         </svg>
//         ${post.lifeTime || 24}ч
//       `;
//     }
    
//     const likeCount = postCard.querySelector('.like-count');
//     if (likeCount) likeCount.textContent = post.likes || 0;
    
//     const dizCount = postCard.querySelector('.diz-count');
//     if (dizCount) dizCount.textContent = post.dislikes || 0;
    
//     const viewsElem = postCard.querySelector('.views');
//     if (viewsElem) {
//       viewsElem.innerHTML = `
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//           <circle cx="12" cy="12" r="3" />
//         </svg>
//         ${post.views || 0}
//       `;
//     }
    
//     const description = postCard.querySelector('.post-description');
//     if (description) description.textContent = post.text;
    
//     // Картинка
//     const postImageDiv = postCard.querySelector('.post-image');
//     if (post.image && postImageDiv) {
//       postImageDiv.innerHTML = `<img src="${post.image}" alt="">`;
//     } else if (postImageDiv) {
//       postImageDiv.innerHTML = '';
//     }
    
//     // ===== ЛАЙК С ЗАПРЕТОМ ПОВТОРНОГО НАЖАТИЯ =====
//     const likeBtn = postCard.querySelector('.like');
//     if (likeBtn) {
//       const newLikeBtn = likeBtn.cloneNode(true);
//       likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
      
//       newLikeBtn.addEventListener('click', () => {
//         if (post.hasLiked) return;
        
//         post.hasLiked = true;
//         post.likes = (post.likes || 0) + 1;
        
//         if (post.hasDisliked) {
//           post.hasDisliked = false;
//           post.dislikes = (post.dislikes || 0) - 1;
//         }
        
//         renderFeed();
//       });
//     }
    
//     // ===== ДИЗЛАЙК С ЗАПРЕТОМ ПОВТОРНОГО НАЖАТИЯ =====
//     const dizBtn = postCard.querySelector('.diz');
//     if (dizBtn) {
//       const newDizBtn = dizBtn.cloneNode(true);
//       dizBtn.parentNode.replaceChild(newDizBtn, dizBtn);
      
//       newDizBtn.addEventListener('click', () => {
//         if (post.hasDisliked) return;
        
//         post.hasDisliked = true;
//         post.dislikes = (post.dislikes || 0) + 1;
        
//         if (post.hasLiked) {
//           post.hasLiked = false;
//           post.likes = (post.likes || 0) - 1;
//         }
        
//         renderFeed();
//       });
//     }
    
//     feedContainer.appendChild(postCard);
    
//     // Просмотры (один раз)
//     if (!post.viewCounted) {
//       post.viewCounted = true;
//       post.views = (post.views || 0) + 1;
//     }
//   });
// }














import { subscribeToAuthor, subscribedAuthors, currentUser } from './data.js';
// ========== ФУНКЦИЯ ОТРИСОВКИ ЛЕНТЫ ==========
function renderFeed() {
  const feedContainer = document.getElementById('feed');
  const templateContainer = document.getElementById('form');
  
  if (!feedContainer) {
    console.error('Нет контейнера #feed');
    return;
  }
  
  feedContainer.innerHTML = '';
  
  // Получаем список скрытых авторов (сроком на 45 дней)
  const hiddenAuthors = [];
  const now = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`hidden_author_${currentUser}_`)) {
      const hideUntil = parseInt(localStorage.getItem(key));
      if (hideUntil > now) {
        const author = key.replace(`hidden_author_${currentUser}_`, '');
        hiddenAuthors.push(author);
      } else {
        // Если срок истёк - удаляем
        localStorage.removeItem(key);
      }
    }
  }
  
  // Фильтруем посты: убираем посты скрытых авторов
  const visiblePosts = posts.filter(post => !hiddenAuthors.includes(post.author));
  
  visiblePosts.forEach((post, index) => {
    const templateCard = templateContainer.querySelector('.post-card');
    if (!templateCard) return;
    
    const postCard = templateCard.cloneNode(true);
    
    // Заполняем данными
    const nik = postCard.querySelector('.nik');
    if (nik) nik.textContent = post.author;
    
    const timeElem = postCard.querySelector('.time');
    if (timeElem) {
      timeElem.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        ${post.lifeTime || 24}ч
      `;
    }
    
    const likeCount = postCard.querySelector('.like-count');
    if (likeCount) likeCount.textContent = post.likes || 0;
    
    const dizCount = postCard.querySelector('.diz-count');
    if (dizCount) dizCount.textContent = post.dislikes || 0;
    
    const viewsElem = postCard.querySelector('.views');
    if (viewsElem) {
      viewsElem.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        ${post.views || 0}
      `;
    }
    
    const description = postCard.querySelector('.post-description');
    if (description) description.textContent = post.text;
    
    // Картинка
    const postImageDiv = postCard.querySelector('.post-image');
    if (post.image && postImageDiv) {
      postImageDiv.innerHTML = `<img src="${post.image}" alt="">`;
    } else if (postImageDiv) {
      postImageDiv.innerHTML = '';
    }
    
    // ===== ЛАЙК С ЗАПРЕТОМ ПОВТОРНОГО НАЖАТИЯ =====
    const likeBtn = postCard.querySelector('.like');
    if (likeBtn) {
      const newLikeBtn = likeBtn.cloneNode(true);
      likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
      
      newLikeBtn.addEventListener('click', () => {
        if (post.hasLiked) return;
        
        post.hasLiked = true;
        post.likes = (post.likes || 0) + 1;
        
        if (post.hasDisliked) {
          post.hasDisliked = false;
          post.dislikes = (post.dislikes || 0) - 1;
        }
        
        renderFeed();
      });
    }
    
    // ===== ДИЗЛАЙК + СКРЫТЬ ВСЕ ПОСТЫ АВТОРА НА 45 ДНЕЙ =====
    const dizBtn = postCard.querySelector('.diz');
    if (dizBtn) {
      const newDizBtn = dizBtn.cloneNode(true);
      dizBtn.parentNode.replaceChild(newDizBtn, dizBtn);
      
      newDizBtn.addEventListener('click', () => {
        if (post.hasDisliked) return;
        
        post.hasDisliked = true;
        post.dislikes = (post.dislikes || 0) + 1;
        
        if (post.hasLiked) {
          post.hasLiked = false;
          post.likes = (post.likes || 0) - 1;
        }
        
        // СКРЫТЬ ВСЕ ПОСТЫ ЭТОГО АВТОРА НА 45 ДНЕЙ
        const hideUntil = Date.now() + (45 * 24 * 60 * 60 * 1000);
        localStorage.setItem(`hidden_author_${currentUser}_${post.author}`, hideUntil);
        
        renderFeed();
      });
    }
    
    feedContainer.appendChild(postCard);
    
    // Просмотры (один раз)
    if (!post.viewCounted) {
      post.viewCounted = true;
      post.views = (post.views || 0) + 1;
    }
  });
}