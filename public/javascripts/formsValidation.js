// Javascript function for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needsValidation')


    Array.from(forms)   // create an array the forms submitted
        .forEach(function (form) {  // go through each form
            form.addEventListener('submit', function (event) { // add an event listener on each form
                if (!form.checkValidity()) {  // if the form is not valid
                    event.preventDefault()    // prevent the default following operation
                    event.stopPropagation()   // stop propagation
                }

                form.classList.add('was-validated')
            }, false)
        })
})()