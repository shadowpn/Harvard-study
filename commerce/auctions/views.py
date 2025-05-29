from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.db.models import Count

from .forms import ListingForm, BidForm, CommentForm
from .models import User, Listing, Bid, Category

def index(request):
    listings = Listing.objects.filter(active=True)
    return render(request, "auctions/index.html", {
        "listings": listings
    })

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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")

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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
       
@login_required
def create_listing(request):
    if request.method == "POST":
        form = ListingForm(request.POST, request.FILES)
        if form.is_valid():
            listing = form.save(commit=False)
            listing.owner = request.user
            
            # если файл загружен, очищаем image_url
            if listing.image_file:
                listing.image_url = ""
            listing.save()
            return redirect("index")
    else:
        form = ListingForm()

    return render(request, "auctions/create.html", {
        "form": form
    })
    
@login_required
def listing(request, id):
    listing = get_object_or_404(Listing, pk=id)
    bid_form = BidForm()
    bids = listing.bids.order_by('-amount')
    error = None
    comment_form = CommentForm()
    comments = listing.comments.order_by('-timestamp')
    
    if request.method == "POST":
        if "add" in request.POST:
            request.user.watchlist.add(listing)

        elif "remove" in request.POST:
            request.user.watchlist.remove(listing)

        elif "place_bid" in request.POST:
            bid_form = BidForm(request.POST)
            if bid_form.is_valid():
                amount = bid_form.cleaned_data["amount"]
                current = listing.current_price
                if amount >= current:
                    Bid.objects.create(user=request.user, listing=listing, amount=amount)
                else:
                    error = f"Your bid must be at least ${current:.2f}"
        
        elif "close_auction" in request.POST and request.user == listing.owner:
            listing.active = False
            winner = listing.highest_bidder
            if winner:
                listing.winner = User.objects.get(username=winner)
            listing.save()
        
        elif "post_comment" in request.POST:
            comment_form = CommentForm(request.POST)
            if comment_form.is_valid():
                comment = comment_form.save(commit=False)
                comment.user = request.user
                comment.listing = listing
                comment.save()
                
        return redirect("listing", id=id)

    is_watching = listing in request.user.watchlist.all()

    return render(request, "auctions/listing_detail.html", {
        "listing": listing,
        "is_watching": is_watching,
        "bid_form": bid_form,
        "comment_form": comment_form,
        "error": error,
        "bids": bids,
        "comments": comments,
    })
    
@login_required
def watchlist_view(request):
    listings = request.user.watchlist.all()
    return render(request, "auctions/watchlist.html", {
        "listings": listings
    })

def categories(request):
    all_categories = Category.objects.all()
    return render(request, "auctions/categories.html", {
        "categories": all_categories
    })

def category_listings(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    listings = category.listings.filter(active=True)

    return render(request, "auctions/category_listings.html", {
        "category": category,
        "listings": listings
    })

@login_required
def closed_listings(request):
    listings = Listing.objects.filter(owner=request.user, active=False)
    return render(request, "auctions/closed_listings.html", {
        "listings": listings
    })