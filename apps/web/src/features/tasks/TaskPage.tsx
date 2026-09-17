import { useEffect, useState } from 'react';
import {
    
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { getTask } from './task.service';
import { joinTask, leaveTask, socket } from '../../services/socket';
import type { CommentDeletedEvent, CommentEventComment } from '@collaboration-engine/shared';
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

  const [comments, setComments] =
    useState<CommentEventComment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshKey, setRefreshKey] =
    useState(0);

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

  useEffect(() => {
    if (!task || !workspaceId || !projectId || !taskId) {
      return;
    }

    void joinTask(
      workspaceId,
      projectId,
      taskId,
    );

    return () => {
      leaveTask(taskId);
    };
  }, [
    task,
    workspaceId,
    projectId,
    taskId,
  ]);

  useEffect(() => {
    const handleCommentCreated = () => {
      setRefreshKey((value) => value + 1);
    };

    const handleCommentUpdated = () => {
      setRefreshKey((value) => value + 1);
    };

    const handleCommentDeleted = (
      event: CommentDeletedEvent,
    ) => {
      setComments((current) =>
        current.filter(
          (comment) =>
            comment.id !== event.commentId,
        ),
      );
    };

    socket.on(
      'comment.created',
      handleCommentCreated,
    );

    socket.on(
      'comment.updated',
      handleCommentUpdated,
    );

    socket.on(
      'comment.deleted',
      handleCommentDeleted,
    );

    return () => {
      socket.off(
        'comment.created',
        handleCommentCreated,
      );

      socket.off(
        'comment.updated',
        handleCommentUpdated,
      );

      socket.off(
        'comment.deleted',
        handleCommentDeleted,
      );
    };
  }, []);

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
    <main key={refreshKey}>
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

      {comments.length > 0 && (
        <section>
          <h2>Comments ({comments.length})</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.content}</p>
                <small>
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}