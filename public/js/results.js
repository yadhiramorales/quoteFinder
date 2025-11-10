document.addEventListener("DOMContentLoaded", () => {
  const modal = new bootstrap.Modal(document.getElementById("authorModal"));
  let authorLinks = document.querySelectorAll(".authors");
  for (let i of authorLinks) {
    i.addEventListener("click", getAuthorInfo);
  }

  function $(selector) {
      return document.querySelector(selector);
  }

  async function getAuthorInfo(e) {
      e.preventDefault();

      let authorId = this.getAttribute("authorId");
      let url = "/api/authors/" + authorId;

      let response = await fetch(url);
      let data = await response.json();

      let author = data[0];

      const fmt = (d) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); // search this up becsue i couldnt figure out the formatting

      console.log(data);

      $("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
      $("#authorImage").src = data[0].portrait;
      $("#authorBio").textContent = author.biography;
      $("#authorDOB").textContent = author.dob ? "Date of Birth: " + fmt(author.dob) : "";
      $("#authorDOD").textContent = author.dod ? "Date of Death: " + fmt(author.dod) : ""; 
      $("#authorCountry").textContent = "Country: " + data[0].country;
      $("#authorSex").textContent = "Sex: " + data[0].sex;
      $("#authorProfession").textContent = "Profession: " + data[0].profession;
      modal.show();

  }
});