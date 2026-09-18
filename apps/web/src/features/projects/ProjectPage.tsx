import { useEffect, useState } from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';

import {
  getProject,
} from './project.service';

import type { Project } from './project.types';
import TaskList from '../tasks/TaskList';
import CreateTaskForm from '../tasks/CreateTaskForm';

 

export default function ProjectPage() {
  const {
    workspaceId,
    projectId,
  } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const navigate = useNavigate();

  const { accessToken } = useAuth();

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [taskRefreshKey, setTaskRefreshKey] =
    useState(0);

  useEffect(() => {
    if (
      !workspaceId ||
      !projectId ||
      !accessToken
    ) {
      return;
    }

    async function loadProject() {
      try {
        const data =
          await getProject(
            workspaceId as string,
            projectId   as string,
            accessToken     as string,
          );

        setProject(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load project',
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [
    workspaceId,
    projectId,
    accessToken,
  ]);

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (error) {
    return (
      <main>
        <p role="alert">
          {error}
        </p>

        <button
          onClick={() =>
            navigate(
              `/workspaces/${workspaceId}`,
            )
          }
        >
          Back to Workspace
        </button>
      </main>
    );
  }

  if (!project || !workspaceId || !projectId) {
    return (
      <p>
        Project not found.
      </p>
    );
  }

  return (
    <main>
      <button
        onClick={() =>
          navigate(
            `/workspaces/${workspaceId}`,
          )
        }
      >
        ← Workspace
      </button>

      <h1>{project.name}</h1>

      {project.description && (
        <p>
          {project.description}
        </p>
      )}

      <p>
        Status: {project.status}
      </p>

      <CreateTaskForm
        workspaceId={workspaceId}
        projectId={projectId}
        onCreated={() => {
          setTaskRefreshKey(
            (value) => value + 1,
          );
        }}
      />

      <TaskList
        key={taskRefreshKey}
        workspaceId={workspaceId}
        projectId={projectId}
      />
    </main>
  );
}