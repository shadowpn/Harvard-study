document.addEventListener('DOMContentLoaded', function () {
  // Загружаем все посты только на главной странице ("/")
  if (document.querySelector('#posts-container') && window.location.pathname === "/") {
    load_all_posts();

    const postButton = document.querySelector('#submit-post');
    if (postButton) {
      postButton.addEventListener('click', () => {
        const textarea = document.querySelector('#new-post-content');
        const content = textarea.value.trim();
        if (!content) return;

        fetch('/posts/create', {
          method: 'POST',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
          })
          .then(result => {
            console.log('Post created:', result);
            textarea.value = '';
            const container = document.querySelector('#posts-container');
            render_post(result, container, true, true);
          })
          .catch(error => {
            console.error('Post creation failed:', error);
            alert("Something went wrong while creating the post.");
          });
      });
    }
  }
});
 
function load_all_posts() {
  const page = new URLSearchParams(window.location.search).get("page") || 1;
  fetch(`/posts?page=${page}`)
    .then(response => response.json())
    .then(posts => {
      const container = document.querySelector('#posts-container');
      container.innerHTML = '';
      posts.forEach(post => render_post(post, container));
    })
    .catch(error => {
      console.error('Failed to load posts:', error);
    });
}
  
function render_post(post, container, prepend = false, showActions = false) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';

  const likedClass = post.liked ? 'text-danger' : 'text-muted';
  const likeBtn = `
    <span class="like-btn ${likedClass}" data-id="${post.id}" style="cursor:pointer;">
      ❤️ ${post.likes}
    </span>
  `;

  postDiv.innerHTML = `
    <div class="post-card">
      <div class="d-flex justify-content-between align-items-center">
        <strong><a href="/profile/${post.author}">${post.author}</a></strong>
        <span class="timestamp">${post.timestamp}</span>
      </div>
      <p class="mt-2 mb-1">${escapeHTML(post.content)}</p>
      <div class="likes">${likeBtn}</div>
      <div class="d-flex justify-content-end mt-2 post-actions"></div>
    </div>
  `;

  // Показываем кнопки только если post.editable === true И showActions === true
  if (post.editable) {
    const editBtn = document.createElement('button');
    editBtn.innerText = "Edit";
    editBtn.className = "neumorphic-button-action neumorphic-button-edit";

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "neumorphic-button-action neumorphic-button-delete";

    editBtn.onclick = () => show_edit_form(postDiv, post);

    deleteBtn.onclick = () => {
      if (confirm("Are you sure you want to delete this post?")) {
        fetch(`/posts/${post.id}/delete`, {
          method: 'DELETE',
          headers: { 'X-CSRFToken': getCookie('csrftoken') }
        })
          .then(res => res.json())
          .then(data => {
            if (data.message) postDiv.remove();
            else alert(data.error);
          });
      }
    };

    const actions = postDiv.querySelector('.post-actions');
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
  }

  // Like обработчик
  postDiv.querySelector('.like-btn').onclick = () => toggle_like(post.id, postDiv);

  // Вставка
  if (prepend) {
    container.prepend(postDiv);
  } else {
    container.appendChild(postDiv);
  }
}
   
  // Получение CSRF-токена
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  
  // Безопасный вывод текста (чтобы не ломать верстку)
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function show_edit_form(postDiv, post) {
    const contentP = postDiv.querySelector('p');
    const originalText = post.content;
  
    // Create textarea
    const textarea = document.createElement('textarea');
    textarea.className = 'form-control mb-2';
    textarea.value = originalText;
  
    // Create save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-sm btn-success';
    saveBtn.innerText = 'Save';
  
    // Replace content with textarea and button
    contentP.replaceWith(textarea);
    const editBtn = postDiv.querySelector('button');
    if (editBtn) editBtn.replaceWith(saveBtn);
  
    // Save action
    saveBtn.onclick = () => {
      const newContent = textarea.value.trim();
      if (!newContent) return alert("Content cannot be empty.");
  
      fetch(`/posts/${post.id}/edit`, {
        method: 'PUT',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent })
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update');
        return response.json();
      })
      .then(data => {
        // Replace textarea with updated content
        const newP = document.createElement('p');
        newP.className = 'mt-2 mb-1';
        newP.innerText = newContent;
        textarea.replaceWith(newP);
  
        // Replace Save with Edit again
        const newEditBtn = document.createElement('button');
        newEditBtn.innerText = "Edit";
        newEditBtn.className = "btn btn-sm btn-outline-secondary ml-2";
        newEditBtn.onclick = () => show_edit_form(postDiv, post);
        saveBtn.replaceWith(newEditBtn);
      })
      .catch(error => {
        console.error('Update failed:', error);
        alert("Failed to update post.");
      });
    };
  }

  function toggle_like(postId, postDiv) {
    fetch(`/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      }
    })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(({ status, body }) => {
        if (status !== 200) {
          alert(body.error || "Like action failed.");
          return;
        }
  
        const likeSpan = postDiv.querySelector('.like-btn');
        likeSpan.innerHTML = `❤️ ${body.likes}`;
        likeSpan.className = `like-btn ${body.liked ? 'text-danger' : 'text-muted'}`;
      })
      .catch(err => {
        console.error('Like error:', err);
        alert("Error while toggling like.");
      });
  }
  