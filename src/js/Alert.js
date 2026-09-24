export default class Alert {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.path = "/json/alerts.json";
  }

  async init() {
    const response = await fetch(this.path);
    if (!response.ok) throw new Error("Unable to load alerts");

    const alerts = await response.json();
    if (!alerts.length) return;

    const section = document.createElement("section");
    section.className = "alert-list";

    alerts.forEach((alert) => {
      const message = document.createElement("p");
      message.textContent = alert.message;
      message.style.backgroundColor = alert.background;
      message.style.color = alert.color;
      section.appendChild(message);
    });

    this.parentElement.prepend(section);
  }
}
