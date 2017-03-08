const domain = "https://innoflow.herokuapp.com/"
	, api = domain + "api/"
	, searchRoute = api + "users/search"
	, usersWebRoute = domain + "#/users/";

document.addEventListener('DOMContentLoaded', addListeners, false);

function addListeners() {
	let input = document.getElementById("search");
	let debouncedSearch = debounce(search, 300, false);
	input.addEventListener("input", debouncedSearch);
}

function search(e) {
	let val = e.target.value;
	if (val && val.length > 1) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				let results = JSON.parse(this.responseText);
				populateResults(results);
			}
		};
		xhr.open("GET", searchRoute + "?string=" + val, true);
		xhr.send();
	}
}

function populateResults(results) {
	let list = document.getElementById("results");
	let i = 0;
	for (; i < results.length; i++) {
		if (i >= list.rows.length) {
			list.insertRow(i);			
		}
		setResult(list.rows[i], results[i].id, results[i].username);
	}
	while (list.rows.length > i) {
		list.deleteRow(i);
	}
}

function setResult(row, id, username) {
	row.setAttribute("id", id);
	if (row.cells.length > 0) {
		row.deleteCell(0);
	}	
	let td = row.insertCell(0);
	td.innerText = username;
	row.addEventListener("click", selectUser);	
}

function selectUser() {
	if (this.id) {
		let url = usersWebRoute + this.id + "/innovations";
    chrome.tabs.create({ url });
	}	
}

function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		let context = this;
		let args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
};