// ========== МАССИВ И ПЕРЕМЕННЫЕ ==========
let posts = [];
let currentUser = "user";



let subscribedAuthors = [];

function saveSubscribed() {
  localStorage.setItem(`subscribed_${currentUser}`, JSON.stringify(subscribedAuthors));
}

function loadSubscribed() {
  const saved = localStorage.getItem(`subscribed_${currentUser}`);
  if (saved) {
    subscribedAuthors = JSON.parse(saved);
  } else {
    subscribedAuthors = [];
  }
}

function subscribeToAuthor(authorName) {
  if (authorName === currentUser) return;
  if (!subscribedAuthors.includes(authorName)) {
    subscribedAuthors.push(authorName);
    saveSubscribed();
  }
}