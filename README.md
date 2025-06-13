# PathFinder

> A productivity platform for designing goals as adaptable systems, not just static, linear checklists. 

## The Problem

Traditional to-do lists often fail because they focus on an endless series of disconnected tasks rather than helping users build sustainable systems for achieving their long-term goals. This can lead to feeling busy but not truly productive.

PathFinder addresses this by reframing productivity. Instead of static task lists, users build modular, visual "goal maps," connecting elements like habits, milestones, and routines. With the future addition of AI-driven feedback, PathFinder is designed to help users build personal workflows that adapt and evolve. 

## MVP: Goal Creation and Tracking
As a new user, I want to be able to signup, login, and create a main "Goal", add "Milestone" nodes, and view my goals and milestones on a simple dashboard. This is the core functionality before more advanced features are added such as other node types or AI integration.

## Tech Stack & Architecture

- **Frontend:** `React` & `TypeScript` - A component-based architecture is ideal for building the application's complex and interactive UI. Typescript ensures the code is more robust and scalable. 
- **UI:** `TailwindCSS` - A Utility-first CSS framework chosen to rapidly develop a modern design system.  
- **Backend:** `Python (FastAPI)` - Chosen for its high performance, modern Python features, and automatic API documentation.
- **Database & Auth:** `Supabase` - Used as a BaaS for Postgres database and manage secure user authentication, speeding up the development timeline.  
- **Deployment:** `AWS (S3, CloudFront, ECR, ECS)` - The architecture was chosen for a professional deployment on industry-standard cloud infrastructure to demonstrate a modern DevOps approach.

## Running the project locally | Installation & Setup
This section contains the instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- [Git]
- [Docker] & [Docker Compose]

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/antanantan/PathFinder.git](https://github.com/antanantan/PathFinder.git)
    cd PathFinder
    ```
    *(If you have the [Github CLI](https://cli.github.com/) installed):*
    ```sh
    gh repo clone antanantan/PathFinder
    cd PathFinder
    ```
2.  **Create your local environment file:**
    Make a copy of the environment template file to store your secret keys and project-specific variables.
    ```sh
    cp .env.example .env
    ```

3.  **Configure environment variables:**
    Open the newly created `.env` file in a text editor. Fill in the placeholder values (`your-super-secret-db-password`, `your-project-ref`, `your-public-anon-key`) with your actual Supabase project credentials.

4.  **Build and run the application with Docker Compose:**
    This command will build the Docker images for the frontend and backend services and start them.
    ```sh
    docker-compose up --build
    ```

5.  **Access the running application:**
    Once the containers are up and running, you can access the different parts of the application:
    - **Frontend Application:** [http://localhost:5173](http://localhost:5173)
    - **Backend API Docs (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
  


      
