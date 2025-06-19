from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth.models import User
from django.shortcuts import redirect, get_object_or_404
from django.core.paginator import Paginator

import json

from .models import User, Post, Follow

def index(request):
    return render(request, "network/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def create_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get("content", "")
        if content:
            post = Post(author=request.user, content=content)
            post.save()
            return JsonResponse(post.serialize(user=request.user), status=201) 
        return JsonResponse({"error": "Empty content"}, status=400)
    return JsonResponse({"error": "POST request required"}, status=400)

def all_posts(request):
    posts = Post.objects.all().order_by("-timestamp")
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html", {
        "page_obj": page_obj  # нужно для пагинации на index.html
    })

def posts_api(request):
    posts = Post.objects.all().order_by("-timestamp")
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return JsonResponse(
        [post.serialize(user=request.user) for post in page_obj],
        safe=False
    )
   
@login_required
def following_view(request):
    following_users = [
        f.following for f in request.user.following_set.all()
        if f.following != request.user
    ]

    # Только посты других пользователей
    posts = Post.objects.filter(author__in=following_users).exclude(author=request.user).order_by('-timestamp')

    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Здесь передаём user=None, чтобы "editable" всегда был False
    return render(request, "network/following.html", {
        "page_obj": page_obj,
        "serialized_posts": [post.serialize(user=None) for post in page_obj],
        "no_posts": not posts.exists()
    })
    
def profile(request, username):
    user_profile = get_object_or_404(User, username=username)
    posts = Post.objects.filter(author=user_profile).order_by("-timestamp")
    
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    is_following = False
    if request.user.is_authenticated and user_profile != request.user:
        is_following = Follow.objects.filter(
            follower=request.user, following=user_profile
        ).exists()

    return render(request, "network/profile.html", {
        "profile_user": user_profile,
        "posts": posts,
        "is_following": is_following,
        "followers_count": user_profile.followers_set.count(),
        "following_count": user_profile.following_set.count(),
        "page_obj": page_obj,
        "serialized_posts": [post.serialize(user=request.user if request.user == user_profile else None) for post in posts]

    })

@login_required
def toggle_follow(request, username):
    target = get_object_or_404(User, username=username)
    follow_relation = Follow.objects.filter(follower=request.user, following=target)

    if follow_relation.exists():
        follow_relation.delete()
    else:
        Follow.objects.create(follower=request.user, following=target)

    return redirect("profile", username=username)

@login_required
def edit_post(request, post_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if post.author != request.user:
        return JsonResponse({"error": "Unauthorized."}, status=403)

    data = json.loads(request.body)
    new_content = data.get("content", "").strip()
    if not new_content:
        return JsonResponse({"error": "Content cannot be empty."}, status=400)

    post.content = new_content
    post.save()
    return JsonResponse({"message": "Post updated successfully."}, status=200)

@require_POST
@login_required
def toggle_like(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if request.user == post.author:
        return JsonResponse({"error": "You cannot like your own post."}, status=400)

    if request.user in post.likes.all():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked = True

    return JsonResponse({
        "likes": post.likes.count(),
        "liked": liked
    })

@require_http_methods(["DELETE"])
@login_required
def delete_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id, author=request.user)
        post.delete()
        return JsonResponse({"message": "Post deleted successfully."}, status=200)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found or not authorized."}, status=404)


