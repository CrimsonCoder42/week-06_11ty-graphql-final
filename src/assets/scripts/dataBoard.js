window.addEventListener("DOMContentLoaded", function(e) {
    console.log("DOM loaded...");

    // Select all the anchor elements in the #dataBoard element and assign them
    // an onClick event listener
    let navListElements = document.querySelectorAll('div#dataBoard nav a');
    
    // For each anchor element, assign an onclick event listener that 
    // causes its corresponding data list to appear.
    navListElements.forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();

            // Cycle through all the dataList objects and set their css 
            // 'display' property to 'none.' Set the anchor's
            // corresponding dataList object 'display' to 'block.'
            // This is horribly inefficient and there must be a better way...
            document.querySelectorAll('div.dataList').forEach(div => {
                div.style.display = 'none';
            });
            
            document.querySelector(`#${a.text}`).style.display = 'block';
        });
    });
});