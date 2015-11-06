$(function () {
    $(".dropdown").click(function () {
        $(this).toggleClass("is-active");
    });

    $(".dropdown ul").click(function (e) {
        e.stopPropagation();
    });
});
