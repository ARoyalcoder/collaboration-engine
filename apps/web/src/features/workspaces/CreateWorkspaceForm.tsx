import { useState, type SyntheticEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { createWorkspace } from './workspace.service';
import type { Workspace } from './workspace.types';

type Props = {
  onCreated: (workspace: Workspace) => void;
};

export default function CreateWorkspaceForm({ onCreated }: Props) {
  const { accessToken } = useAuth();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const workspace = await createWorkspace({ name }, accessToken);
      setName('');
      onCreated(workspace);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create workspace',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="workspace-name">New Workspace Name</label>
          <input
            id="workspace-name"
            className="form-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Engineering Team"
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        {error && (
          <p role="alert" style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? 'Creating...' : '+ Create Workspace'}
        </button>
      </form>
    </div>
  );
}
