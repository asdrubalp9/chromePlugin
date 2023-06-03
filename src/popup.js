import FormGenerator from './formGenerator.js';
import { formFields, typeOfElements } from './config.js';
import bootstrap from 'bootstrap';


const formGenerator = new FormGenerator('.optionScreen', formFields);
formGenerator.generateForm().then(() => {
  console.log('Form has been generated.');
}).catch((error) => {
  console.error('Failed to generate form:', error);
});

const loadingScreen = document.querySelector('.loadingScreen');
const optionScreen = document.querySelector('.optionScreen');
loadingScreen.classList.add('d-none');
optionScreen.classList.remove('d-none');
// on click  #optionsLink open options.html
const optionsLink = document.querySelector('#optionsLink');
optionsLink.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});