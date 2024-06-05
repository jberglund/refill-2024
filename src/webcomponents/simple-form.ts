class SimpleForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }

  attachEventListeners() {
    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", this.handleFormSubmit.bind(this));
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target.assignedElements()[0];
    // Perform your form submission logic here
    // Replace the content inside the slot with the response
    this.shadowRoot.querySelector("slot").innerHTML = "Response content";
  }
}

customElements.define("simple-form", SimpleForm);
