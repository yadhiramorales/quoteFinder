document.querySelector("#searchByKeywordForm").addEventListener("submit", validateKeyword);

function validateKeyword(){

    let keyword = document.querySelector("input[name=keyword]").value;
    const errorMsg = document.querySelector("#keywordError");
    if (keyword.length < 3) {
        event.preventDefault(); //prevents the submission of the form.
        errorMsg.textContent = "Keyword must be at least 3 characters long.";
    }
    else {
        errorMsg.textContent = "";
    }


}