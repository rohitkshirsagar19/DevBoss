import os
import requests
from requests.auth import HTTPBasicAuth
from collections import defaultdict
from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import json

# --- Tool for fetching Jira Issues ---

# Define the input schema for the tool
class JiraToolArgs(BaseModel):
    project_key: str = Field(description="The Jira project key, e.g., 'TEST'.")

class JiraFetchIssuesTool(BaseTool):
    name: str = "Jira Issue Fetcher"
    description: str = "Fetches and lists all issues from a specific Jira project, and calculates the completion percentage."
    args_schema: Type[BaseModel] = JiraToolArgs

    def _run(self, project_key: str) -> str:
        # Load credentials from environment variables
        jira_domain = os.getenv("JIRA_DOMAIN")
        email = os.getenv("EMAIL")
        api_token = os.getenv("JIRA_API_TOKEN")

        if not all([jira_domain, email, api_token]):
            return json.dumps({"error": "Jira credentials are not fully set."})

        url = f"https://{jira_domain}/rest/api/2/search"
        query = {'jql': f"project = {project_key}", 'maxResults': 50}

        try:
            response = requests.get(url, params=query, auth=HTTPBasicAuth(email, api_token), timeout=10)
            response.raise_for_status()

            data = response.json()
            issues = data.get('issues', [])
            if not issues:
                return json.dumps({"summary": f"No issues found for project '{project_key}'.", "progress": 0})

            # --- NEW: Progress Calculation Logic ---
            status_groups = defaultdict(list)
            done_count = 0
            for issue in issues:
                status_name = issue['fields']['status']['name'].upper()
                status_groups[status_name].append(issue)
                if status_name == 'DONE':
                    done_count += 1
            
            total_count = len(issues)
            progress_percentage = int((done_count / total_count) * 100) if total_count > 0 else 0
            # --- END of new logic ---

            output_lines = [f"Jira Issues for Project: {project_key}\n"]
            statuses_to_report = ['TO DO', 'IN PROGRESS', 'DONE']

            for status in statuses_to_report:
                output_lines.append(f"--- {status} ---")
                if status in status_groups:
                    for issue in status_groups[status]:
                        output_lines.append(f"- {issue['key']}: {issue['fields']['summary']}")
                else:
                    output_lines.append(" (No issues)")
                output_lines.append("")
            
            summary_text = "\n".join(output_lines)

            # --- NEW: Return structured JSON ---
            structured_output = {
                "summary": summary_text,
                "progress": progress_percentage
            }
            return json.dumps(structured_output)

        except requests.exceptions.RequestException as e:
            return json.dumps({"error": f"Error connecting to Jira: {e}"})
        except Exception as e:
            return json.dumps({"error": f"An unexpected error occurred: {e}"})
                

# --- Tool for Human Input ---

# (The HumanInputToolArgs schema remains the same)
class HumanInputToolArgs(BaseModel):
    question: str = Field(description="The question to ask the human for guidance.")

class HumanInputTool(BaseTool):
    name: str = "Human Input"
    description: str = "A tool to ask a human for a decision or guidance when the AI is stuck. Use this only as a last resort when you cannot proceed."
    args_schema: Type[BaseModel] = HumanInputToolArgs

    def _run(self, question: str) -> str:
        """
        The agent uses this tool to ask a question.
        The question is passed to the step_callback, which pauses and waits for a human response.
        """
        # This tool no longer waits for input. It simply returns the question.
        return question

# Define the input schema for the new tool
class JiraCreateTicketArgs(BaseModel):
    project_key: str = Field(description="The Jira project key, e.g., 'TEST'.")
    summary: str = Field(description="The title or summary of the Jira ticket.")
    description: str = Field(description="The detailed description for the Jira ticket.")
    issue_type: str = Field(description="The type of the issue, e.g., 'Task', 'Story', or 'Bug'.", default="Task")

class JiraCreateTicketTool(BaseTool):
    name: str = "Jira Ticket Creator"
    description: str = "A tool to create a new ticket in a Jira project."
    args_schema: Type[BaseModel] = JiraCreateTicketArgs

    def _run(self, project_key: str, summary: str, description: str, issue_type: str = "Task") -> str:
        # Load credentials from environment variables
        jira_domain = os.getenv("JIRA_DOMAIN")
        email = os.getenv("EMAIL")
        api_token = os.getenv("JIRA_API_TOKEN")

        if not all([jira_domain, email, api_token]):
            return "Error: Jira credentials are not fully set in the .env file."

        # Construct the API URL for creating an issue
        url = f"https://{jira_domain}/rest/api/2/issue"

        # Set up the authentication header
        auth = HTTPBasicAuth(email, api_token)
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

        # Construct the payload with the ticket details
        payload = {
            "fields": {
                "project": {
                    "key": project_key
                },
                "summary": summary,
                "description": description,
                "issuetype": {
                    "name": issue_type
                }
            }
        }

        try:
            response = requests.post(url, json=payload, headers=headers, auth=auth, timeout=10)
            response.raise_for_status()
            
            # If successful, Jira returns the details of the created ticket
            created_ticket = response.json()
            ticket_key = created_ticket['key']
            return f"Successfully created Jira ticket: {ticket_key}"

        except requests.exceptions.RequestException as e:
            return f"Error creating Jira ticket: {e}. Response: {e.response.text if e.response else 'No response'}"
        except Exception as e:
            return f"An unexpected error occurred: {e}"