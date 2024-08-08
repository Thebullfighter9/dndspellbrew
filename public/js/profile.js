document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    fetch('/api/users/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            document.getElementById('username').innerText = data.user.username;
            document.getElementById('bio').innerText = data.user.bio || "User bio goes here...";
            document.getElementById('profile-picture').src = data.user.profilePicture || "default-profile.png";

            const postsContainer = document.getElementById('posts-container');
            data.posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <img src="${post.imageUrl}" alt="${post.title}">
                `;
                postsContainer.appendChild(postElement);
            });

            const commentsReviewsContainer = document.getElementById('comments-reviews-container');
            data.recentActivities.forEach(activity => {
                const activityElement = document.createElement('div');
                activityElement.className = 'activity';
                activityElement.innerHTML = `
                    <p>${activity.text}</p>
                    <small>${new Date(activity.date).toLocaleString()}</small>
                `;
                commentsReviewsContainer.appendChild(activityElement);
            });
        } else {
            window.location.href = '/login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = '/login.html';
    });

    const editProfileButton = document.getElementById('edit-profile-button');
    const editProfileForm = document.getElementById('edit-profile-form');
    const newProfilePictureInput = document.getElementById('new-profile-picture');
    const newBioInput = document.getElementById('new-bio');

    editProfileButton.addEventListener('click', () => {
        editProfileForm.style.display = 'block';
        newBioInput.value = document.getElementById('bio').innerText;
    });

    editProfileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData();
        if (newProfilePictureInput.files[0]) {
            formData.append('profilePicture', newProfilePictureInput.files[0]);
        }
        formData.append('bio', newBioInput.value);

        fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                document.getElementById('bio').innerText = data.user.bio;
                document.getElementById('profile-picture').src = data.user.profilePicture;
                editProfileForm.style.display = 'none';
            } else {
                alert('Failed to update profile. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});
