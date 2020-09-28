var stripePublicKey = $('#id_stripe_public_key').text().slice(1, -1);
var clientSecret = $('#id_client_secret').text().slice(1,-1);
var stripe = Stripe(stripePublicKey);
var elements= stripe.elements();

var style = {
    base: {
        color: '#000',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#dc3545',
        iconColor: '#dc3545'
    }
};
var card = elements.create('card',{style: style});
card.mount('#card-element');

card.addEventListener('change', function (event) {
    var errorDiv = document.getElementById('card-errors');
    if (event.error) {
        var html = `
            <span class="icon" role="alert">
                <i class="fas fa-times"></i>
            </span>
            <span>${event.error.message}</span>
        `;
        $(errorDiv).html(html);
    } else {
        errorDiv.textContent = '';
    }
});

var checkoutForm = document.getElementById('checkout_form');

checkoutForm.addEventListener('submit', function(ev) {
    ev.preventDefault(); //prevents default action (POST)
    card.update({'disabled': true}); //prevent multiple submission
    $('#submit-button').attr('disabled', true);
    $('#checkout_form').fadeToggle(100);
    $('#loading_payment').fadeToggle(100);

    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
    var postData = {
        'csrfmiddlewaretoken': csrfToken,
        'client_secret': clientSecret,
    }

    var url = '/checkout/cache_checkout_data/';
    $.post(url, postData).done(function *(){

 

    stripe.confirmCardPayment(clientSecret, { //sends info to stripe
       payment_method:{
           card:card,
           billing_details :{
               first_name: $.trim(form.first_name.value),
               phone: $.trim(form.telephone.value),
               email: $.trim(form.email.value),
               address :{
                   address_1: $.trim(form.address_1.value),
                   address_2: $.trim(form.address_2.value),
                   county: $.trim(form.county.value),
                   country: $.trim(form.country.value),
               }
           }
       },
        shipping: {
               first_name: $.trim(form.first_name.value),
               phone: $.trim(form.telephone.value),
               email: $.trim(form.email.value),
               address :{
                   address_1: $.trim(form.address_1.value),
                   address_2: $.trim(form.address_2.value),
                   county: $.trim(form.county.value),
                   country: $.trim(form.country.value),
                }
        },
    }).then(function(result){
       if (result.error) {
           var errorDiv = document.getElementById('card-errors');
           var html = `
           <span class="icon" role="alert">
               <i class="fas fas-times"></i>
           </span>
           <span>${result.error.message}</span>

           `;
           $(errorDiv).html(html);
           $('#checkout_form').fadeToggle(100);
           $('#loading_payment').fadeToggle(100);
        card.update({'disabled': false}); //renable to allow user to fix it
        $('#submit-button').attr('disabled', false);
    } else {
        if (result.paymentIntent.status === 'succeeded'){
            checkoutForm.submit();
        }
    }
   });
}).fail(function(){
    location.reload();
})
});

