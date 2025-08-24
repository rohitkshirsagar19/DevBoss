import os
from dotenv import load_dotenv
from crewai import Agent
from langchain_community.tools import DuckDuckGoSearchRun
from crewai.tools import BaseTool

# Load environment variables
load_dotenv()

# Define a custom tool for DuckDuckGo search
class DuckDuckGoSearchTool(BaseTool):
    name: str = "Web Search"
    description: str = "Search the internet for relevant information and articles."

    def _run(self, query: str):
        """Run a DuckDuckGo search with the provided query."""
        search_tool = DuckDuckGoSearchRun()
        return search_tool.run(query)

    async def _arun(self, query: str):
        # Optional: implement async if needed
        return self._run(query)

# Agent
coordinator = Agent(
    role='Project Coordinator',
    goal='Oversee the project, ensuring tasks align with the main goal.',
    backstory=(
        "You are a seasoned Project Coordinator in a fast-paced tech company. "
        "You excel at breaking down complex goals into actionable plans. "
        "You ensure all agents stay in harmony."
    ),
    tools=[DuckDuckGoSearchTool()],
    allow_delegation=True,
    verbose=True
)

# Define the Allocator Agent
allocator = Agent(
  role='Task Allocator',
  goal='Break down the project plan into granular, actionable sub-tasks and assign them appropriately.',
  backstory=(
    "You are a meticulous Task Allocator, known for your ability to see the bigger picture and the smallest details simultaneously. "
    "You specialize in converting strategic plans into a perfectly structured list of tasks for the development team. "
    "Your work ensures that everyone knows exactly what they need to do."
  ),
  tools=[],
  allow_delegation=False,
  verbose=True
)

# Define the Tracker Agent
tracker = Agent(
  role='Progress Tracker',
  goal='Monitor the development process, track task status, and report any deviations or blockers.',
  backstory=(
    "You are a vigilant Progress Tracker, the eyes and ears of the project. "
    "Your primary function is to observe the workflow, connecting to tools like GitHub and Jira "
    "to provide real-time updates. You are meticulous and never miss a detail, ensuring the "
    "Coordinator always has an accurate picture of the project's status."
  ),
  # Note: We will add specific GitHub/Jira tools here later.
  tools=[],
  allow_delegation=False,
  verbose=True
)

# Define the Reviewer Agent
reviewer = Agent(
  role='Code Reviewer',
  goal='Analyze code submissions for quality, adherence to standards, and potential bugs.',
  backstory=(
    "You are a senior software engineer with a passion for quality code. "
    "Your role is to act as the gatekeeper for the codebase. You meticulously review pull requests, "
    "providing constructive feedback to ensure that every line of code is clean, efficient, "
    "and bug-free before it gets merged."
  ),
  # Note: We will add specific code analysis tools here later.
  tools=[],
  allow_delegation=False,
  verbose=True
)

# Define the Resolver Agent
resolver = Agent(
  role='Conflict Resolver',
  goal='Identify and resolve conflicts, technical blockers, or ambiguities in tasks.',
  backstory=(
    "You are the team's troubleshooter. With a calm demeanor and sharp analytical skills, "
    "you step in whenever there is a conflict, a technical blocker, or a task that is poorly defined. "
    "Your primary objective is to find a solution, and if you cannot, you are responsible for escalating the issue "
    "to a human for a final decision."
  ),
  tools=[],
  allow_delegation=True,
  verbose=True
)

# Define the Reporter Agent
reporter = Agent(
  role='Reporting Specialist',
  goal='Compile a final, comprehensive report of the project, including outcomes, metrics, and tasks performed.',
  backstory=(
    "You are a Reporting Specialist with a knack for clear and concise communication. "
    "Your role is to take all the data and logs from a completed project and synthesize them into a "
    "professional, easy-to-read report. You are the final voice of the project, summarizing its successes and outcomes."
  ),
  tools=[],
  allow_delegation=False,
  verbose=True
)