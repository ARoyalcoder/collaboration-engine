import type { Workspace } from './workspace.types';

type WorkspaceCardProps = {
  workspace: Workspace;
  onSelect: (workspaceId: string) => void;
  isSelected?: boolean;
};

export default function WorkspaceCard({
  workspace,
  onSelect,
  isSelected = false,
}: WorkspaceCardProps) {
  return (
    <article
      className={`workspace-item-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(workspace.id)}
    >
      <div className="workspace-item-header">
        <h3 className="workspace-item-name">{workspace.name}</h3>
        <span className="badge badge-active">Active</span>
      </div>

      <div className="workspace-meta">
        <div className="meta-row">
          <span>Workspace ID:</span>
          <code>{workspace.id.substring(0, 13)}...</code>
        </div>
        <div className="meta-row">
          <span>Organization ID:</span>
          <code>{workspace.organizationId ? `${workspace.organizationId.substring(0, 13)}...` : 'N/A'}</code>
        </div>
        <div className="meta-row">
          <span>Created:</span>
          <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}