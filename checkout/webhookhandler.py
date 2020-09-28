from django.http import HttpResponse 


class StripeWH_handler:
    def __init__(self, request):
        self.request = request
    
    def handle_event(self, event):
        return HttpResponse(
            content=f'Webhook received: {event["type"]}',
            status=200)
        