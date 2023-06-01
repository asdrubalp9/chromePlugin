const formFields = [
 {
    name: 'sound',
    label: 'Sound configuration',
    placeholder: 'Sound configuration',
    htmlId: 'sound',
    htmlclass: '',
    value: '',
    defaultValue: 'always',
    type: 'radio',
    Hint: '',
    options: [
      {
        label: 'Always sound when chatGPT finishes',
        value: 'always',  // Aquí es donde estaba el error, esto debería ser 'always', no 'notFocused'
      },
      {
        label: 'Only sound when chatGPT is not focused',
        value: 'notFocused',
      },
      {
        label: 'Never make a sound',
        value: 'never',
      },
    ],
  },
  {
    type: 'separator',
    label: 'Pasting Configuration',
  },
  {
    name: 'oneLiner',
    label: 'Eliminate breakspaces, double spaces and new lines',
    htmlId: 'oneLiner',
    htmlclass: '',
    value: '',
    defaultValue: 'always',
    type: 'radio',
    Hint: '',
    options: [
      {
        label: 'Always',
        value: 'always',
      },
      {
        label: 'Never',
        value: 'never',
      },
    ],
  },
  {
    type: 'separator',
    label: 'Redactable elements',
  },
  {
    type: 'p',
    label: '<span class="fw-bold">HowTo:</span> if the field has a space, the content of the elements won\'t be redacted, if it\'s <span class="fw-semibold">*</span> then all the content of the elements will be redacted; you can separate values with comas to select elements that <span class="fw-bold">WON\'T</span> be redacted, example: <span class="fw-semibold">.div1,#div2,.element, myFunction, myClass</span>',
  },
  // {
  //   type: 'button',
  //   class:"btn btn-warning",
  //   label: 'Reset to default',
  //   action: (e) => {
  //     console.log('click');
  //   },
  // }
];

const typeOfElements = [
  {
    name: 'divTag',
    label: 'div tag',
    type: 'text',
  },
  {
    name: 'svgRedaction',
    type: 'radio',
    label: 'SVG Redaction',
  },
  {
    name: 'aTag',
    label: 'a tag',
    type: 'text',
  },
  {
    name: 'pTag',
    label: 'p tag',
    type: 'text',
  },
  {
    name: 'h1Tag',
    label: 'h1 tag',
    type: 'text',
  },
  {
    name: 'h2Tag',
    label: 'h2 tag',
    type: 'text',
  },
  {
    name: 'h3Tag',
    label: 'h3 tag',
    type: 'text',
  },
  {
    name: 'h4Tag',
    label: 'h4 tag',
    type: 'text',
  },
  {
    name: 'h5Tag',
    label: 'h5 tag',
    type: 'text',
  },
  {
    name: 'h6Tag',
    label: 'h6 tag',
    type: 'text',
  },
  {
    name: 'ulTag',
    label: 'ul tag',
    type: 'text',
  },
  {
    name: 'liTag',
    label: 'li tag',
    type: 'text',
  },
];
let k = 0;
for (const element of typeOfElements) {
  const temp = {
    name: `${element.name.toLowerCase().replace(' ', '')}Redaction`,
    label: `${element.label}`,
    htmlId: `${element.name.toLowerCase().replace(' ', '')}Redaction${++k}`,
    htmlclass: '',
    value: '',
    type: element.type,
  };
  if (element.type === 'radio') {
    temp.defaultValue = 'always';
  }
  if (element.type.includes('text')) {
    temp.defaultValue = ' ';
    temp.value = ' ';
    temp.placeholder = `Redact content of all ${element.name.toLowerCase()} except for the separated by comas, example: "div1,div2,div3"`;
    temp.label = `${element.label.toLowerCase()} redaction`;
  }
  if (element?.options) {
    temp.options = element.options;
  }
  formFields.push(temp);
}

export { formFields, typeOfElements };
