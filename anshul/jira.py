import requests
from requests.auth import HTTPBasicAuth
from collections import defaultdict
import os
from dotenv import load_dotenv
load_dotenv()


# Now you can access the environment variable
api_token = os.getenv("JIRA_API_TOKEN")
jira_domain = os.getenv("JIRA_DOMAIN")
email = os.getenv("EMAIL")
url = os.getenv("URL")


query = {
    'jql': 'project=TEST',
    'maxResults': 50
}

response = requests.get(url, params=query, auth=HTTPBasicAuth(email, api_token))

if response.status_code == 200:
    data = response.json()
    status_groups = defaultdict(list)

    # Group issues by status name
    for issue in data.get('issues', []):
        status_name = issue['fields']['status']['name']
        status_groups[status_name.upper()].append(issue)

    # Define list of statuses to print in desired order
    statuses_to_print = ['TO DO', 'IN PROGRESS', 'DONE']

    # Print issues grouped by status, only for these statuses and in order
    for status in statuses_to_print:
        print(f"{status}:")
        for issue in status_groups.get(status, []):
            print(f"- {issue['key']}: {issue['fields']['summary']}")
        print()  # Blank line for spacing
else:
    print(f"Failed to fetch issues. Status code: {response.status_code}")
    print(response.text)