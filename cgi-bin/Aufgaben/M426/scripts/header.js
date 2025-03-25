class HeaderContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="bg-dark text-white p-3">
                <nav class="container">
                    <ul class="nav">
                        <li class="nav-item">
                            <a class="nav-link text-white" href="index.html">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="task.html">Task</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="learningjournal.html">Learning Journal</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="lexikon.html">Dictionary</a>
                        </li>
                    </ul>
                </nav>
            </header>
        `;
    }
}

customElements.define('header-content', HeaderContent);
