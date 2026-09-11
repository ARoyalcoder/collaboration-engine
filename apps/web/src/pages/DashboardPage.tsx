import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import CreateWorkspaceForm from '../features/workspaces/CreateWorkspaceForm';
import WorkspaceList from '../features/workspaces/WorkspaceList';
import { listMembers } from '../features/workspaces/workspace.service';
import type { Workspace, WorkspaceMember } from '../features/workspaces/workspace.types';

export default function DashboardPage() {
  const { user, accessToken, logout } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [totalWorkspaces, setTotalWorkspaces] = useState<number>(0);

  function handleWorkspaceCreated(workspace: Workspace) {
    setSelectedWorkspace(workspace);
    setShowCreateForm(false);
    setRefreshKey((value) => value + 1);
  }

  useEffect(() => {
    if (!selectedWorkspace || !accessToken) {
      setMembers([]);
      return;
    }

    const token = accessToken;
    const currentWorkspaceId = selectedWorkspace.id;

    async function loadMembers() {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const data = await listMembers(currentWorkspaceId, token);
        setMembers(data);
      } catch (err) {
        setMembersError(
          err instanceof Error ? err.message : 'Unable to load members',
        );
      } finally {
        setMembersLoading(false);
      }
    }

    loadMembers();
  }, [selectedWorkspace, accessToken]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="brand-section">
          <h1>Collaboration Engine</h1>
          <p>Distributed Platform Dashboard</p>
        </div>

        <div className="user-profile-bar">
          <div className="user-info-chip">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-email">{user?.email}</span>
          </div>

          <span className="badge badge-active">{user?.status || 'ACTIVE'}</span>

          <button onClick={logout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      </header>

      {/* KPI Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Workspaces</div>
          <div className="stat-value">{totalWorkspaces}</div>
          <div className="stat-subtitle">Associated workspaces</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Workspace</div>
          <div className="stat-value" style={{ fontSize: '18px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {selectedWorkspace ? selectedWorkspace.name : 'None selected'}
          </div>
          <div className="stat-subtitle">
            {selectedWorkspace ? `${members.length} members loaded` : 'Select a workspace to view data'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Account Status</div>
          <div className="stat-value" style={{ fontSize: '18px' }}>
            {user?.status || 'ACTIVE'}
          </div>
          <div className="stat-subtitle">User ID: {user?.id ? `${user.id.substring(0, 8)}...` : 'N/A'}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Workspaces List */}
        <section className="data-panel">
          <div className="panel-header">
            <h2 className="panel-title">Workspaces</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-secondary btn-sm"
            >
              {showCreateForm ? 'Cancel' : '+ New Workspace'}
            </button>
          </div>

          {showCreateForm && (
            <CreateWorkspaceForm onCreated={handleWorkspaceCreated} />
          )}

          <WorkspaceList
            key={refreshKey}
            selectedWorkspaceId={selectedWorkspace?.id}
            onSelectWorkspace={(ws) => setSelectedWorkspace(ws)}
            onWorkspacesLoaded={(list) => {
              setTotalWorkspaces(list.length);
              if (list.length > 0 && !selectedWorkspace) {
                setSelectedWorkspace(list[0]);
              }
            }}
          />
        </section>

        {/* Right Column: Selected Workspace Data & Members */}
        <section className="data-panel">
          <div className="panel-header">
            <h2 className="panel-title">Workspace Data</h2>
            {selectedWorkspace && (
              <span className="badge badge-role">ID: {selectedWorkspace.id.substring(0, 8)}...</span>
            )}
          </div>

          {selectedWorkspace ? (
            <div>
              {/* Metadata Details */}
              <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Name: </span>
                    <strong>{selectedWorkspace.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Org ID: </span>
                    <code>{selectedWorkspace.organizationId ? `${selectedWorkspace.organizationId.substring(0, 12)}...` : 'N/A'}</code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Created: </span>
                    <span>{new Date(selectedWorkspace.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Updated: </span>
                    <span>{new Date(selectedWorkspace.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Members Section */}
              {(() => {
                const safeMembers = Array.isArray(members) ? members : [];
                return (
                  <>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
                      Workspace Members ({safeMembers.length})
                    </h3>

                    {membersLoading ? (
                      <div className="loading-spinner">Loading members data...</div>
                    ) : membersError ? (
                      <p role="alert" style={{ color: '#ef4444', fontSize: '13px' }}>{membersError}</p>
                    ) : safeMembers.length === 0 ? (
                      <div className="empty-state">No members found in this workspace.</div>
                    ) : (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Member</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {safeMembers.map((member) => (
                            <tr key={member.id}>
                              <td>
                                <strong>{member.user?.name || 'Member'}</strong>
                              </td>
                              <td>{member.user?.email || 'N/A'}</td>
                              <td>
                                <span className="badge badge-role">{member.role}</span>
                              </td>
                              <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="empty-state">
              <p>Select a workspace from the list to view its data.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}