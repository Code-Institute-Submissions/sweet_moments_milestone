from decimal import Decimal
from django.conf import settings
from django.shortcuts import get_object_or_404
from products.models import Products


def cart_items(request):

    items = []
    total = 0
    product_count = 0
    cart = request.session.get('cart', {})

    for item_id, quantity in cart.items():
        product = get_object_or_404(Products, pk=item_id)
        total += quantity * product.price
        product_count += quantity
        items.append({
            'item_id': item_id,
            'quantity': quantity,
            'product': product,
        })

    if total < settings.FREE_DELIVERY:
        delivery = total * Decimal(settings.STANDARD_DELIVERY/100)
    else:
        delivery = 0
      
    grand_total = delivery + total

    context = {
        'items': items, 
        'total': total,
        'product_count': product_count,
        'delivery': delivery,   
        'free_delivery':settings.FREE_DELIVERY,
        'grand_total': grand_total,

    }

    return context
