#!/usr/bin/env python3

import csv
import requests
import sys

# Define the repository directory
REPO_DIR = "../../git"
BITBUCKET_BASE_URL = "https://bitbucket/rest/api/latest"
BITBUCKET_TOKEN = open('.bitbucket-token', 'r').read().strip()
BITBUCKET_PAGE_SIZE = 50
DEBUG = '-v' in sys.argv

def debug_print(message):
    if DEBUG:
        print(message)

def fetch(path, start = 0):
    url = f"{BITBUCKET_BASE_URL}/{path}?limit={BITBUCKET_PAGE_SIZE}&start={start}"
    headers = {"Authorization": f"Bearer {BITBUCKET_TOKEN}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def fetchProjects(start = 0):
    debug_print(f"Fetching projects from {start} to {start + BITBUCKET_PAGE_SIZE}")
    projectsResponse = fetch("projects", start)
    if projectsResponse['isLastPage']:
        return projectsResponse['values']
    else:
        return projectsResponse['values'] + fetchProjects(projectsResponse['nextPageStart'])

def prettyPrintProjects(projects):
    for project in projects:
        print(f"{project['key']} - {project['name']}")

def fetchRepositoriesForProject(project, start = 0):
    debug_print(f"Fetching repositories for project {project['key']} from {start} to {start + BITBUCKET_PAGE_SIZE}")
    repositoriesResponse = fetch(f"projects/{project['key']}/repos", start)
    if repositoriesResponse['isLastPage']:
        return repositoriesResponse['values']
    else:
        return repositoriesResponse['values'] + fetchRepositoriesForProject(project, repositoriesResponse['nextPageStart'])

def fetchRepositories(projects):
    all_repositories = []

    for project in projects:
        debug_print(f"Fetching repositories for project {project['key']}...")
        repositories = fetchRepositoriesForProject(project)
        all_repositories.extend(repositories)

    return all_repositories

def prettyPrintRepositories(repositories):
    for repository in repositories:
        ssh_clone_url = next((url['href'] for url in repository['links']['clone'] if url['name'] == 'ssh'), None)
        print(f"{repository['project']['key']} - {repository['name']} - {ssh_clone_url}")

def generateCSVFromRepos(repositories):
    with open('repositories.csv', 'w') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['project.key', 'project.name', 'repository', 'url', 'state'])
        for repository in repositories:
            ssh_clone_url = next((url['href'] for url in repository['links']['clone'] if url['name'] == 'ssh'), None)
            csv_writer.writerow([repository['project']['key'], repository['project']['name'], repository['name'], ssh_clone_url, repository['state']])

if __name__ == "__main__":
    print(f"Repository directory: {REPO_DIR}")

    projects = fetchProjects()
    prettyPrintProjects(projects)
    print(f"Loaded {len(projects)} projects from BitBucket.")

    repos = fetchRepositories(projects)
    prettyPrintRepositories(repos)
    print(f"Loaded {len(repos)} repositories from BitBucket.")

    generateCSVFromRepos(repos)