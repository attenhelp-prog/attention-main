// ========== ДАННЫЕ ==========
let posts = [];
let currentUser = "user";
let subscribedAuthors = [];

// ========== ЗАГРУЗКА/СОХРАНЕНИЕ ==========
function loadData() {
  const saved = localStorage.getItem('posts');
  if (saved) posts = JSON.parse(saved);
  
  const savedSub = localStorage.getItem(`subscribed_${currentUser}`);
  if (savedSub) subscribedAuthors = JSON.parse(savedSub);
}

function saveData() {
  localStorage.setItem('posts', JSON.stringify(posts));
  localStorage.setItem(`subscribed_${currentUser}`, JSON.stringify(subscribedAuthors));
}

// ========== ОБРАТНЫЙ ОТСЧЁТ ==========
function getRemainingTime(post) {
  const now = Date.now();
  const expiresAt = post.createdAt + (post.lifeTime * 60 * 60 * 1000);
  const remaining = expiresAt - now;
  
  if (remaining <= 0) return "0ч";
  
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}д ${hours % 24}ч`;
  return `${hours}ч`;
}
// ========== УДАЛЕНИЕ ПРОСРОЧЕННЫХ ПОСТОВ ==========
function removeExpiredPosts() {
  const now = Date.now();
  let changed = false;
  
  posts = posts.filter(post => {
    const expiresAt = post.createdAt + (post.lifeTime * 60 * 60 * 1000);
    if (expiresAt <= now) {
      changed = true;
      return false;
    }
    return true;
  });
  
  if (changed) {
    saveData();
  }
}

// ========== ОТРИСОВКА ЛЕНТЫ ==========
function renderFeed() {
  removeExpiredPosts();
  const feed = document.getElementById('feed');
  const template = document.getElementById('form');
  const isMyAuthors = document.getElementById('suBTN')?.classList.contains('active');
  
  if (!feed || !template) return;
  feed.innerHTML = '';
  
  let visible = [...posts];
  
  // Фильтр "Мои авторы"
  if (isMyAuthors) {
    visible = visible.filter(p => subscribedAuthors.includes(p.author));
  }
  
  // Фильтр скрытых авторов (по дизлайку)
  const now = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`hidden_${currentUser}_`)) {
      const hideUntil = parseInt(localStorage.getItem(key));
      if (hideUntil > now) {
        const author = key.replace(`hidden_${currentUser}_`, '');
        visible = visible.filter(p => p.author !== author);
      } else {
        localStorage.removeItem(key);
      }
    }
  }
  
  visible.forEach((post) => {
    const card = template.querySelector('.post-card');
    if (!card) return;
    
    const postCard = card.cloneNode(true);
    
    // Заполнение данными
    const nikEl = postCard.querySelector('.nik');
    if (nikEl) nikEl.textContent = post.author;
    
     const timeEl = postCard.querySelector('.time');
    if (timeEl) timeEl.innerHTML = getRemainingTime(post);
    
    const likeCountEl = postCard.querySelector('.like-count');
    if (likeCountEl) likeCountEl.textContent = post.likes || 0;
    
    const dizCountEl = postCard.querySelector('.diz-count');
    if (dizCountEl) dizCountEl.textContent = post.dislikes || 0;
    
    const viewsCountEl = postCard.querySelector('.views-count');
if (viewsCountEl) viewsCountEl.textContent = post.views || 0;
    
    const descEl = postCard.querySelector('.post-description');
    if (descEl) descEl.textContent = post.text;
    
    const postImageDiv = postCard.querySelector('.post-image');
    if (post.image && postImageDiv) {
      postImageDiv.innerHTML = `<img src="${post.image}" style="max-width:100%; border-radius:12px;">`;
    }
    
        // ===== ЛАЙК + ПОДПИСКА =====
    const likeBtn = postCard.querySelector('.like');
    if (likeBtn) {
      const newLikeBtn = likeBtn.cloneNode(true);
      likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
      
      newLikeBtn.onclick = () => {
        console.log('1. Лайк нажат');
        console.log('2. post.hasLiked =', post.hasLiked);
        
        if (post.hasLiked) return;
        
        post.hasLiked = true;
        post.likes = (post.likes || 0) + 1;
        
        console.log('3. Теперь лайков:', post.likes);
        
        if (post.hasDisliked) {
          post.hasDisliked = false;
          post.dislikes = (post.dislikes || 0) - 1;
        }

        // Подписка на автора
        console.log('4. Автор поста:', post.author);
        console.log('5. currentUser:', currentUser);
        console.log('6. Текущие подписки:', subscribedAuthors);
        
        if (post.author !== currentUser) {
          if (!subscribedAuthors.includes(post.author)) {
            subscribedAuthors.push(post.author);
            saveData();
            console.log('✅ Подписались на:', post.author);
          } else {
            console.log('❌ Уже подписан на:', post.author);
          }
        } else {
          console.log('❌ Нельзя подписаться на себя');
        }
        
        console.log('7. Итоговые подписки:', subscribedAuthors);
        
        saveData();
        renderFeed();
      };
    }
    
    // ===== ДИЗЛАЙК + СКРЫТЬ АВТОРА =====
    const dizBtn = postCard.querySelector('.diz');
    if (dizBtn) {
      const newDizBtn = dizBtn.cloneNode(true);
      dizBtn.parentNode.replaceChild(newDizBtn, dizBtn);
      
      newDizBtn.onclick = () => {
        if (post.hasDisliked) return;
        post.hasDisliked = true;
        post.dislikes = (post.dislikes || 0) + 1;
        
        if (post.hasLiked) {
          post.hasLiked = false;
          post.likes = (post.likes || 0) - 1;
        }
        
        const hideUntil = Date.now() + (45 * 24 * 60 * 60 * 1000);
        localStorage.setItem(`hidden_${currentUser}_${post.author}`, hideUntil);
        console.log('✅ Скрыли автора:', post.author);
        
        saveData();
        renderFeed();
      };
    }
    
    feed.appendChild(postCard);
    
    // Просмотры
    if (!post.viewCounted) {
      post.viewCounted = true;
      post.views = (post.views || 0) + 1;
      saveData();
    }
  });
}

// ========== СОЗДАНИЕ ПОСТА ==========
function createPost() {
  const descInput = document.querySelector('.des');
  const text = descInput?.value;
  
  if (!text?.trim()) {
    alert('Напиши описание');
    return;
  }
  
  const newPost = {
    id: Date.now(),
    author: currentUser,
    text: text,
    likes: 0,
    dislikes: 0,
    hasLiked: false,
    hasDisliked: false,
    views: 0,
    viewCounted: false,
        lifeTime: parseInt(document.querySelector('input[name="post-time"]:checked')?.value) || 24,
    image: null,
    createdAt: Date.now()
  };
  
  const file = document.getElementById('file-upload');
  if (file?.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      newPost.image = e.target.result;
      posts.unshift(newPost);
      saveData();
      renderFeed();
    };
    reader.readAsDataURL(file.files[0]);
  } else {
    posts.unshift(newPost);
    saveData();
    renderFeed();
  }
  
  if (descInput) descInput.value = '';
  if (file) file.value = '';
  
  const overlay = document.querySelector('.overlay');
  if (overlay) overlay.classList.remove('active');
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderFeed();
  
  // Открыть модалку
  const addBtn = document.getElementById('addPostBtn');
  if (addBtn) {
    addBtn.onclick = () => {
      const overlay = document.querySelector('.overlay');
      if (overlay) overlay.classList.add('active');
    };
  }
  
  // Закрыть модалку
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    };
  }
  
  // Опубликовать
  const publishBtn = document.querySelector('.go');
  if (publishBtn) {
    publishBtn.onclick = createPost;
  }
  
  // Превью картинки
  const fileInput = document.getElementById('file-upload');
  if (fileInput) {
    fileInput.onchange = (e) => {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => {
          const label = document.getElementById('preview-label');
          if (label) {
            label.style.backgroundImage = `url('${ev.target.result}')`;
            label.style.backgroundSize = 'cover';
          }
          const uploadText = document.getElementById('upload-text');
          if (uploadText) uploadText.style.display = 'none';
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  }
  
  // Мои авторы / Рекомендации
  const suBtn = document.getElementById('suBTN');
  const reBtn = document.getElementById('reBTN');
  
  if (suBtn) {
    suBtn.onclick = () => {
      suBtn.classList.add('active');
      if (reBtn) reBtn.classList.remove('active');
      renderFeed();
    };
  }
  
  if (reBtn) {
    reBtn.onclick = () => {
      reBtn.classList.add('active');
      if (suBtn) suBtn.classList.remove('active');
      renderFeed();
    };
  }
});
window.createPost = createPost;






