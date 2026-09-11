import {
  useState,
  type SyntheticEvent,
} from 'react';

import { useAuth } from '../auth/AuthContext';
import { createTask } from './task.service';
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from './task.types';

type Props = {
  workspaceId: string;
  projectId: string;
  onCreated: (
    task: Task,
  ) => void;
};

export default function CreateTaskForm({
  workspaceId,
  projectId,
  onCreated,
}: Props) {
  const { accessToken } = useAuth();

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [status, setStatus] =
    useState<TaskStatus>('TODO');

  const [priority, setPriority] =
    useState<TaskPriority>('MEDIUM');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const task =
        await createTask(
          workspaceId,
          projectId,
          {
            title,
            description:
              description || null,
            status,
            priority,
          },
          accessToken,
        );

      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');

      onCreated(task);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create task',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Create Task</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="task-title">
            Title
          </label>

          <input
            id="task-title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            minLength={2}
            maxLength={200}
            required
          />
        </div>

        <div>
          <label htmlFor="task-description">
            Description
          </label>

          <textarea
            id="task-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            maxLength={5000}
          />
        </div>

        <div>
          <label htmlFor="task-status">
            Status
          </label>

          <select
            id="task-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as TaskStatus,
              )
            }
          >
            <option value="TODO">
              To Do
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="IN_REVIEW">
              In Review
            </option>

            <option value="DONE">
              Done
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="task-priority">
            Priority
          </label>

          <select
            id="task-priority"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target
                  .value as TaskPriority,
              )
            }
          >
            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="URGENT">
              Urgent
            </option>
          </select>
        </div>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating...'
            : 'Create Task'}
        </button>
      </form>
    </section>
  );
}