// function for menu movement after loading page
window.onload = function(){
    /*Toggle Menu if click button*/
    document.getElementById("menuButton").onclick = function (){
        toggleMenu();
    };
    /*Toggle menu if click mask*/
    document.getElementById("mask").onclick = function(){
        toggleMenu();
    };

    function toggleMenu(){
        document.getElementById("pushMenu").classList.toggle("openMenu");
        document.getElementById("overallWrap").classList.toggle("pushWrap");
        document.getElementById("mask").classList.toggle("showMask");
        document.body.classList.toggle("maskBody");
    }
};