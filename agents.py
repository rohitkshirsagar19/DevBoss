# agents.py
from crewai import Agent
from crewai.tools import BaseTool
from langchain_community.tools import DuckDuckGoSearchRun
from llm_config import llm

# NEW IMPORTS for creating a tool schema
from pydantic import BaseModel, Field
from typing import Type

# --- Tool Schema Definition ---
# This defines the expected input for our tool
class SearchToolArgs(BaseModel):
    query: str = Field(description="The search query string.")

# --- Tool Definition ---
# We update the tool to use the new schema
class DuckDuckGoSearchTool(BaseTool):
    name: str = "Web Search"
    description: str = "Search the internet for relevant information and articles."
    args_schema: Type[BaseModel] = SearchToolArgs # Assign the schema here

    def _run(self, query: str) -> str:
        """Use the tool."""
        search_tool = DuckDuckGoSearchRun()
        return search_tool.run(query)

# --- Agent Definitions ---
# No changes needed here
coordinator = Agent(
    role='Project Coordinator',
    goal='Oversee the project, ensuring tasks align with the main goal.',
    backstory=(
        "You are a seasoned Project Coordinator... You ensure all agents stay in harmony."
    ),
    tools=[DuckDuckGoSearchTool()],
    allow_delegation=True,
    verbose=True,
    llm=llm
)

# (The rest of your agents remain the same, ensure they all have llm=llm)
allocator = Agent(
  role='Task Allocator',
  goal='Break down the project plan into granular, actionable sub-tasks and assign them appropriately.',
  backstory=(
    "You are a meticulous Task Allocator... Your work ensures that everyone knows exactly what they need to do."
  ),
  tools=[],
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
  tools=[],
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
  tools=[],
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