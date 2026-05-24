// // ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
// document.addEventListener('DOMContentLoaded', function() {
//   // Демо-посты (можно убрать или оставить)
//   posts = [];
//   renderFeed();
//   initEvents();
// });



import { loadSubscribed } from './data.js';

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
  posts = [];
  loadSubscribed();
  renderFeed();
  initEvents();
});



