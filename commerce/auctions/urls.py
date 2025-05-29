from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("listing/<int:id>", views.listing, name="listing"),
    path("create", views.create_listing, name="create"),
    path("watchlist", views.watchlist_view, name="watchlist"),
    path("categories/", views.categories, name="categories"),
    path("category/<int:category_id>/", views.category_listings, name="category_listings"),
    path("my-closed/", views.closed_listings, name="closed_listings"),
]
