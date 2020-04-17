window.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('new-pic').addEventListener('click', loadCatPicture);
    document.getElementById("vote-space").addEventListener("click", countVote);
    document.querySelector(".comment-form").addEventListener("submit", postNewComment);
})

function loadCatPicture () {
    document.querySelector(".error").innerHTML = "";
    document.querySelector('.loader').innerHTML = '😸 Loading...^.^';
  fetch("/kitten/image")
  .then(cat => {
    if(!cat.ok) throw cat;
    return cat.json();
  })
  .then(data => {
    document.querySelector('.loader').innerHTML = '';
    const img = document.querySelector('.cat-pic');
    img.src=data.src;
    document.querySelector('.score').innerHTML = data.score;
    renderComments(data.comments);
  }).catch(err => {
    err.json().then(errJson => {    
        document.querySelector(".error").innerHTML = errJson.message;
        document.querySelector('.loader').innerHTML = '';
        document.querySelector('.cat-pic').src = './bad-cat.jpeg';
    });
  });


}

function countVote(event){
    let count = document.querySelector('.score').innerHTML;
    const upVote = document.getElementById("upvote");
    const downVote = document.getElementById("downvote");
    const scoreSpace = document.querySelector(".score");

    if(event.target === upVote){
        fetch("/kitten/upvote", {method: "PATCH"})
        .then( res =>{
            if(!res.ok) throw res.statusText;
            return res.json();
        })
        .then(data =>{
            scoreSpace.innerHTML = data.score;
        })
        .catch(err=> console.error(err));
    } else if(event.target === downVote){
        fetch("/kitten/downvote", {method: "PATCH"})
            .then(res => {
                if (!res.ok) throw res.statusText;
                return res.json();
            })
            .then(data => {
                scoreSpace.innerHTML = data.score;
            })
            .catch(err => console.error(err));
    }
}

function postNewComment(e) {
  e.preventDefault();
  const commentText = document.getElementById('user-comment').value;
  fetch("/kitten/comments", {
            method: "POST", 
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                comment: commentText
            })
        })
        .then(function (res) {
            if (!res.ok) throw Error(res.statusText); 
            return res.json(); 
        })
        .then(comments => {renderComments(comments)})
        .catch(err => console.error(err));
}

function renderComments(comments) {
  if(!Array.isArray(comments)) comments = comments.comments;
  if(comments.length === 0) return;
  const commentSpace = document.querySelector('.comments');
  commentSpace.innerHTML = '';
  comments.forEach((comment, i) => {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment');
    commentContainer.id = `comment-${i < 10 ? '0' + i : i}`
    const commentText = document.createElement('p');
    commentText.innerHTML = comment;
    commentContainer.appendChild(commentText);
    commentSpace.appendChild(commentContainer);
  });
}
