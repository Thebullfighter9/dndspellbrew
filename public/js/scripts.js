document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/latest-posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts-container');
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <img src="${post.imageUrl}" alt="${post.title}">
                `;
                postsContainer.appendChild(postElement);
            });
        });

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const profileLink = document.querySelector('a[href="/profile"]');
    if (token) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '/profile.html';
        });
    } else {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '/login.html';
        });
    }
});
