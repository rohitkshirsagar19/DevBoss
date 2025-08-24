from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

from crewai import Crew, Process
from agents import coordinator, allocator, tracker, reviewer, resolver, reporter
from tasks import ProjectTasks

# Create a Pydantic model for the request body
class ProjectRequest(BaseModel):
    goal: str

# Create the FastAPI app instance
app = FastAPI(
    title="DevBoss API",
    description="API for the multi-agent AI IT Manager.",
    version="0.1.0"
)

@app.get("/")
def read_root():
    """A simple endpoint to confirm the server is running."""
    return {"status": "ok", "message": "Welcome to DevBoss !"}

@app.post("/run-project")
def run_project(request: ProjectRequest):
    """Endpoint to kick off the multi-agent crew."""
    
    # Instantiate the tasks class
    tasks = ProjectTasks()
    
    # Define the tasks for the crew
    plan_task = tasks.plan_project_task(coordinator, request.goal)
    allocation_task = tasks.allocate_tasks_task(allocator, [plan_task])
    execution_task = tasks.manage_project_execution_task(coordinator, [allocation_task])
    
    # Assemble the crew
    project_crew = Crew(
      agents=[coordinator, allocator, tracker, reviewer, resolver, reporter],
      tasks=[plan_task, allocation_task, execution_task],
      process=Process.sequential,
      verbose=True
    )
    
    # Kick off the crew's work
    result = project_crew.kickoff()
    
    return {"status": "success", "result": result}


# This allows running the app directly with `python main.py`
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)