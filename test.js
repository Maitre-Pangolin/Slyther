let mydiv = document.getElementById("myid");

console.log(mydiv.textContent);

mydiv.textContent = sessionStorage.getItem("test");

let gameproperties = JSON.parse(sessionStorage.getItem("test2"));

console.log(Object.keys(gameproperties));
console.log(gameproperties.players.forEach((e) => console.log(e.color)));

const player_colors = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
];
