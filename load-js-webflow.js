
  document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.keyCode == 123) {
                e.stopPropagation();
                e.preventDefault();
            }
});

let scriptElement = document.createElement("script");
scriptElement.type = "text/javascript";
scriptElement.src = "JSfile.js"; //URL CDN OF THE CODE
document.body.appendChild(scriptElement);