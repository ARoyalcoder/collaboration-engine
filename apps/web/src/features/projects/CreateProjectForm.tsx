import {
  useState,
  type SyntheticEvent,
} from 'react';

import { useAuth } from '../auth/AuthContext';
import { createProject } from './project.service';
import type {
  Project,
  ProjectStatus,
} from './project.types';

type Props = {
  workspaceId: string;
  onCreated: (
    project: Project,
  ) => void;
};

export default function CreateProjectForm({
  workspaceId,
  onCreated,
}: Props) {
  const { accessToken } = useAuth();

  const [name, setName] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [status, setStatus] =
    useState<ProjectStatus>('PLANNING');

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
      const project =
        await createProject(
          workspaceId,
          {
            name,
            description:
              description || undefined,
            status,
          },
          accessToken,
        );

      setName('');
      setDescription('');
      setStatus('PLANNING');

      onCreated(project);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create project',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Create Project</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="project-name">
            Project name
          </label>

          <input
            id="project-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            minLength={2}
            maxLength={150}
            required
          />
        </div>

        <div>
          <label htmlFor="project-description">
            Description
          </label>

          <textarea
            id="project-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            maxLength={2000}
          />
        </div>

        <div>
          <label htmlFor="project-status">
            Status
          </label>

          <select
            id="project-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as ProjectStatus,
              )
            }
          >
            <option value="PLANNING">
              Planning
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="ARCHIVED">
              Archived
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
            : 'Create Project'}
        </button>
      </form>
    </section>
  );
}