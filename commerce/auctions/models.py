from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.db import models

from django.utils import timezone


class User(AbstractUser):
    watchlist = models.ManyToManyField('Listing', blank=True, related_name="watched_by")
    
class Category(models.Model):
    name = models.CharField(max_length=64)
    
    def __str__(self):
        return self.name

    
class Listing(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)
    image_file = models.ImageField(
        upload_to="listing_images/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "gif"])])
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="listings")
    active = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    created_at = models.DateTimeField(auto_now_add=True)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="won_auctions")

    @property
    def current_price(self):
        highest_bid = self.bids.order_by('-amount').first()
        return highest_bid.amount if highest_bid else self.starting_bid   
    
    @property
    def highest_bidder(self):
        highest_bid = self.bids.order_by('-amount').first()
        return highest_bid.user.username if highest_bid else None
       
    def __str__(self):
        return f"{self.title} (${self.current_price})"
    
   
class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    placed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} bid {self.amount} on {self.listing.title}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} on {self.listing.title}: {self.content[:20]}"
