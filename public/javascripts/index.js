const form = document.querySelector('#searchForm');
const button = document.querySelector('button');
const results = document.querySelector('#results');
const apiKey = 'Rc9a3sCcsQxjhmwZF9qQOGQb59VNndzBohrKYLat';

const totalCalDisplay = document.querySelector('#totalCalories');
const totalProDisplay = document.querySelector('#totalProtein');
const selectedFood = document.querySelector('#selectedFood');
const foodName = document.querySelector('#foodName');
const otherCalories = document.querySelector('#otherCalories');
const otherProtein = document.querySelector('#otherProtein');
const otherButton = document.querySelector('#otherButton');
const clearButton = document.querySelector('#clear');
let totalCalories = 0;
let totalProtein = 0;

class Food {
    constructor(name, calories, protein) {
        this.name = name;
        this.calories = calories;
        this.protein = protein;
    }
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const searchTerm = form.elements.query.value;
    const config = { params: { query: searchTerm, pageSize: 10 } }
    const res = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`, config);

    let foodRes = res.data.foods;

    for (let food of foodRes) {
        let calories = food.foodNutrients.find(el => el.nutrientName === 'Energy').value;
        let protein = food.foodNutrients.find(el => el.nutrientName === 'Protein').value;

        let addedFood = new Food(food.description, calories, protein);
        addToList(addedFood);
    }

    form.elements.query.value = '';
})

const addToList = (obj) => {
    const addButton = document.createElement('button');
    addButton.classList.add('btn', 'btn-success', 'btn-sm');
    addButton.innerText = 'Add';
    const foodItem = document.createElement('li');
    foodItem.classList.add('my-1');
    foodItem.innerHTML = `<b>${obj.name}</b> Calories: ${obj.calories}kcal, Protein: ${obj.protein}g `;
    foodItem.append(addButton);
    results.append(foodItem);
    updateTotals(addButton, obj);
}

const addOther = () => {
    let foodVal = foodName.value;
    let otherCalVal = parseInt(otherCalories.value);
    let otherProVal = parseInt(otherProtein.value);
    if (!Number.isNaN(otherCalVal) && !Number.isNaN(otherProVal)) {
        totalCalories += otherCalVal
        totalProtein += otherProVal
        totalCalDisplay.innerText = totalCalories;
        totalProDisplay.innerText = totalProtein;
    }
    addSelectedFood(foodVal, otherCalVal, otherProVal);
}

otherButton.addEventListener('click', function () {
    addOther();
    foodName.value = '';
    otherCalories.value = '';
    otherProtein.value = '';
})

const addSelectedFood = (name, calories, protein) => {
    const foodItem = document.createElement('li');
    foodItem.classList.add('my-1');
    foodItem.innerHTML = `<b>${name}</b> Calories: ${calories}kcal, Protein: ${protein}g `;
    const removeButton = document.createElement('button');
    removeButton.classList.add('btn', 'btn-danger', 'btn-sm');
    removeButton.innerText = 'Remove';
    foodItem.append(removeButton);
    selectedFood.append(foodItem);
    removeItem(removeButton, foodItem, calories, protein);
}

const updateTotals = (button, obj) => {
    button.addEventListener('click', function () {
        totalCalories += Math.round(obj.calories);
        totalProtein += Math.round(obj.protein);
        totalCalDisplay.innerText = totalCalories;
        totalProDisplay.innerText = totalProtein;
        addSelectedFood(obj.name, obj.calories, obj.protein);
        results.innerHTML = '';
    })
}

clearButton.addEventListener('click', function () {
    results.innerHTML = '';
});

const removeItem = (button, element, calories, protein) => {
    button.addEventListener('click', function () {
        element.remove();
        totalCalories -= Math.round(calories);
        totalProtein -= Math.round(protein);
        totalCalDisplay.innerText = totalCalories;
        totalProDisplay.innerText = totalProtein;
    })
}