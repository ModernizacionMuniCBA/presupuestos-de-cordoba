var selectedYear = "2018";

$(document).ready(function() {
	finishedDrawing();
	$('.yearSelector').on('click', function(){
		selectedYear = $(this).data('year');
		Cookies.set('year', selectedYear);
		$('.selectedYear').html(selectedYear);
	});
});


if(Cookies.get('year') == undefined){
	Cookies.set('year', '2018');
}else{
	selectedYear = Cookies.get('year');
	$('.selectedYear').html(selectedYear);
}

var uuid_analytics = "UA-79840006-1";

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', uuid_analytics, 'auto');

window.touchAnalytics = function(page, title){
    ga('send', 'pageview', {'page': page,'title': title});
};
