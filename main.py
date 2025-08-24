import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from crewai import Crew, Process
from agents import coordinator, allocator, tracker, reviewer, resolver, reporter
from tasks import ProjectTasks
from rl_optimizer import RLOptimizer, calculate_reward

# --- Application Setup ---
class ProjectRequest(BaseModel):
    goal: str

app = FastAPI(title="DevBoss Swarm API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

rl_optimizer = RLOptimizer()

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to DevBoss Swarm!"}

@app.post("/run-project")
def run_project(request: ProjectRequest):
    """
    Endpoint to kick off the multi-agent crew synchronously.
    The entire process will run before a response is sent.
    """
    dummy_state = [len(request.goal), 6, 5, 1] # e.g. goal length, team size, etc.
    rl_optimizer.select_action(dummy_state)
    
    tasks = ProjectTasks()
    
    # Define the full sequence of tasks
    plan_task = tasks.plan_project_task(coordinator, request.goal)
    allocation_task = tasks.allocate_tasks_task(allocator, [plan_task])
    track_task = tasks.track_progress_task(tracker, [allocation_task])
    resolve_task = tasks.resolve_conflicts_task(resolver, [track_task])
    execution_task = tasks.manage_project_execution_task(coordinator, [resolve_task])
    
    project_crew = Crew(
      agents=[coordinator, allocator, tracker, reviewer, resolver, reporter],
      tasks=[plan_task, allocation_task, track_task, resolve_task, execution_task],
      process=Process.sequential,
      verbose=True
    )
    
    # 1. The crew runs the project
    result = project_crew.kickoff()
    
    # 2. We calculate a reward based on the outcome
    reward = calculate_reward(result)
    rl_optimizer.rewards.append(reward)
    
    # 3. We update the RL agent's policy using that reward
    rl_optimizer.update_policy()
    
    return {"status": "success", "result": result, "reward": reward}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)