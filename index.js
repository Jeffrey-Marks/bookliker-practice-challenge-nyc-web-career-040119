const grab = (sel) => document.querySelector(sel);

const addToDOMAtLoc = (eltType, eltText, loc) => {
  const newElt = document.createElement(eltType);
  newElt.innerText = eltText;

  loc.appendChild(newElt);

  return newElt;
};

const bookListUl = grab("#list");
const bookPanel = grab("#show-panel");
let currentUser;

fetch("http://localhost:3000/users")
  .then(r => r.json())
  .then(usersArr => {
    currentUser = usersArr[0];
});

fetch("http://localhost:3000/books")
  .then(resp => resp.json())
  .then(booksArr => { // BEGIN SECOND .then //////////

    for (const bookObj of booksArr) {
      const bookLi = addToDOMAtLoc("li", bookObj.title, bookListUl);

      bookLi.addEventListener("click", () => {
        bookPanel.innerHTML = `
          <h1>${bookObj.title}</h1>
          <img src=${bookObj.img_url}>
          <p>${bookObj.description}</p>
          <p>Users who like this Book:</p>
          <ul id="users-ul"></ul>
          <button id="like-btn"></button>
        `;

        const usersUl = grab("#users-ul");

        for (const userObj of bookObj.users) {
          addToDOMAtLoc("li", userObj.username, usersUl)
        }

        const likeBtn = grab("#like-btn");
        likeBtn.innerText = (usersUl.innerHTML.includes(currentUser.username) ? "Unread Book" : "Read Book")


        likeBtn.addEventListener("click", (e) => {
          if (usersUl.innerHTML.includes("pouros")) {
            for (const li of usersUl.children) {
              if (li.innerText === "pouros") li.remove();
            }

            likeBtn.innerText = "Read Book"

            bookObj.users = bookObj.users.filter((book) => {
              return book.id != 1
            });

            fetch(`http://localhost:3000/books/${bookObj.id}`, {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({users: bookObj.users})
            });
          } else {
            usersUl.innerHTML += `<li>pouros</li>`
            likeBtn.innerText = "Unread Book"

            bookObj.users.push(currentUser)

            fetch(`http://localhost:3000/books/${bookObj.id}`, {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({users: bookObj.users})
            });
          }
        });
      });

    }

}); // END SECOND .then ////////////////////
