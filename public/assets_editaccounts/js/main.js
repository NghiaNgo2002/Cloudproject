n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
value = d + "-" + m + "-" + y;
document.getElementById("date").setAttribute('value', value);





