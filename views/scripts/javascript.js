console.log("JS statrting");

var h2 = document.createElement("h2");

// Here we create the text node
var newText = document.createTextNode("H2 created via createElement");

// Now we add the text node as the child of h2 node
h2.appendChild(newText);

// finally we add the h2 element as the child of div
document.body.appendChild(h2);
