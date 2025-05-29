from django import forms
from .models import Listing, Comment

class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = ['title', 'description', 'starting_bid', 'image_file', 'image_url', 'category']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'starting_bid': forms.NumberInput(attrs={'class': 'form-control'}),
            'image_url': forms.URLInput(attrs={'class': 'form-control'}),
            'category': forms.Select(attrs={'class': 'form-control'}),
        }

    # Дополнительно укажем виджет для загрузки файла
    image_file = forms.ImageField(required=False, widget=forms.ClearableFileInput(attrs={
        'class': 'form-control-file'
    }))

class BidForm(forms.Form):
    amount = forms.DecimalField(
            max_digits=10,
            decimal_places=2,
            widget=forms.NumberInput(attrs={
                'class': 'form-control py-2 px-3',
                'placeholder': 'Amount',
                'style': 'height: 38px; height: 100%;'
            })
        )

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3, 
                'placeholder': 'Leave a comment...'
            }),
        }
