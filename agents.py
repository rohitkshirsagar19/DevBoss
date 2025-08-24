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