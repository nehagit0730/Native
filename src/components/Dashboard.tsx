import React, { useState } from 'react';
import { Role, Property, CloudinaryFile, WebsitePage, HeaderConfig, FooterConfig, GoogleAuthUser } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { ClientDashboard } from './ClientDashboard';
import {
  INITIAL_FILES,
  INITIAL_PAGES,
  INITIAL_AUDIT_PROPERTIES,
  DEFAULT_HEADER_CONFIG,
  DEFAULT_FOOTER_CONFIG
} from '../services/store';

interface DashboardProps {
  currentRole: Role;
  onRoleChange?: (role: Role) => void;
  properties: Property[];
  savedProperties: Property[];
  clientFiles?: CloudinaryFile[];
  onUploadClientFile?: (file: CloudinaryFile) => void;
  onDeleteClientFile?: (id: string) => void;
  googleUser?: GoogleAuthUser | null;
  onOpenGoogleAuth?: (role?: Role | 'admin', mode?: 'login' | 'signup') => void;
  onSignOutGoogle?: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenPostProperty: () => void;
  onUpdateProperties?: (props: Property[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentRole,
  onRoleChange = () => {},
  properties,
  savedProperties,
  clientFiles = [],
  onUploadClientFile,
  onDeleteClientFile,
  googleUser,
  onOpenGoogleAuth,
  onSignOutGoogle,
  onSelectProperty,
  onOpenPostProperty,
  onUpdateProperties = (_props: Property[]) => {}
}) => {

  // Store States for Admin & Client functionality
  const [auditProperties, setAuditProperties] = useState<Property[]>(INITIAL_AUDIT_PROPERTIES);
  const [files, setFiles] = useState<CloudinaryFile[]>(INITIAL_FILES);
  const [pages, setPages] = useState<WebsitePage[]>(INITIAL_PAGES);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(DEFAULT_HEADER_CONFIG);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);

  // Admin Actions
  const handleApproveProperty = (id: string) => {
    const item = auditProperties.find((p) => p.id === id);
    if (!item) return;

    const approvedItem: Property = {
      ...item,
      approvalStatus: 'approved',
      approvalNotes: 'Approved by Admin',
      verified: true
    };

    // Add to active properties
    onUpdateProperties([approvedItem, ...properties]);
    // Remove from pending audit
    setAuditProperties(auditProperties.filter((p) => p.id !== id));
  };

  const handleRejectProperty = (id: string, notes: string) => {
    setAuditProperties(
      auditProperties.map((p) =>
        p.id === id ? { ...p, approvalStatus: 'rejected', approvalNotes: notes } : p
      )
    );
  };

  const handleRequestChanges = (id: string, notes: string) => {
    setAuditProperties(
      auditProperties.map((p) =>
        p.id === id ? { ...p, approvalStatus: 'changes_requested', approvalNotes: notes } : p
      )
    );
  };

  const handleDeleteProperty = (id: string) => {
    onUpdateProperties(properties.filter((p) => p.id !== id));
  };

  const handleDuplicateProperty = (id: string) => {
    const target = properties.find((p) => p.id === id);
    if (!target) return;
    const baseSlug = (target.slug || target.id || 'property').replace(/^\/+/, '');
    const newSlug = `${baseSlug}-1`;
    const clone: Property = {
      ...target,
      id: `prop-${Date.now()}`,
      title: `${target.title} (Copy)`,
      slug: newSlug,
      viewsCount: 0,
      createdAt: new Date().toISOString()
    };
    onUpdateProperties([clone, ...properties]);
  };

  const handleSaveProperty = (property: Property) => {
    const exists = properties.some((p) => p.id === property.id);
    if (exists) {
      onUpdateProperties(properties.map((p) => (p.id === property.id ? property : p)));
    } else {
      onUpdateProperties([property, ...properties]);
    }
  };

  // Cloudinary File Actions
  const handleUploadFile = (file: CloudinaryFile) => {
    setFiles([file, ...files]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleRenameFile = (id: string, newName: string) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, name: newName } : f)));
  };

  // Pages Actions
  const handleSavePage = (page: WebsitePage) => {
    const exists = pages.some((p) => p.id === page.id);
    if (exists) {
      setPages(pages.map((p) => (p.id === page.id ? page : p)));
    } else {
      setPages([...pages, page]);
    }
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const handleDuplicatePage = (id: string) => {
    const target = pages.find((p) => p.id === id);
    if (!target) return;
    const baseSlug = (target.slug || 'page').replace(/^\/+/, '');
    const newSlug = `${baseSlug}-1`;
    const clone: WebsitePage = {
      ...target,
      id: `page-${Date.now()}`,
      title: `${target.title} (Copy)`,
      slug: newSlug,
      updatedAt: new Date().toISOString()
    };
    setPages([...pages, clone]);
  };

  // RENDER ADMIN OR CLIENT DASHBOARD BASED ON USER ROLE
  if (currentRole === 'admin') {
    return (
      <AdminDashboard
        properties={properties}
        auditProperties={auditProperties}
        files={files}
        pages={pages}
        headerConfig={headerConfig}
        footerConfig={footerConfig}
        onApproveProperty={handleApproveProperty}
        onRejectProperty={handleRejectProperty}
        onRequestChanges={handleRequestChanges}
        onDeleteProperty={handleDeleteProperty}
        onDuplicateProperty={handleDuplicateProperty}
        onSaveProperty={handleSaveProperty}
        onOpenAddProperty={onOpenPostProperty}
        onPreviewProperty={onSelectProperty}
        onUploadFile={handleUploadFile}
        onDeleteFile={handleDeleteFile}
        onRenameFile={handleRenameFile}
        onSavePage={handleSavePage}
        onDeletePage={handleDeletePage}
        onDuplicatePage={handleDuplicatePage}
        onSaveHeaderConfig={setHeaderConfig}
        onSaveFooterConfig={setFooterConfig}
      />
    );
  }

  return (
    <ClientDashboard
      currentRole={currentRole}
      onRoleChange={onRoleChange}
      properties={properties}
      savedProperties={savedProperties}
      clientFiles={clientFiles}
      onUploadClientFile={onUploadClientFile}
      onDeleteClientFile={onDeleteClientFile}
      googleUser={googleUser}
      onOpenGoogleAuth={onOpenGoogleAuth}
      onSignOutGoogle={onSignOutGoogle}
      onSelectProperty={onSelectProperty}
      onOpenPostProperty={onOpenPostProperty}
      onSubmitPropertyForAudit={(newProp) => {
        setAuditProperties([{ ...newProp, approvalStatus: 'pending' }, ...auditProperties]);
      }}
    />
  );
};
