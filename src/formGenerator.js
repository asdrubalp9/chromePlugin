class FormGenerator {
    constructor(className, fieldArray) {
        this.formSelector = className;
        this.fieldArray = fieldArray;
    }

    toast(message = 'Saved successfully'){
        const toast = document.querySelector('.toast');
        const toastBody = document.querySelector('.toast-body');
        toastBody.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 1500);
    }
    
    async getStoredValue(key, defaultValue) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get([key], function(result) {
                    console.log('Value currently is ' + result,defaultValue, key, result[key], result[key] == undefined ?   defaultValue: result[key])
                    resolve(result[key] == undefined ?   defaultValue: result[key]);
                });
            }catch(e) {
                resolve(defaultValue);
            }
            
        });
    }

    async generateForm() {
        let formElement = document.createElement('form');
        formElement.className = `form ${this.formSelector}`;

        for(let field of this.fieldArray) {
            console.log('field', field)
            
            let fieldElement;
            switch (field.type) {
                case 'text':
                case 'password':
                case 'email':
                    fieldElement = await this.createTextField(field);
                    break;
                case 'textarea':
                    fieldElement = await this.createTextArea(field);
                    break;
                case 'checkbox':
                case 'switch':
                case 'radio':
                    fieldElement = await this.createCheckOrRadio(field);
                    break;
                default:
                    console.error(`Unsupported field type: ${field.type}`);
                    continue;
            }

            let storedValue = await this.getStoredValue(field.name, field.defaultValue);
            if(fieldElement.querySelector('input, textarea') !== null) {
                fieldElement.querySelector('input, textarea').value = storedValue;
            }
            
            formElement.appendChild(fieldElement);
        }

        const element = await this.waitForElement(this.formSelector);
        element.appendChild(formElement);
    }


    async createTextField(field) {
        let divElement = document.createElement('div');
        divElement.className = 'mb-3';
        
        let labelElement = document.createElement('label');
        labelElement.for = field.htmlId;
        labelElement.className = 'form-label';
        labelElement.innerText = field.label;
        
        let inputElement = document.createElement('input');
        inputElement.type = field.type;
        inputElement.className = `form-control ${field?.htmlClass || ''}`;
        inputElement.id = field?.htmlId || '';
        inputElement.name = field?.name || '';
        inputElement.placeholder = field?.placeholder || '';

        let storedValue = await this.getStoredValue(field.name, field.defaultValue);
        inputElement.value = storedValue;
        
        inputElement.addEventListener('change', e => {
            // Update in Chrome Storage
            chrome.storage.sync.set({ [field.name]: e.target.value }, () => {

                console.log('Value is set to ' + e.target.value);
                this.toast('Value is set to ' + e.target.value)
            });
            
            if (field.onChange) {
                field.onChange(e);
            }
        });

        divElement.appendChild(labelElement);
        divElement.appendChild(inputElement);

        return divElement;
    }

    async createTextArea(field) {
        let divElement = document.createElement('div');
        divElement.className = 'mb-3';
        
        let labelElement = document.createElement('label');
        labelElement.for = field.htmlId;
        labelElement.className = 'form-label';
        labelElement.innerText = field.label;
        
        let textAreaElement = document.createElement('textarea');
        textAreaElement.className = `form-control ${field.htmlClass}`;
        textAreaElement.id = field.htmlId;
        textAreaElement.name = field.name;
        textAreaElement.rows = 3; // you may want to control this with a field property

        let storedValue = await this.getStoredValue(field.name, field.defaultValue);
        textAreaElement.value = storedValue;

        textAreaElement.addEventListener('change', e => {
            // Update in Chrome Storage
            chrome.storage.sync.set({ [field.name]: e.target.value }, () => {

                console.log('Value is set to ' + e.target.value);
                this.toast('Value is set to ' + e.target.value)
            });
            
            if (field.onChange) {
                field.onChange(e);
            }
        });

        divElement.appendChild(labelElement);
        divElement.appendChild(textAreaElement);

        return divElement;
    }


    async createCheckOrRadio(field) {
        let div = document.createElement('div');
        div.className = 'mb-3';

        let label = document.createElement('label');
        label.className = 'form-label';
        label.innerText = field.label;

        div.appendChild(label);

        let storedValue = await this.getStoredValue(field.name, field.defaultValue);

        if (field.options && field.options.length > 0) {
            field.options.forEach((option, index) => {
                let optionDiv = document.createElement('div');
                optionDiv.className = 'form-check';

                let input = document.createElement('input');
                input.className = 'form-check-input';
                input.type = field.type;
                input.name = field.name;
                input.value = option.value;
                input.id = `${field.htmlId}${index + 1}`;
                input.checked = storedValue === option.value;
                
                input.addEventListener('change', e => {
                    // Update in Chrome Storage
                    chrome.storage.sync.set({ [field.name]: e.target.value }, () => {

                        console.log('Value is set to ' + e.target.value);
                        this.toast('Value is set to ' + e.target.value)
                    });
                    
                    if (field.onChange) {
                        field.onChange(e);
                    }
                });

                let optionLabel = document.createElement('label');
                optionLabel.className = 'form-check-label';
                optionLabel.htmlFor = input.id;
                optionLabel.innerText = option.label;

                optionDiv.appendChild(input);
                optionDiv.appendChild(optionLabel);

                div.appendChild(optionDiv);
            });
        } else {
            let optionDiv = document.createElement('div');
            optionDiv.className = 'form-check';

            let input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = field.type;
            input.name = field.name;
            input.id = field.htmlId;
            input.checked = Boolean(storedValue);
            
            input.addEventListener('change', e => {
                // Update in Chrome Storage
                chrome.storage.sync.set({ [field.name]: e.target.checked }, function() {
                    console.log('Value is set to ' + e.target.checked);
                    this.toast('Value is set to ' + e.target.checked)
                });
                
                if (field.onChange) {
                    field.onChange(e);
                }
            });

            let optionLabel = document.createElement('label');
            optionLabel.className = 'form-check-label';
            optionLabel.htmlFor = input.id;
            optionLabel.innerText = field.label;

            optionDiv.appendChild(input);
            optionDiv.appendChild(optionLabel);

            div.appendChild(optionDiv);
        }

        return div;
    }

    async waitForElement(selector, time = 2000, interval = 100) {
        const endTime = Number(new Date()) + time;

        const check = (resolve, reject) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            } else if (Number(new Date()) < endTime) {
                setTimeout(check, interval, resolve, reject);
            } else {
                reject(new Error(`Timed out waiting for ${selector}`));
            }
        };

        return new Promise(check);
    }

}
export default FormGenerator;