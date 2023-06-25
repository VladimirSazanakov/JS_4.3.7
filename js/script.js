const input = document.querySelector('.search__input');
const search__autocomplete = document.querySelector('.search__autocomplete');
const result__block = document.querySelector('.result-block');
const delayTime = 1000;

let url = new URL('https://api.github.com/search/repositories');
let itemsList = [];
let selectedList = new Set;

function clueDelay(fn, debounceTimer){
  let timer;
  return (repo) =>{
    clearTimeout(timer);
    timer = setTimeout(()=>fn.call(this, repo), debounceTimer);
  }
}

function deleteItems(){
  let items  = document.querySelectorAll('.search__autocomplete-item');
  items.forEach(el => el.remove());
}

function builItems(items) {
  const search__autocomplete = document.querySelector('.search__autocomplete');
  deleteItems();
  let fragment = document.createDocumentFragment();
  items.forEach(element => {
    let {name, id} = element;
    let itemsElement = document.createElement('li');
    itemsElement.innerHTML = name;
    itemsElement.classList.add('search__autocomplete-item');
    itemsElement.setAttribute('data-id', id);
    fragment.append(itemsElement);
  });
  search__autocomplete.append(fragment);
}

function requestGit(){
  let searchString = input.value.trim();
  if (searchString !=''){
    url.searchParams.set('q', searchString);
    let response = fetch(url);
    let items2 = response
      .then(el => el.json())
      .then(el => el.items);
    items2.then(el => {itemsList=el.slice(0, 5);
      builItems(itemsList);
    });
  } else {
    deleteItems();
  }
}

function addToSelected(item){
  if (!selectedList.has(item)){
    selectedList.add(item);
    let {id, name, owner:{login}, stargazers_count} = item;

    let result = document.createElement('div');
    result.classList.add('result');
    result.dataset.id = id;

    let result__text = document.createElement('div');
    result__text.classList.add('result__text');
    result.append(result__text);
 
    let result__name = document.createElement('p');
    result__name.innerHTML = `Name: ${name}`;
    result__name.classList.add('result__name');
    result__text.append(result__name);

    let result__owner = document.createElement('p');
    result__owner.innerHTML = `Owner: ${login}`;
    result__owner.classList.add('result__owner');
    result__text.append(result__owner);

    let result__stars = document.createElement('p');
    result__stars.innerHTML = `Stars: ${stargazers_count}`;
    result__stars.classList.add('result__stars');
    result__text.append(result__stars);

    let result__remove = document.createElement('button');
    result__remove.innerHTML = '';
    result__remove.classList.add('result__remove');
    result.append(result__remove);
    result__block.append(result);
  }
  //deleteItems();
}

function removeSelected(element){
  selectedList.forEach(el => {
    if (el.id == element.dataset.id){
      selectedList.delete(el);
    }
  })
  element.remove();
}

input.addEventListener('input', clueDelay(requestGit, delayTime));

search__autocomplete.addEventListener('click', (event) => {
  event.target.classList.add('search__autocomplete-item--selected');
  addToSelected(itemsList.find(el => el.id == event.target.dataset.id));
  input.value = '';
})

result__block.addEventListener('click', (event)=>{
  if (event.target.classList.contains('result__remove')){
    removeSelected(event.target.parentElement);
  }
})




