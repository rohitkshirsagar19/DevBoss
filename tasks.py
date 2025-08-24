from crewai import Task
from agents import coordinator, allocator, tracker, reviewer, resolver, reporter

class ProjectTasks():
    # CORRECTED the function signature to accept 'project_goal'
    def plan_project_task(self, agent, project_goal):
        return Task(
            description=(
                f"Your primary task is to create a comprehensive, high-level project plan "
                f"based on the following user request: '{project_goal}'. "
                "Your plan should identify the key stages and milestones. "
                "The final plan should be clear and structured, ready to be passed to the "
                "Task Allocator for detailed breakdown."
            ),
            agent=agent,
            expected_output="A structured, step-by-step project plan outlining key milestones and deliverables."
        )

    def allocate_tasks_task(self, agent, context):
        return Task(
            description=(
                "Based on the detailed project plan provided, your responsibility is to do two things:\n"
                "1. Break down the project into a list of specific, granular sub-tasks.\n"
                "2. For EACH of those sub-tasks, use the 'Jira Ticket Creator' tool to create a ticket in Jira.\n"
                "You must use the project key 'TEST' for all tickets. The sub-task title should be the ticket summary, "
                "and the details should be the ticket description."
            ),
            agent=agent,
            context=context,
            expected_output="A list of confirmation messages, one for each Jira ticket that was successfully created (e.g., 'Successfully created Jira ticket: TEST-5')."
        )

    def track_progress_task(self, agent, context):
        return Task(
            description=(
                "Monitor the Jira project by using the 'Jira Issue Fetcher' tool to get the current status of all tasks. "
                "You must use the project key 'TEST' as the input for the tool. "
                "Analyze the returned list of issues and provide a concise summary of the project's current status."
            ),
            agent=agent,
            context=context,
            expected_output="A summary report of the Jira project's status."
        )

    def resolve_conflicts_task(self, agent, context):
        return Task(
            description=(
                "You have been alerted to a potential conflict or blocker in the project. "
                "The current project status and plan are provided as context. Your task is to analyze the situation. "
                "If a decision is ambiguous, you MUST use the 'Human Input' tool to ask for guidance."
            ),
            agent=agent,
            context=context,
            expected_output="A clear resolution or the decision provided by the human."
        )

    def manage_project_execution_task(self, agent, context):
        return Task(
            description=(
                "Oversee the execution of the project based on the provided context. "
                "Coordinate with the other agents to ensure the project is completed. "
                "Once all work is done, delegate the final reporting to the Reporter agent."
            ),
            agent=agent,
            context=context,
            expected_output="The final project report, summarizing all tasks performed and outcomes."
        )