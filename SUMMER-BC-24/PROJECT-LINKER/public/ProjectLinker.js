const API_ROUTE = "https://yedu-project-linker.onrender.com/api/v1";
// const API_ROUTE = "http://127.0.0.1:3000/api/v1";

class ProjectLinker {
  constructor(projectId) {
    if (!projectId) throw new Error("Invalid Project id.");

    this.projectId = projectId;
    this.isLiked = JSON.parse(
      localStorage.getItem(`isLiked-${this.projectId}`)
    );
    this.myProjectData = {};
    this.projects = [];

    this.insertProjects();
  }

  async getProjects() {
    const { projects: projectsData } = await fetch(
      `${API_ROUTE}/projects`
    ).then((res) => res.json());

    const { myProjectData, projects } = projectsData.reduce(
      (acc, project) => {
        if (project?.id === this.projectId) acc.myProjectData = project;
        else acc.projects.push(project);
        return acc;
      },
      { myProjectData: {}, projects: [] }
    );

    this.myProjectData = myProjectData;
    this.projects = projects;

    return projects;
  }

  async insertProjects() {
    const projects = await this.getProjects();
    if (this.projects?.length < 1) return;
    const body = document.querySelector("body");
    body.insertAdjacentHTML("beforeend", this.projectContainerHtml());
    const likeBtn = document.querySelector('[data-value="like-btn"]');
    likeBtn.addEventListener("click", (e) => this.like());
    this.insertProjectsItems();
  }

  async insertProjectsItems() {
    const projects = this.projects;
    const html = projects.map((project) => this.projectItem(project)).join("");
    const projectList = document.querySelector(
      '[data-value="product-linker-project-list"]'
    );
    projectList.insertAdjacentHTML("beforeend", html);
  }

  async like(projectId = this.projectId) {
    if (this?.LikeIsLoading) return;
    this.LikeIsLoading = true;

    const toLike = this.isLiked ? false : true;
    const likeBtn = document.querySelector('[data-value="like-btn"]');

    if (toLike) {
      likeBtn.dataset.state = "active";
      try {
        const data = await fetch(`${API_ROUTE}/like/${projectId}`, {
          method: "PATCH",
          mode: "cors",
        }).then((res) => res.json());
        if (data.status !== "success") throw new Error();
      } catch (err) {
        this.LikeIsLoading = false;
        likeBtn.dataset.state = "inactive";
        return;
      }
    } else {
      likeBtn.dataset.state = "inactive";
      try {
        const data = await fetch(`${API_ROUTE}/unlike/${projectId}`, {
          method: "PATCH",
          mode: "cors",
        }).then((res) => res.json());
        if (data.status !== "success") throw new Error();
      } catch (err) {
        this.LikeIsLoading = false;
        likeBtn.dataset.state = "active";
        return;
      }
    }

    this.isLiked = toLike;
    localStorage.setItem(`isLiked-${projectId}`, this.isLiked);
    const likeNum = document.querySelector(
      '[data-value="project-linker-like-container-number"]'
    );
    this.myProjectData.likes = toLike
      ? this.myProjectData?.likes + 1
      : this.myProjectData?.likes - 1;
    likeNum.textContent = this.likify(this.myProjectData?.likes);
    this.LikeIsLoading = false;
  }

  projectItem(projectData) {
    return `
    <a href="${projectData.projectUrl}" class="project-linker--list-item">
        <div class="project-linker--list-item--image" style="background-image: url('${
          projectData?.projectImg
        }');"></div>
        <div class="project-linker--list-item--details">
            <img
            src="${projectData.authorImg}"
            alt=""
            />
            <div data-content="identity">
            <span><b>${projectData.author}</b></span>
            <span>${projectData.institution}</span>
            </div>
            <span data-content="like-number">${this.likify(
              projectData.likes
            )}</span>
        </div>
    </a>`;
  }

  projectContainerHtml() {
    return `
    <div class="project-linker">
      <button class="project-linker--snippet" data-value="like-btn" data-state="${
        this.isLiked ? "active" : "inactive"
      }">
        <span>Like this project</span>
        <span class="project-linker--like-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="project-linker--like"
            data-like-type="not-liked"
          >
            <path
              d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="project-linker--like"
            data-like-type="liked"
          >
            <path
              d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
            />
          </svg>
          <span data-value="project-linker-like-container-number">${this.likify(
            this.myProjectData?.likes
          )}</span>
        </span>
      </button>
      <div class="project-linker--container">
        <div class="project-linker--header">From other students...</div>
        <div class="project-linker--list" data-value="product-linker-project-list"></div>
      </div>
    </div>`;
  }

  likify(num) {
    return `${num}  ${num !== 1 ? "likes" : "like"}`;
  }
}
