
from django.urls import path

from . import views

urlpatterns = [
    path("", views.all_posts, name="index"), 
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("posts", views.posts_api, name="posts_api"),
    path("posts/create", views.create_post, name="create_post"),
    path("following", views.following_view, name="following"),
    path("follow/<str:username>", views.toggle_follow, name="toggle_follow"),
    path("posts/<int:post_id>/edit", views.edit_post, name="edit_post"),
    path("posts/<int:post_id>/like", views.toggle_like, name="toggle_like"),
    path("posts/<int:post_id>/delete", views.delete_post, name="delete_post"),
   
]
