from crewai import Task
from agents import coordinator, allocator, tracker, reviewer, resolver, reporter

#---------------- Task Definitions ----------------#

# We will create a class to hold all our task definitions
class ProjectTasks():
    def plan_project_task(self, agent, project_goal):
        return Task(
            description=(
                f"Your primary task is to create a comprehensive, high-level project plan "
                f"based on the following user request: '{project_goal}'. "
                "Your plan should identify the key stages, milestones, and potential "
                "technologies or areas of research required. "
                "Use your tools to research any unfamiliar concepts. "
                "The final plan should be clear and structured, ready to be passed to the "
                "Task Allocator for detailed breakdown."
            ),
            agent=agent,
            expected_output="A structured, step-by-step project plan outlining key milestones and deliverables."
        )

    def allocate_tasks_task(self, agent, context):
        return Task(
            description=(
                "Based on the detailed project plan provided, your responsibility is to "
                "break down the project into a list of specific, granular sub-tasks. "
                "Each sub-task should be a clear and actionable item for the development team. "
                "Ensure the list is logically ordered and covers all aspects of the plan."
            ),
            agent=agent,
            context=context,
            expected_output="A numbered list of well-defined sub-tasks, ready for assignment."
        )

    def manage_project_execution_task(self, agent, context):
        return Task(
            description=(
                "Oversee the execution of the project based on the provided sub-task list. "
                "You are responsible for managing the entire lifecycle from this point forward. "
                "Coordinate with the Tracker to monitor progress, the Reviewer for quality assurance, "
                "and the Resolver for any issues. "
                "Once all sub-tasks are completed, you must delegate the final reporting to the Reporter agent. "
                "Ensure a final, comprehensive project summary is compiled."
            ),
            agent=agent,
            context=context,
            expected_output="The final project report, summarizing all tasks performed, outcomes, and metrics."
        )