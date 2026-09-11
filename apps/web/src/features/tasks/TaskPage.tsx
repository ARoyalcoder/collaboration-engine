import { useEffect, useState } from 'react';
import {
    
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { getTask } from './task.service';
import type { Task } from './task.types';

export default function TaskPage() {
  const {
    workspaceId,
    projectId,
    taskId,
  } = useParams<{
    workspaceId: string;
    projectId: string;
    taskId: string;
  }>();

  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [task, setTask] =
    useState<Task | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (
      !workspaceId ||
      !projectId ||
      !taskId ||
      !accessToken
    ) {
      return;
    }

    async function loadTask() {
      try {
        const data =
          await getTask(
            workspaceId as string,
            projectId as string,
            taskId as string    ,
                accessToken as string,
          );

        setTask(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load task',
        );
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [
    workspaceId,
    projectId,
    taskId,
    accessToken,
  ]);

  if (loading) {
    return <p>Loading task...</p>;
  }

  if (error) {
    return (
      <p role="alert">
        {error}
      </p>
    );
  }

  if (
    !task ||
    !workspaceId ||
    !projectId
  ) {
    return (
      <p>
        Task not found.
      </p>
    );
  }

  return (
    <main>
      <button
        onClick={() =>
          navigate(
            `/workspaces/${workspaceId}/projects/${projectId}`,
          )
        }
      >
        ← Project
      </button>

      <h1>{task.title}</h1>

      {task.description && (
        <p>
          {task.description}
        </p>
      )}

      <p>
        Status: {task.status}
      </p>

      <p>
        Priority: {task.priority}
      </p>

      {task.assignedTo && (
        <p>
          Assigned to:{' '}
          {task.assignedTo.name}
        </p>
      )}

      {task.dueDate && (
        <p>
          Due:{' '}
          {new Date(
            task.dueDate,
          ).toLocaleString()}
        </p>
      )}

      <p>
        Version: {task.version}
      </p>
    </main>
  );
}