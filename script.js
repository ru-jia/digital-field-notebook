// ID below are from notes.html
const buttons = document.querySelectorAll(".toggle-note");

buttons.forEach(function(button) {

    const details = button.parentElement.nextElementSibling;

    button.addEventListener("click", function() {

        if (details.hidden) {
            details.hidden = false;
            button.textContent = "Show less";
        }
        else {
            details.hidden = true;
            button.textContent = "Read more";
        }

    });

});

