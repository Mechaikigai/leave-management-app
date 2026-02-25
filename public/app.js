let token = localStorage.getItem("token");

async function login() {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();
  localStorage.setItem("token", data.token);
  location.href = "dashboard.html";
}

async function requestLeave() {
  await fetch("/api/leaves", {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "authorization": token
    },
    body: JSON.stringify({
      startDate: start.value,
      endDate: end.value,
      reason: reason.value
    })
  });

  loadLeaves();
}

async function loadLeaves() {
  const res = await fetch("/api/leaves", {
    headers: { authorization: token }
  });

  const leaves = await res.json();

  list.innerHTML = leaves
    .map(l => `<li>${l.startDate} - ${l.endDate} (${l.status})</li>`)
    .join("");
}

if (document.getElementById("list")) {
  loadLeaves();
}