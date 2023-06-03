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
        value: 'always', 
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
    label: 'Element Redaction',
  },
  {
    type: 'p',
    label: 'Use css selectors to select the content of the HTML you want to redact and select the option to redact or not redact the content of the selected HTML element. <br> To paste the content, just press ctrl+shift+Z and it will paste it in the prompt or press the button bellow the download chat button.',
  },
  {
    htmlId: 'customSelector',
    defaultValue: '*',
    type: 'customSelector',
    Hint: '',
    name: 'selectorSettingsRedaction',
    fields: [
      {
        name: 'selectorSettingsRedaction',
        label: 'Custom CSS Selector',
        placeholder: 'separate them by coma to select more than one element',
        value: '',
        htmlclass: '',
        type: 'text',
      },
    ],
    // radioOptions: [
    //   {
    //     label: 'Redact content',
    //     value: '*',
    //   },
    //   {
    //     label: "Don't redact content",
    //     value: ' ',
    //   },
    // ],
  },
  {
    htmlId: 'svgRedaction',
    defaultValue: '',
    type: 'svgRedaction',
    name: 'svgRedaction',
    type: 'radio',
    label: 'SVG Redaction',
    options: [
        {
          label: 'Always redact',
          value: '*',
        },
        {
          label: 'Never redact',
          value: ' ',
        },
      ],
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
