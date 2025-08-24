import requests
from requests.auth import HTTPBasicAuth

# Your Jira domain (e.g., your-domain.atlassian.net)
jira_domain = "anshuladgurwar2004.atlassian.net"

# Your email associated with Atlassian account
email = "anshuladgurwar2004@gmail.com"

# Your API token (Jira API key)
api_token = "ATATT3xFfGF0X-ApIxboiXQsPwC8SqGCG8f6s3cYMUqOTshloveXkX216O-UJwXHSmAgRDr85hvdWEfp51LxCC0Rd_rL1vM4yCKSyjWt1NoMu2ROSI4M7jPg8uHIoc814PdG_ArjE6RDY_RZNxOXmWLWIjq8dLMTbzLR7Khu4P9HJqIatgrFP3A=6482380A"

# Jira API endpoint to fetch issues (example: search issues)
url = f"https://anshuladgurwar2004.atlassian.net/rest/api/3/search"

# Query parameters (adjust JQL as needed)
query = {
    'jql': 'project=TEST',
    'maxResults': 5  # number of issues to fetch
}

# Make GET request to Jira API with basic auth using email and API token
response = requests.get(url, params=query, auth=HTTPBasicAuth(email, api_token))

# Check response status
if response.status_code == 200:
    data = response.json()
    print("Fetched issues:")
    for issue in data.get('issues', []):
        print(f"- {issue['key']}: {issue['fields']['summary']}")
else:
    print(f"Failed to fetch issues. Status code: {response.status_code}")
    print(response.text)
