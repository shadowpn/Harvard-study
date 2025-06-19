# CS50W Project 4: Network

## Description

This project is a social networking site built with Django. It allows users to register, log in, and interact with each other via posts, likes, following, and personal profiles.

The application mimics core features of platforms like Twitter or Facebook.

## Features Implemented

1. **All Posts View** – Shows all posts from all users, paginated and styled with Neumorphism UI.
2. **New Post** – Authenticated users can create a new post from the main page.
3. **Profile Page** – Users have individual profiles showing their posts and a follower/following count.
4. **Following Feed** – Authenticated users see posts only from people they follow.
5. **Like/Unlike** – Users can like or unlike posts.
6. **Edit Post** – Users can edit their own posts without page reload (AJAX).
7. **Follow/Unfollow** – Users can follow and unfollow others from their profile pages.

## Technologies Used

- Python / Django
- HTML / CSS (with Neumorphism design)
- JavaScript (with Fetch API and JSON)
- SQLite (for local development)

## How to Run

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
