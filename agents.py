# agents.py

from crewai import Agent
# IMPORT the new JiraCreateTicketTool
from tools import JiraFetchIssuesTool, HumanInputTool, JiraCreateTicketTool
from llm_config import llm

# --- Agent Definitions ---

coordinator = Agent(
    role='Project Coordinator',
    goal='Oversee the project, ensuring tasks align with the main goal.',
    backstory=(
        "You are a seasoned Project Coordinator... You ensure all agents stay in harmony."
    ),
    tools=[],
    allow_delegation=True,
    verbose=True,
    llm=llm
)

# Allocator agent is now equipped with the Jira Ticket Creator tool
allocator = Agent(
  role='Task Allocator',
  goal='Break down the project plan into granular, actionable sub-tasks and create them in Jira.', # Goal updated
  backstory=(
    "You are a meticulous Task Allocator... Your work ensures that everyone knows exactly what they need to do."
  ),
  tools=[JiraCreateTicketTool()], # <-- ADDED the new Jira creation tool
  allow_delegation=False,
  verbose=True,
  llm=llm
)

tracker = Agent(
  role='Progress Tracker',
  goal='Monitor the development process, track task status, and report any deviations or blockers.',
  backstory=(
    "You are a vigilant Progress Tracker... ensuring the Coordinator always has an accurate picture of the project's status."
  ),
  tools=[JiraFetchIssuesTool()],
  allow_delegation=False,
  verbose=True,
  llm=llm
)

reviewer = Agent(
  role='Code Reviewer',
  goal='Analyze code submissions for quality, adherence to standards, and potential bugs.',
  backstory=(
    "You are a senior software engineer... ensuring that every line of code is clean, efficient, and bug-free."
  ),
  tools=[],
  allow_delegation=False,
  verbose=True,
  llm=llm
)

resolver = Agent(
  role='Conflict Resolver',
  goal='Identify and resolve conflicts, technical blockers, or ambiguities in tasks.',
  backstory=(
    "You are the team's troubleshooter... you are responsible for escalating the issue to a human for a final decision."
  ),
  tools=[HumanInputTool()],
  allow_delegation=True,
  verbose=True,
  llm=llm
)

reporter = Agent(
  role='Reporting Specialist',
  goal='Compile a final, comprehensive report of the project, including outcomes, metrics, and tasks performed.',
  backstory=(
    "You are a Reporting Specialist... summarizing its successes and outcomes."
  ),
  tools=[],
  allow_delegation=False,
  verbose=True,
  llm=llm
)