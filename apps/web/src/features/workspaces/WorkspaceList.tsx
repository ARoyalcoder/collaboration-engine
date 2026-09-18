import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { listWorkspaces } from './workspace.service';
import type { Workspace } from './workspace.types';
import WorkspaceCard from './WorkspaceCard';

type WorkspaceListProps = {
  selectedWorkspaceId?: string | null;
  onSelectWorkspace?: (workspace: Workspace) => void;
  onWorkspacesLoaded?: (workspaces: Workspace[]) => void;
};

export default function WorkspaceList({
  selectedWorkspaceId,
  onSelectWorkspace,
  onWorkspacesLoaded,
}: WorkspaceListProps) {
  const { accessToken } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const token = accessToken;

    async function loadWorkspaces() {
      try {
        const data = await listWorkspaces(token);
        setWorkspaces(data);
        if (onWorkspacesLoaded) {
          onWorkspacesLoaded(data);
        }
        if (data.length > 0 && !selectedWorkspaceId && onSelectWorkspace) {
          onSelectWorkspace(data[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Unable to load workspaces',
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, [accessToken, onSelectWorkspace, onWorkspacesLoaded, selectedWorkspaceId]);

  if (loading) {
    return <div className="loading-spinner">Loading workspaces...</div>;
  }

  if (error) {
    return <p role="alert" style={{ color: '#ef4444' }}>{error}</p>;
  }

  const safeWorkspaces = Array.isArray(workspaces) ? workspaces : [];

  return (
    <div className="workspace-list">
      {safeWorkspaces.length === 0 ? (
        <div className="empty-state">
          <p>You are not a member of any workspace yet.</p>
        </div>
      ) : (
        safeWorkspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            isSelected={selectedWorkspaceId === workspace.id}
            onSelect={() => {
              if (onSelectWorkspace) {
                onSelectWorkspace(workspace);
              }
            }}
          />
        ))
      )}
    </div>
  );
}