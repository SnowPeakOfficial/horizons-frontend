/**
 * GardenSettingsModal - Beautiful tabbed modal for garden management
 * Edit, Members, and Advanced settings in one elegant interface
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { Garden, GardenMember, GardenDefinition } from '../../types/api.types';
import gardenService from '../../services/gardenService';
import { useGardenStore } from '../../stores/gardenStore';
import Edit from '@mui/icons-material/Edit';
import People from '@mui/icons-material/People';
import Settings from '@mui/icons-material/Settings';
import Close from '@mui/icons-material/Close';
import PersonAdd from '@mui/icons-material/PersonAdd';
import PersonRemove from '@mui/icons-material/PersonRemove';
import ExitToApp from '@mui/icons-material/ExitToApp';
import DeleteForever from '@mui/icons-material/DeleteForever';
import Star from '@mui/icons-material/Star';
import MailOutline from '@mui/icons-material/MailOutline';
import CalendarToday from '@mui/icons-material/CalendarToday';
import LocalFlorist from '@mui/icons-material/LocalFlorist';

interface GardenSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  garden: Garden;
  currentUserId: string;
  currentUserTier: string;
  onGardenUpdated: () => void;
  onGardenDeleted: () => void;
}

type TabType = 'details' | 'members';

export const GardenSettingsModal: React.FC<GardenSettingsModalProps> = ({
  isOpen,
  onClose,
  garden,
  currentUserId,
  currentUserTier: _currentUserTier,
  onGardenUpdated,
  onGardenDeleted,
}) => {
  const navigate = useNavigate();
  const { deleteGarden } = useGardenStore();
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit tab state
  const [gardenTitle, setGardenTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [availableThemes, setAvailableThemes] = useState<GardenDefinition[]>([]);
  
  // Members tab state
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'VIEWER' | 'CONTRIBUTOR'>('CONTRIBUTOR');
  const [inviteError, setInviteError] = useState('');
  
  // Confirmation dialogs
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<GardenMember | null>(null);

  // Check if current user is owner - use ownerId from garden
  const isOwner = garden.ownerId === currentUserId;

  useEffect(() => {
    if (isOpen && garden) {
      setGardenTitle(garden.title);
      setSelectedTheme(garden.gardenDefinition?.key || 'quiet_garden');
      loadAvailableThemes();
    }
  }, [isOpen, garden]);

  const loadAvailableThemes = async () => {
    try {
      const themes = await gardenService.getGardenDefinitions();
      setAvailableThemes(themes);
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const handleSaveGarden = async () => {
    if (!isOwner) return;
    
    setIsLoading(true);
    try {
      await gardenService.updateGarden(garden.id, {
        title: gardenTitle,
        gardenDefinitionKey: selectedTheme,
      });
      onGardenUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update garden:', error);
      alert('Failed to update garden. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!isOwner || !newMemberEmail) return;

    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    setInviteError('');
    setIsLoading(true);
    try {
      await gardenService.addMember(garden.id, {
        email: newMemberEmail,
        role: newMemberRole,
      });
      setNewMemberEmail('');
      setNewMemberRole('CONTRIBUTOR');
      setInviteError('');
      onGardenUpdated();
    } catch (error: unknown) {
      console.error('Failed to add member:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to add member. Please try again.';
      setInviteError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!isOwner || !memberToRemove) return;
    
    setIsLoading(true);
    try {
      await gardenService.removeMember(garden.id, memberToRemove.id);
      setShowRemoveMemberConfirm(false);
      setMemberToRemove(null);
      onGardenUpdated();
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert('Failed to remove member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    if (!isOwner) return;
    
    try {
      await gardenService.updateMemberRole(
        garden.id,
        memberId,
        newRole as 'VIEWER' | 'CONTRIBUTOR'
      );
      onGardenUpdated();
    } catch (error) {
      console.error('Failed to update member role:', error);
      alert('Failed to update member role. Please try again.');
    }
  };

  const handleLeaveGarden = async () => {
    setIsLoading(true);
    try {
      await gardenService.leaveGarden(garden.id);
      setShowLeaveConfirm(false);
      onClose();
      navigate('/my-gardens');
    } catch (error) {
      console.error('Failed to leave garden:', error);
      alert('Failed to leave garden. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGarden = async () => {
    if (!isOwner) return;
    
    setIsLoading(true);
    try {
      await deleteGarden(garden.id);
      setShowDeleteConfirm(false);
      onGardenDeleted();
      onClose();
      navigate('/my-gardens');
    } catch (error) {
      console.error('Failed to delete garden:', error);
      alert('Failed to delete garden. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px" showCloseButton={false} className="garden-settings-modal">
        <div style={containerStyle} className="garden-settings-container">
          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.6';
            }}
            aria-label="Close settings"
          >
            <Close sx={{ fontSize: 20 }} />
          </button>

          {/* Header */}
          <div style={headerStyle}>
            <div style={headerTitleStyle}>
              <Settings sx={{ fontSize: 28, color: theme.colors.rose[500] }} />
              <h2 style={titleTextStyle}>Garden Settings</h2>
            </div>
          </div>

          {/* Tabs */}
          <div style={tabsContainerStyle}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                ...tabButtonStyle,
                ...(activeTab === 'details' ? activeTabStyle : {}),
              }}
            >
              <Edit sx={{ fontSize: 18 }} />
              Details
            </button>
            <button
              onClick={() => setActiveTab('members')}
              style={{
                ...tabButtonStyle,
                ...(activeTab === 'members' ? activeTabStyle : {}),
              }}
            >
              <People sx={{ fontSize: 18 }} />
              Members
            </button>
          </div>

          {/* Tab Content */}
          <div style={tabContentStyle}>
            {activeTab === 'details' && (
              <div style={tabPanelStyle}>
                <h3 style={sectionTitleStyle}>Garden Details</h3>
                
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Garden Name</label>
                  <Input
                    value={gardenTitle}
                    onChange={(e) => setGardenTitle(e.target.value)}
                    placeholder="My Beautiful Garden"
                    disabled={!isOwner}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>
                    Theme
                    <span style={{ fontSize: '12px', color: theme.text.secondary, marginLeft: '8px' }}>
                      (Coming soon)
                    </span>
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    style={{
                      ...selectStyle,
                      opacity: 0.6,
                      cursor: 'not-allowed',
                    }}
                    disabled={true}
                  >
                    {availableThemes.map((themeOption) => (
                      <option key={themeOption.id} value={themeOption.key}>
                        {themeOption.displayName}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '12px', color: theme.text.secondary, marginTop: '4px', marginBottom: 0 }}>
                    More garden themes are coming soon
                  </p>
                </div>

                {/* Garden Info */}
                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <CalendarToday sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                    <span style={infoLabelStyle}>Created</span>
                    <span style={infoValueStyle}>{formatDate(garden.createdAt)}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <CalendarToday sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                    <span style={infoLabelStyle}>Last Updated</span>
                    <span style={infoValueStyle}>{formatDate(garden.updatedAt)}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <LocalFlorist sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                    <span style={infoLabelStyle}>Total Flowers</span>
                    <span style={infoValueStyle}>{garden._count?.flowers || 0}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <People sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                    <span style={infoLabelStyle}>Total Members</span>
                    <span style={infoValueStyle}>{(garden.members?.length || 0) + 1}</span>
                  </div>
                </div>

                {isOwner && (
                  <>
                    <div style={actionsStyle}>
                      <Button
                        variant="primary"
                        onClick={handleSaveGarden}
                        disabled={isLoading || (gardenTitle === garden.title && selectedTheme === garden.gardenDefinition?.key)}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>

                    {/* Danger Zone */}
                    <div style={dangerZoneStyle}>
                      <h4 style={dangerTitleStyle}>Danger Zone</h4>
                      <p style={dangerDescStyle}>
                        Deleting this garden will permanently remove all flowers and data. This action cannot be undone.
                      </p>
                      
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                      >
                        <DeleteForever sx={{ fontSize: 18 }} />
                        Delete Garden Permanently
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div style={tabPanelStyle}>
                <h3 style={sectionTitleStyle}>Garden Members</h3>
                
                {/* Member List — owner row always first, then invited members */}
                <div style={memberListStyle}>
                  {/* Owner row — synthesised from garden.owner / garden.ownerId */}
                  {(() => {
                    const ownerName = garden.owner?.name;
                    const ownerEmail = garden.owner?.email;
                    const avatarLetter = (ownerName?.[0] || ownerEmail?.[0] || '?').toUpperCase();
                    return (
                      <div style={memberItemStyle} className="member-item">
                        <div style={memberInfoStyle} className="member-info">
                          <div style={memberAvatarStyle}>{avatarLetter}</div>
                          <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <div style={memberNameStyle} className="member-name">
                              {ownerName || ownerEmail || 'Garden Owner'}
                              {garden.ownerId === currentUserId && (
                                <span style={{ marginLeft: '6px', fontSize: '11px', color: theme.text.secondary, fontWeight: 400 }}>
                                  (you)
                                </span>
                              )}
                            </div>
                            {ownerEmail && (
                              <div style={memberEmailStyle} className="member-email">{ownerEmail}</div>
                            )}
                          </div>
                        </div>
                        <div style={memberRoleContainerStyle}>
                          <span style={{ ...memberRoleBadgeStyle, ...ownerBadgeStyle }}>
                            <Star sx={{ fontSize: 14 }} />
                            OWNER
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {garden.members?.map((member) => (
                    <div key={member.id} style={memberItemStyle} className="member-item">
                      <div style={memberInfoStyle} className="member-info">
                        <div style={memberAvatarStyle}>
                          {(member.user?.name?.[0] || member.displayName?.[0] || member.email?.[0] || '?').toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div style={memberNameStyle} className="member-name">
                            {member.user?.name || member.displayName || member.email}
                          </div>
                          <div style={memberEmailStyle} className="member-email">
                            {member.email}
                            {!member.isRegistered && (
                              <span style={{ marginLeft: '6px', color: theme.colors.rose[500], fontSize: '11px' }}>
                                (Pending)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={memberRoleContainerStyle} className="member-role-actions">
                        {member.role === 'OWNER' ? (
                          <span style={{
                            ...memberRoleBadgeStyle,
                            ...ownerBadgeStyle,
                          }}>
                            <Star sx={{ fontSize: 14 }} />
                            {member.role}
                          </span>
                        ) : isOwner ? (
                          // Editable dropdown for non-owner members (owners only)
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                            style={roleSelectStyle}
                          >
                            <option value="VIEWER">Viewer</option>
                            <option value="CONTRIBUTOR">Contributor</option>
                          </select>
                        ) : (
                          // Read-only badge for non-owners viewing
                          <span style={memberRoleBadgeStyle}>
                            {member.role}
                          </span>
                        )}
                        {isOwner && member.role !== 'OWNER' && (
                          <button
                            onClick={() => {
                              setMemberToRemove(member);
                              setShowRemoveMemberConfirm(true);
                            }}
                            style={removeButtonStyle}
                          >
                            <PersonRemove sx={{ fontSize: 16 }} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Member (Owner Only) */}
                {isOwner && (
                  <div style={addMemberSectionStyle}>
                    <h4 style={subSectionTitleStyle}>
                      <PersonAdd sx={{ fontSize: 18 }} />
                      Invite Member
                    </h4>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Email Address</label>
                      <Input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => {
                          setNewMemberEmail(e.target.value);
                          if (inviteError) setInviteError('');
                        }}
                        placeholder="member@example.com"
                      />
                      {inviteError && (
                        <p style={{
                          marginTop: '6px',
                          marginBottom: 0,
                          fontSize: '13px',
                          color: '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          ⚠ {inviteError}
                        </p>
                      )}
                    </div>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Role</label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value as 'VIEWER' | 'CONTRIBUTOR')}
                        style={selectStyle}
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="CONTRIBUTOR">Contributor</option>
                      </select>
                    </div>
                    <Button
                      variant="primary"
                      onClick={handleAddMember}
                      disabled={isLoading || !newMemberEmail}
                      style={{ width: '100%' }}
                    >
                      {isLoading ? 'Sending...' : 'Send Invitation'}
                    </Button>
                    <p style={{ margin: '10px 0 0', fontSize: '12px', color: theme.text.secondary, textAlign: 'center', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '5px' }}>
                      <MailOutline sx={{ fontSize: 15, color: theme.colors.rose[400], marginTop: '2px', flexShrink: 0 }} />
                      They'll receive an email with a link to access this garden, and a notification whenever a flower is planted for them.
                    </p>
                  </div>
                )}

                {/* Leave Garden (Non-owners) */}
                {!isOwner && (
                  <div style={dangerSectionStyle}>
                    <Button
                      variant="ghost"
                      onClick={() => setShowLeaveConfirm(true)}
                      style={{ width: '100%', color: theme.colors.rose[600] }}
                    >
                      <ExitToApp sx={{ fontSize: 18 }} />
                      Leave Garden
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteGarden}
        title="Delete Garden?"
        message="This will permanently delete this garden and all its flowers. This action cannot be undone."
        confirmText="Delete Forever"
        variant="danger"
        isLoading={isLoading}
      />

      <ConfirmationDialog
        isOpen={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        onConfirm={handleLeaveGarden}
        title="Leave Garden?"
        message="Are you sure you want to leave this garden? You'll need to be re-invited to access it again."
        confirmText="Leave Garden"
        variant="warning"
        isLoading={isLoading}
      />

      <ConfirmationDialog
        isOpen={showRemoveMemberConfirm}
        onClose={() => {
          setShowRemoveMemberConfirm(false);
          setMemberToRemove(null);
        }}
        onConfirm={handleRemoveMember}
        title="Remove Member?"
        message={`Are you sure you want to remove ${memberToRemove?.user?.name || 'this member'} from the garden?`}
        confirmText="Remove"
        variant="warning"
        isLoading={isLoading}
      />
    </>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  position: 'relative',
  background: '#FFFFFF',
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.xl,
  animation: 'unfoldLetter 0.4s ease-out',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(255, 201, 217, 0.3)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s ease',
  boxShadow: 'none',
  zIndex: 10,
  opacity: 0.6,
  color: theme.text.primary,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing.xl,
  borderBottom: `1px solid ${theme.border.light}`,
};

const headerTitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
};

const titleTextStyle: React.CSSProperties = {
  ...typography.styles.h4,
  margin: 0,
  color: theme.text.primary,
  fontWeight: 600,
};

const tabsContainerStyle: React.CSSProperties = {
  display: 'flex',
  borderBottom: `1px solid ${theme.border.light}`,
  padding: `0 ${theme.spacing.xl}`,
  gap: theme.spacing.sm,
};

const tabButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.xs,
  color: theme.text.secondary,
  fontSize: '14px',
  fontWeight: 500,
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'transparent',
  transition: 'all 0.2s ease',
  position: 'relative',
  top: '1px',
};

const activeTabStyle: React.CSSProperties = {
  color: theme.colors.rose[600],
  borderBottomColor: theme.colors.rose[500],
};

const tabContentStyle: React.CSSProperties = {
  padding: theme.spacing.xl,
  minHeight: '400px',
};

const tabPanelStyle: React.CSSProperties = {
  animation: 'fadeIn 0.3s ease-in',
};

const sectionTitleStyle: React.CSSProperties = {
  ...typography.styles.h5,
  marginTop: 0,
  marginBottom: theme.spacing.lg,
  color: theme.text.primary,
  fontWeight: 600,
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: theme.spacing.lg,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: theme.spacing.xs,
  fontSize: '14px',
  fontWeight: 500,
  color: theme.text.secondary,
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.border.light}`,
  fontSize: '15px',
  color: theme.text.primary,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const actionsStyle: React.CSSProperties = {
  marginTop: theme.spacing.xl,
  marginBottom: theme.spacing.xl,
  display: 'flex',
  justifyContent: 'flex-end',
};

const memberListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.xl,
};

const memberItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing.md,
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: theme.radius.md,
  border: '1px solid rgba(232, 180, 184, 0.3)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s ease',
};

const memberInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
};

const memberAvatarStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.colors.rose[400]}, ${theme.colors.rose[500]})`,
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: '16px',
};

const memberNameStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 500,
  color: theme.text.primary,
  marginBottom: '2px',
};

const memberEmailStyle: React.CSSProperties = {
  fontSize: '13px',
  color: theme.text.secondary,
};

const memberRoleContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
};

const memberRoleBadgeStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: theme.radius.sm,
  fontSize: '12px',
  fontWeight: 500,
  background: theme.colors.rose[50],
  color: theme.colors.rose[700],
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const ownerBadgeStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${theme.colors.rose[400]}, ${theme.colors.rose[500]})`,
  color: '#FFFFFF',
};

const removeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.text.secondary,
  transition: 'all 0.2s ease',
};

const addMemberSectionStyle: React.CSSProperties = {
  padding: theme.spacing.lg,
  background: '#F9FAFB',
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.border.light}`,
};

const subSectionTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: theme.text.primary,
  marginTop: 0,
  marginBottom: theme.spacing.md,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.xs,
};

const dangerSectionStyle: React.CSSProperties = {
  marginTop: theme.spacing.xl,
  paddingTop: theme.spacing.xl,
  borderTop: `1px solid ${theme.border.light}`,
};

const infoGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing.md,
  marginBottom: theme.spacing.xl,
};

const infoItemStyle: React.CSSProperties = {
  padding: theme.spacing.md,
  background: '#F9FAFB',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.border.light}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: theme.text.secondary,
  fontWeight: 500,
};

const infoValueStyle: React.CSSProperties = {
  fontSize: '14px',
  color: theme.text.primary,
  fontWeight: 500,
};

const dangerZoneStyle: React.CSSProperties = {
  padding: theme.spacing.lg,
  background: '#FEF2F2',
  borderRadius: theme.radius.lg,
  border: '1px solid #FEE2E2',
};

const dangerTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#DC2626',
  marginTop: 0,
  marginBottom: theme.spacing.sm,
};

const dangerDescStyle: React.CSSProperties = {
  fontSize: '14px',
  color: theme.text.secondary,
  marginBottom: theme.spacing.lg,
};

const roleSelectStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.border.light}`,
  fontSize: '13px',
  fontWeight: 500,
  color: theme.text.primary,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minWidth: '110px',
};
